import express from 'express'
import { addCategory, addSubCategory, deleteCategory, deleteSubCategory, getCategory, getMenuCategory } from '../controllers/menu.js'
const router = express.Router()

router.post('/addCategory', addCategory)
router.post('/addSubCategory', addSubCategory)
router.delete('/deleteCategory', deleteCategory)
router.delete('/deleteSubCategory', deleteSubCategory)
router.get('/getCategory', getCategory)
router.get('/getMenuCategory', getMenuCategory)

export default router