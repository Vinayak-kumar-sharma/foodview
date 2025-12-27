import express from 'express'
import {getLogin, getpartner, getpartnerLogin, getStore, getuser, loginfoodPartner, loginUser, logoutfoodPartner, logoutUser, registerfoodPartner, registerUser } from '../controller/auth.controller.js'
import { authUsermiddleware } from '../middleware/user.middleware.js'
import authFoodPartnermiddleware from '../middleware/auth.middleware.js'
import { getfoodItem } from '../controller/food.controller.js'

const router = express.Router()

router.get("/user/signup", getuser)
router.post("/user/register", registerUser)
router.get("/home",authUsermiddleware,getfoodItem)
router.get("/user/login",getLogin)
router.post("/user/login", loginUser)
router.get("/user/logout", logoutUser)

// Food Partner routes 
router.get("/foodpartner/signup",getpartner)
router.post("/foodpartner/register",registerfoodPartner)
router.get("/foodpartner/login",getpartnerLogin)
router.post("/foodpartner/login",loginfoodPartner)
router.get("/foodpartner/logout",logoutfoodPartner)

router.get("/store",authFoodPartnermiddleware,getStore)


export default router;