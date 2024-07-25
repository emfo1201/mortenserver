import mongoose from 'mongoose';
import Player from '../models/Player.js';
import AWS from 'aws-sdk';
import Jimp from 'jimp';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

export const getPlayer = async (req, res) => {
    try {
        const players = await Player.find();
        return res.status(200).json(players);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const getPlayers = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const players = await Player.find({
            category: searchQuery.split(',')[0],
            subCategory: searchQuery.split(',')[1],
        });

        return res.json({ data: players });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const getPlayerById = async (req, res) => {
    const { id } = req.params;

    try {
        const player = await Player.findById(id);

        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        return res.status(200).json(player);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const addPlayer = async (req, res) => {
    const categories = JSON.parse(req.body.categories);
    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    try {
        const compressedImages = await Promise.all(
            req.files.map(async (file) => {
                const image = await Jimp.read(file.buffer);
                await image.resize(800, Jimp.AUTO).quality(80);
                const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

                const uploadParams = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: `${Date.now()}-${file.originalname}`,
                    Body: buffer,
                    ACL: 'public-read',
                    ContentType: Jimp.MIME_JPEG
                };

                const data = await s3.upload(uploadParams).promise();
                return data.Location;
            })
        );

        let main = [];
        let sub = [];

        if (Array.isArray(categories)) {
            categories.forEach((category) => {
                main.push(category.main);
                sub.push(category.sub);
            });
        } else {
            main.push(categories.main);
            sub.push(categories.sub);
        }

        const newPlayer = new Player({
            name: req.body.name,
            category: main,
            subCategory: sub,
            club: req.body.club,
            infoEnglish: req.body.infoEnglish,
            infoNorwegian: req.body.infoNorwegian,
            images: compressedImages,
        });

        await newPlayer.save();
        res.json(newPlayer);

    } catch (error) {
        console.error('Error: ', error);
        res.status(400).json('Error: ' + error.message);
    }
};

export const deletePlayer = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No player with id: ${id}`);

    try {
        const player = await Player.findById(id);
        if (!player) return res.status(404).send(`No player with id: ${id}`);

        // Delete images from S3
        await Promise.all(player.images.map(async (imageUrl) => {
            const key = imageUrl.split('/').pop();
            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
            };
            await s3.deleteObject(deleteParams).promise();
        }));

        await Player.findByIdAndRemove(id);
        res.json({ message: 'Player deleted' });

    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { name, club, infoEnglish, infoNorwegian, categories } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No player with id: ${id}`);

    try {
        const updatedCategories = JSON.parse(categories);

        const mainCategories = [];
        const subCategories = [];

        if (Array.isArray(updatedCategories)) {
            updatedCategories.forEach((category) => {
                mainCategories.push(category.main);
                subCategories.push(category.sub);
            });
        } else {
            mainCategories.push(updatedCategories.main);
            subCategories.push(updatedCategories.sub);
        }

        const updatedPlayer = await Player.findByIdAndUpdate(id, {
            name,
            club,
            infoEnglish,
            infoNorwegian,
            category: mainCategories,
            subCategory: subCategories
        }, { new: true });

        res.json(updatedPlayer);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};