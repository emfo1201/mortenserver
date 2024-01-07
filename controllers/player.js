import express from 'express'
import mongoose from 'mongoose'
import Player from'../models/Player.js'
import multer from 'multer'
const router = express.Router()



const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({storage: fileStorageEngine})

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
    console.log("players")
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
    console.log("cat", categories)
    if (!req.userId) return res.json({ message: 'Unauthenticated' });
    const images = req.files.map((file) => file.filename);
    console.log(images[0])
    let main = [];
    let sub = [];
    let files = [];
    console.log('Uploaded files:', req.files);
    try {
        // Process the categories array as needed.
        if (Array.isArray(categories)) {
            categories.forEach((category) => {
              main.push(category.main);
              sub.push(category.sub);
            });
          } else {
            main.push(categories.main);
            sub.push(categories.sub);
          }
        console.log("category tillagd")
        if (req.files && Array.isArray(req.files)) {
            req.files.forEach((file) => {
                files.push(file.filename);
            });
        } else {
            files.push(req.files.filename);
        }
        console.log("main ", main, "sub ", sub)
        const newPlayer = new Player({
            name: req.body.name,
            category: main,
            subCategory: sub,
            club: req.body.club,
            infoEnglish: req.body.infoEnglish,
            infoNorwegian: req.body.infoNorwegian,
            images: files,
          });
        console.log("efter newPlayer")
        await newPlayer.save();
        const savedImages = req.files.map((file) => `/${file.filename}`);
        res.json(newPlayer);

    } catch (error) {
        console.error('Error: ', error);
        res.status(400).json('Error: ' + error.message);
      }
};

export const deletePlayer = async (req, res) => {
    console.log("hello delete")
    const { id } = req.params
    if(!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No player with id: ${id}`)

    await Player.findByIdAndRemove(id)
    res.json({ message: 'P deleted' })
}

export const updatePlayer = async (req, res) => {
    const { id } = req.params
    const { name, club, infoEnglish, infoNorwegian, category, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPlayer = { name, club, infoEnglish, infoNorwegian, category, images, _id: id };

    await Player.findByIdAndUpdate(id, updatedPlayer, { new: true });

    res.json(updatedPlayer);
}