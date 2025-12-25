import express from 'express'
import authFoodPartnermiddleware from '../middleware/auth.middleware.js'
import { foodItem } from '../controller/food.controller.js'
import multer from 'multer'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage()
})
router.post("/fooditem",authFoodPartnermiddleware, upload.single("video"),foodItem)

export default router