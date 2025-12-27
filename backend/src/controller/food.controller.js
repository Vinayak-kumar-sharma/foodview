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

  res.status(200).redirect("/api/store")

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fooditem" });
  }
}
export async function addfooditem(req, res) {
  res.render("fooditem")
}
export async function getfoodItem(req, res){
  try {
    const foodItems = await pool.query(
      `SELECT
        f.id,
        f.name as reel_name,
        f.video,
        f.description,
        p.id AS partner_id,
        p.name as partner_name
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
  try {
    const foodpartnerId = req.foodpartner.id

    const statsQuery = `select f.id, f.name, count(distinct i.id) as total_meals, count(l.id) as total_likes from foodpartner as f left join fooditem as i on f.id = i.foodpartner_id left join likes as l on i.id = l.reel_id where f.id = $1 group by f.id, f.name;`;

    const videoQuery = `select name, video, description from fooditem where foodpartner_id = $1`;

    const stats = await pool.query(statsQuery,[foodpartnerId])

    const videos = await pool.query(videoQuery,[foodpartnerId])

    res.render("visitstore",{partner:stats.rows[0], video:videos.rows})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"server error from getfoodbyid"})
  }
}
export async function getstorebyId(req,res) {
  try {
    const foodpartnerId = req.params.id

    const statsQuery = `select f.id, f.name, count(distinct i.id) as total_meals, count(l.id) as total_likes from foodpartner as f left join fooditem as i on f.id = i.foodpartner_id left join likes as l on i.id = l.reel_id where f.id = $1 group by f.id, f.name;`;

    const videoQuery = `select name, video, description from fooditem where foodpartner_id = $1`;

    const stats = await pool.query(statsQuery,[foodpartnerId])

    const videos = await pool.query(videoQuery,[foodpartnerId])

    res.render("visitstore",{partner:stats.rows[0], video:videos.rows})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"server error from getfoodbyid"})
  }
}
