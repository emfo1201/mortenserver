// controllers/user.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User.js";

dotenv.config();

// Function to validate token
export const validateToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    return res.status(200).json(decoded);
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;
  try {
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
      process.env.JWT,
      { expiresIn: "24h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  res.clearCookie(token); // Ta bort cookie
  res.status(200).json({ message: "Logout successful" });
};

export const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ userName: username });
    if (existingUser) return res.status(400).json("User already exists");
    var hashPassword = bcrypt.hashSync(password, 12);
    const result = await User.create({
      userName: username,
      password: hashPassword,
    });
    const token = jwt.sign(
      { userName: result.username, id: result._id },
      process.env.JWT,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result, token });
  } catch (error) {
    console.error("Fel vid registrering:", error);
    return res.status(500).json("Something went wrong");
  }
};
