//controllers/menu.js
import express from "express";
import mongoose from "mongoose";
import Menu from "../models/Menu.js";

const router = express.Router();

export const addCategory = (req, res) => {
  Menu.findOne({ mainMenu: req.body.newCategory }).then(async (menu) => {
    if (menu) {
      return res.status(404).json("Category already exists");
    }

    const newCategory = new Menu({
      mainMenu: req.body.newCategory,
    });

    await newCategory
      .save()
      .then((newCategory) => res.json("Category " + newCategory + " added!"))
      .catch((err) => res.sendStatus(400).json("Error: " + err));
  });
};

export const addSubCategory = async (req, res) => {
  try {
    Menu.findOneAndUpdate(
      { mainMenu: req.body.category },
      { $addToSet: { subMenu: req.body.newSubCategory } },
      { new: true, useFindAndModify: false },
      function (err, menu) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        if (!menu) {
          return res.sendStatus(404);
        }
        if (menu) {
          menu.save(function (err) {
            if (err) {
              res.send("Error: ", err);
            } else {
              return res.sendStatus(200);
            }
          });
        }
      }
    );
  } catch (err) {
    console.log("Error: " + err);
    return false;
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No category with that id");

  await Menu.findByIdAndRemove(id);

  res.json({ message: "Category deleted successfully" });
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryName } = req.body;

    const category = await Menu.findById(categoryId);

    if (!category) {
      return res.status(404).send("No category with that id");
    }

    category.subMenu = category.subMenu.filter(
      (subCategory) => subCategory.name !== subCategoryName
    );

    await category.save();

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};

export const getMenuCategory = (req, res) => {
  Menu.find({ subMenu: { $exists: true, $not: { $size: 0 } } })
    .then((categories) => res.json(categories))
    .catch((err) => res.sendStatus(400).json("Error: " + err));
};

export const getCategory = async (req, res) => {
  Menu.find()
    .then((categories) => res.json(categories))
    .catch((err) => res.sendStatus(400).json("Error: " + err));
};
