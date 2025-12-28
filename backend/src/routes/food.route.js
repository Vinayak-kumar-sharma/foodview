import express from 'express'
import authFoodPartnermiddleware from '../middleware/auth.middleware.js'
import { addfooditem, foodItem, getfoodbyId, getstorebyId} from '../controller/food.controller.js'
import multer from 'multer'


const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage()
})
router.post("/fooditem",authFoodPartnermiddleware, upload.single("video"),foodItem)
router.get("/fooditem",authFoodPartnermiddleware,addfooditem)
router.get("/store",authFoodPartnermiddleware,getfoodbyId)
router.get("/store/:id",getstorebyId)


export default router