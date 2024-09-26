// models/Player.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Skapa ett schema för kategorier med både huvud- och subkategori
const categorySchema = new Schema({
  main: String, // Huvudkategori
  sub: String, // Tillhörande subkategori
});

// Använd det nya kategorischemat i ditt playerschema
const playerSchema = new Schema({
  name: String,
  category: [categorySchema], // Array av objekt som innehåller main och sub
  club: String,
  infoEnglish: String,
  infoNorwegian: String,
  images: [String],
});

let Player = mongoose.model("Player", playerSchema);

export default Player;
