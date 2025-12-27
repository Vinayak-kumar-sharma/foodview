import express from 'express'
import { authUsermiddleware } from '../middleware/user.middleware.js'
import { commentReel, getProfile, likeReel, saveReel } from '../controller/profile.controller.js'

const router = express.Router()

router.get("/profile",authUsermiddleware,getProfile)
router.post("/:id/save",authUsermiddleware,saveReel)
router.post("/:id/like",authUsermiddleware,likeReel)
router.post("/:id/comment",authUsermiddleware,commentReel)

export default router