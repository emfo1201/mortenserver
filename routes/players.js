// routes/players.js
import express from "express";
import {
  getPlayer,
  getPlayers,
  getPlayerById,
  getPlayersBySearch,
  addPlayer,
  deletePlayer,
  updatePlayer,
} from "../controllers/player.js";
import multer from "multer";
import auth from "../middleware/auth.js";

const router = express.Router();

// Definiera multer lagringsinställningar
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 200, // Max filstorlek 5MB
  },
});

// Define routes
router.get("/", getPlayer);
router.get("/listPlayers", getPlayers);
router.get("/search", getPlayersBySearch);
router.get("/:id", getPlayerById);
router.post("/", auth, upload.array("images", 5), addPlayer);
router.post("/updatePlayer/:id", auth, upload.array("images", 5), updatePlayer);
router.delete("/:id", auth, deletePlayer);

export default router;
