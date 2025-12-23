// create server
import express from 'express';

const app = express()

app.use(express.json())

app.get("/",(req, res)=>{
  res.send("hell world");
})

export default app
