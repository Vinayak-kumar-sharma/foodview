import jwt from 'jsonwebtoken'
import { pool } from '../db/db.js'

export async function authUsermiddleware(req, res, next){
  try {
    const token = req.cookies.token
    if(!token){
      return res.status(400).json({message:"False : token required"})
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.user = {id:decoded.userId}
    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:"Server Error"})
  }
}