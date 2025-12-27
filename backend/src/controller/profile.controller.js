import { pool } from "../db/db.js";

export async function getProfile(req, res) {
  try {
    const userid = req.user.id
    const isExists = await pool.query("Select id, name, email from users where id = $1", [userid])

    if(isExists.rows.length === 0){
      return res.status(400).json({message:"False : Invalid User"})
    }
    const user = isExists.rows[0]
    const savedReels = await pool.query(
      `SELECT f.name, f.video, f.description
       FROM usersave as us
       JOIN fooditem as f ON us.reel_id = f.id
       WHERE us.user_id = $1`,
      [userid])
    
    const comments = await pool.query(
      `SELECT c.id, c.comment, c.created_at, f.video
       FROM comments as c
       JOIN fooditem as f ON c.reel_id = f.id
       WHERE c.user_id = $1`,
      [userid]
    ) 
    res.render("userprofile", {
    user,
    savedReels: savedReels.rows,
    comments: comments.rows
});
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Server Error"})
  }

}

export async function saveReel(req, res){
  try {
    const userId = req.user.id
    const fooditemId = req.params.id
    const savedReel = await pool.query("insert into usersave (user_id, reel_id) values ($1,$2)",[userId,fooditemId])
    res.status(200).json({message:"True: saved", reel:savedReel.rows[0]})
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

export async function likeReel(req,res) {
try {
  const userId = req.user.id
  const fooditemId = req.params.id
  const likedReel = await pool.query("insert into likes (user_id, reel_id) values ($1,$2)",[userId, fooditemId])
  res.status(200).json({message:"True",like:likedReel.rows})
} catch (error) {
  return res.status(500).json({message:"server error"})
}
}

export async function commentReel(req, res) {
  try {
    const userId = req.user.id
    const fooditemId = req.params.id
    const { comment } = req.body
    const usercomment = await pool.query("insert into comments (user_id, fooditemId, comment) values ($1,$2,$3)",[userId,fooditemId, comment])
    res.status(200).json({message:"comment is added",user: usercomment.rows})
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}