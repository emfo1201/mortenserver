import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'

export const signin = async (req, res) => {
    console.log("signin")
    const { username, password } = req.body;
    try {
        console.log("login");
        const existingUser = await User.findOne({ userName: username });

        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const isPassword = await bcrypt.compare(password, existingUser.password);

        if (!isPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userName: existingUser.userName, id: existingUser._id },
            'henry',
            { expiresIn: "1h" }
        );

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { username, password } = req.body
    console.log("user: ", username, " pass: ", password)
    
    try {
       const existingUser = await User.findOne({userName: username})
        console.log("existing user: ", existingUser)
        if(existingUser)
            return res.status(400).json("User already exists")
        console.log("innan crypt")
        var hashPassword = bcrypt.hashSync(password, 12);
        console.log("after hashPassword")
        const result = await User.create({ userName: username, password: hashPassword })
        console.log("after result")
        const token = jwt.sign({ userName: result.username, id: result._id }, 'henry', { expiresIn: "1h" })
        console.log("after token")
        return res.status(200).json({ result, token })
    } catch(error) {
        console.error("Fel vid registrering:", error);
        return res.status(500).json("Something went wrong")
    }
}