import express from 'express'
import authFoodPartnermiddleware from '../middleware/auth.middleware.js'
import { addfooditem, deletefooditembyId, editfooditembyID, foodItem, getdishbyId, getfoodbyId, getstorebyId} from '../controller/food.controller.js'
import multer from 'multer'


const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage()
})
router.post("/fooditem",authFoodPartnermiddleware, upload.single("video"),foodItem)
router.get("/fooditem",authFoodPartnermiddleware,addfooditem)
router.get("/store",authFoodPartnermiddleware,getfoodbyId)
router.get("/store/:id",getstorebyId)
router.get("/partner/:partnerId/dish/:dishId",getdishbyId)
router.get("/foodpartner/edit/:id",authFoodPartnermiddleware,editfooditembyID)
router.delete("/delete/:id",authFoodPartnermiddleware, deletefooditembyId)


export default router