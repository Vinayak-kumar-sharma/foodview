// create server
import express from 'express';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import userRoute from './routes/auth.route.js'
import foodRoute from './routes/food.route.js'
const app = express()

dotenv.config()

app.use(cookieParser())
app.use(express.json())

app.get("/",(req, res)=>{
  res.send("hell world");
})

app.use("/api",userRoute)
app.use("/api",foodRoute)

export default app
