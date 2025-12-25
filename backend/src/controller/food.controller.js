import { uploadFile } from "../services/storage.services.js";
import { v4 as uuid } from "uuid";
import { pool } from "../db/db.js";

export async function foodItem(req, res) {
  const foodpartnerId = req.foodpartner.id
  console.log(foodpartnerId)
  try {
  const { name, description} = req.body
  const foodpartnerId = req.foodpartner.id
  if(!req.file){
    return res.status(400).json({message:"False: video file is required"})
  }
  if(!name){
    return res.status(400).json({message:"False: name is required"})
  }
  const uploadResult = await uploadFile(req.file.buffer,uuid())
  const foodId = uuid()
  const newfoodItem = await pool.query(`INSERT INTO fooditem (name, description, video, foodpartner_id) VALUES ($1,$2,$3,$4) RETURNING *`,[foodId,name, description, uploadResult.url, foodpartnerId])
  
  const newitem = newfoodItem.rows[0]

  res.status(200).json({message:"True : food-item creeated successfully"},{newitem})

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fooditem" });
  }
}
