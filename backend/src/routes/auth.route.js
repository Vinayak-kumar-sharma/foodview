import express from 'express'
import { loginfoodPartner, loginUser, logoutfoodPartner, logoutUser, registerfoodPartner, registerUser } from '../controller/auth.controller.js'

const router = express.Router()

router.post("/user/register", registerUser)
router.post("/user/login", loginUser)
router.get("/user/logout", logoutUser)

// Food Partner routes 

router.post("/foodpartner/register",registerfoodPartner)
router.post("/foodpartner/login",loginfoodPartner)
router.get("/foodpartner/logout",logoutfoodPartner)


export default router;