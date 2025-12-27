import express from 'express'
import authFoodPartnermiddleware from '../middleware/auth.middleware.js'
import { foodItem, getfoodbyId, getfoodItem } from '../controller/food.controller.js'
import multer from 'multer'
import { authUsermiddleware } from '../middleware/user.middleware.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage()
})
router.post("/fooditem",authFoodPartnermiddleware, upload.single("video"),foodItem)
router.get("/store/:id",authUsermiddleware,getfoodbyId)

export default router