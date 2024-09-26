// models/Menu.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const menuSchema = new Schema({
  mainMenu: {
    type: String,
    required: true,
    unique: true,
  },
  subMenu: {
    type: [String],
    required: false,
    unique: false,
  },
});

let Menu = mongoose.model("Menu", menuSchema);

export default Menu;
