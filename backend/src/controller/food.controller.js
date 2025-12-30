import { uploadFile } from "../services/storage.services.js";
import { v4 as uuid } from "uuid";
import { pool } from "../db/db.js";
import imagekit from "../services/storage.services.js";

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

  res.redirect('/api/store');

  } catch (error) {
    console.error(error);
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

export async function addfooditem(req, res) {
  res.render("fooditem")
}

/* this is for the home to show all the fooditems*/
export async function getfoodItem(req, res){
  try {
    const targetReelId = req.query.reelId || null;
    const foodItems = await pool.query(
      `SELECT
          f.id,
          f.name AS reel_name,
          f.video,
          f.description,

          p.id AS partner_id,
          p.name AS partner_name,

          COALESCE(l.likes_count, 0) AS likes_count,
          COALESCE(c.comments_count, 0) AS comments_count,
          COALESCE(sv.saves_count, 0) AS saves_count

      FROM fooditem f
      JOIN foodpartner p ON f.foodpartner_id = p.id

      LEFT JOIN (
          SELECT reel_id, COUNT(*) AS likes_count
          FROM likes
          GROUP BY reel_id
      ) l ON f.id = l.reel_id

      LEFT JOIN (
          SELECT reel_id, COUNT(*) AS comments_count
          FROM comments
          GROUP BY reel_id
      ) c ON f.id = c.reel_id

      LEFT JOIN (
          SELECT reel_id, COUNT(*) AS saves_count
          FROM usersave
          GROUP BY reel_id
      ) sv ON f.id = sv.reel_id

      ORDER BY f.id DESC;
                          `)
    res.render("home", { reels: foodItems.rows, targetReelId });
  } catch (error) {
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

/* here this shows only selected fooditem video*/

export async function getfooditemReelbyId(req, res) {
  try {
    const reelId = req.params.id
    const query = `
    SELECT
    r.video,
    r.name,
    COALESCE(l.likes_count, 0) AS likes_count,
    COALESCE(c.comments_count, 0) AS comments_count,
    COALESCE(sv.saves_count, 0) AS saves_count
    FROM fooditem r
    LEFT JOIN (
    SELECT reel_id, COUNT(*) AS likes_count
    FROM likes
    GROUP BY reel_id
    ) l ON r.id = l.reel_id
    LEFT JOIN (
    SELECT reel_id, COUNT(*) AS comments_count
    FROM comments
    GROUP BY reel_id
    ) c ON r.id = c.reel_id
    LEFT JOIN (
    SELECT reel_id, COUNT(*) AS saves_count
    FROM usersave
    GROUP BY reel_id
    ) sv ON r.id = sv.reel_id;
    `;
    const result  = await pool.query(query, [reelId])
    const reel = result.rows[0]
    return res.status(200).render("home",{reel})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:"server error getting reel by id"})
  }
}

/* here the getfoodbyid is used for the foodpartner visitestore for foodpartner*/ 

export async function getfoodbyId(req,res) {
  try {
    const foodpartnerId = req.foodpartner.id

    const statsQuery = `select f.id, f.name, count(distinct i.id) as total_meals, count(l.id) as total_likes from foodpartner as f left join fooditem as i on f.id = i.foodpartner_id left join likes as l on i.id = l.reel_id where f.id = $1 group by f.id, f.name;`;

    const videoQuery = `select id,name, video, description from fooditem where foodpartner_id = $1`;

    const stats = await pool.query(statsQuery,[foodpartnerId])

    const videos = await pool.query(videoQuery,[foodpartnerId])

    res.render("visitstore",{partner:stats.rows[0], video:videos.rows})

  } catch (error) {
    console.log(error)
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

/* here this is for the user to visit the store of food partner*/
export async function getstorebyId(req,res) {
  try {
    const foodpartnerId = req.params.id

    const statsQuery = `select f.id, f.name, count(distinct i.id) as total_meals, count(l.id) as total_likes from foodpartner as f left join fooditem as i on f.id = i.foodpartner_id left join likes as l on i.id = l.reel_id where f.id = $1 group by f.id, f.name;`;

    const videoQuery = `select id,name, video, description from fooditem where foodpartner_id = $1`;

    const stats = await pool.query(statsQuery,[foodpartnerId])

    const videos = await pool.query(videoQuery,[foodpartnerId])

    res.render("store",{partner:stats.rows[0], video:videos.rows})

  } catch (error) {
    console.log(error)
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

/* here this is for the user to see the complete details of the particular fooditem*/

export async function getdishbyId(req, res) {
  try {
    const {partnerId, dishId} = req.params
    const result = await pool.query(`
      SELECT 
        f.id AS foodpartner_id,
        f.name AS partner_name,
        f.email AS partner_email,
        i.id AS dish_id,
        i.name AS dish_name,
        i.description,
        i.video
      FROM fooditem i
      JOIN foodpartner f ON i.foodpartner_id = f.id
      WHERE i.id = $1 AND f.id = $2`,[dishId,partnerId])

    if(result.rows.length == 0){
      return res.render("clientside",{statusCode: 404,
    message: "Page not found"})
    }
    const dish = result.rows[0]

    res.render("dish",{dish})
  } catch (error) {
    console.error(error)
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}
/*  here it is only for the foodpartner */

export async function deletefooditembyId(req, res) {
  try {
    const reelId = req.params.id
    const result = await pool.query("select video from fooditem where id = $1",[reelId])

    if(result.rows.length === 0){
      return res.status(404).render("clientside", { statusCode:404, message:"Page not found"})
    }
    const videoURL = result.rows[0].video;

    // 2. Extract fileId from URL
    const fileId = videoURL.replace("https://ik.imagekit.io/pj2x8w9ape/", "");

    // 3. Delete file from ImageKit
    await imagekit.deleteFile(fileId);

    await pool.query("delete from fooditem where id = $1",[reelId])
    res.status(200).json({success:true, msg:"delted successfully"})

  } catch (error) {
    console.error(error)
    return res.status(500).json({msg:"server error"})
  }
}

/* here it is only for the food partner */
export async function editfooditembyID(req, res) {
  
    const reelId = req.params.id;

    const foodResult = await pool.query(`
      SELECT fi.id, fi.name, fi.description, fi.video, fp.id AS partner_id, fp.name AS partner_name
      FROM fooditem fi
      JOIN foodpartner fp ON fi.foodpartner_id = fp.id
      WHERE fi.id = $1
    `, [reelId]);

    if(foodResult.rows.length === 0){
      return res.status(404).send("Food Reel not found");
    }

    const reel = foodResult.rows[0];

    // 2. Count likes
    const likesResult = await pool.query(`
      SELECT COUNT(*) AS count
      FROM likes
      WHERE reel_id = $1
    `, [reelId]);
    reel.likes = parseInt(likesResult.rows[0].count);

    // 3. Count saves
    const savesResult = await pool.query(`
      SELECT COUNT(*) AS count
      FROM usersave
      WHERE reel_id = $1
    `, [reelId]);
    reel.saves = parseInt(savesResult.rows[0].count);

    // 4. Get comments
    const commentsResult = await pool.query(`
      SELECT u.name AS user, c.comment
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.reel_id = $1
      ORDER BY c.created_at DESC
    `, [reelId]);

    reel.comments = commentsResult.rows;
    reel.commentsCount = reel.comments.length;

    // Render EJS page
    res.render('videoed', { reel });
}