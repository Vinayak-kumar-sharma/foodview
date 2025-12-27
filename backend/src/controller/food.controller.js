import { uploadFile } from "../services/storage.services.js";
import { v4 as uuid } from "uuid";
import { pool } from "../db/db.js";

export async function foodItem(req, res) {
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
  
  const newfoodItem = await pool.query(`INSERT INTO fooditem (name, description, video, foodpartner_id) VALUES ($1,$2,$3,$4) RETURNING *`,[name, description, uploadResult.url, foodpartnerId])
  
  const newitem = newfoodItem.rows[0]

  res.status(200).json({message:"True : food-item creeated successfully"},{newitem})

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fooditem" });
  }
}

export async function getfoodItem(req, res){
  try {
    const foodItems = await pool.query(
      `SELECT
        f.name,
        f.video,
        f.description,
        p.id AS partner_id,
        p.name
      FROM fooditem f
      JOIN foodpartner p ON f.foodpartner_id = p.id
      ORDER BY f.id DESC`
      )
    res.render("home", { reels: foodItems.rows });
  } catch (error) {
    return res.status(500).json({message:"Server Error"})
  }
}

export async function getfoodbyId(req,res) {
  const {id} = req.params
  const result = await pool.query("SELECT * from foodpartner where id = $1",[id])

  res.render("visitstore",({store: result.rows[0]}))
}
