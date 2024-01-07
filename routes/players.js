import express from 'express'
import { getPlayer, getPlayers, getPlayerById, addPlayer, deletePlayer, updatePlayer } from '../controllers/player.js'
import multer from "multer";
import  auth from '../middleware/auth.js'
const router = express.Router()

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "--" + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({storage: fileStorageEngine})

router.get('/', getPlayer)
router.get('/search', getPlayers)
router.get('/:id', getPlayerById)
router.post('/', auth, upload.array("images", 5), addPlayer)
router.delete('/:id', auth, deletePlayer)
router.patch('/:id', auth, updatePlayer)

export default router