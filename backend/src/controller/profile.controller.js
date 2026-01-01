import { pool } from "../db/db.js";

export async function getProfile(req, res) {
  try {
    const userid = req.user.id
    const isExists = await pool.query("Select id, name, email from users where id = $1", [userid])

    if(isExists.rows.length === 0){
      return res.status(401).render("clientside",{statusCode: 401,
    message: "Invalid User"})
    }
    const user = isExists.rows[0]
    const savedReels = await pool.query(
      `select r.id, r.video, r.name, r.description, coalesce(l.likes_count,0) as likes_count,
      coalesce(c.comments_count, 0) as comments_count, s.created_at as saved_at from usersave as s join fooditem as r on s.reel_id = r.id
      left join (select reel_id, count(*) as likes_count from likes group by reel_id) l on r.id = l.reel_id
      left join(select reel_id, count(*) as comments_count from comments group by reel_id) c on r.id = c.reel_id where s.user_id = $1 order by s.created_at desc`,
      [userid]
    );
    
    const comments = await pool.query(
      `SELECT 
      c.id,
      c.comment,
      c.created_at,
      f.name AS reel_name,
      f.video
        FROM comments c
        JOIN fooditem f ON c.reel_id = f.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC`,
      [userid]
    ) 
    const likes = await pool.query(
      `select i.id,f.name,f.video from likes as i join fooditem as f on i.reel_id = f.id where i.user_id = $1`,[userid]
    )
    const replies = await pool.query(
      `select r.id, r.reply, c.comment,f.name,f.video from replies as r join comments as c on r.comment_id = c.id join fooditem as f on c.reel_id = f.id where r.user_id =$1 ORDER BY r.created_at DESC`,[userid]
    )
    res.render("userprofile", {
    user,
    savedReels: savedReels.rows,
    comments: comments.rows,
    likes : likes.rows,
    replies: replies.rows
});
  } catch (error) {
    console.log(error)
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }

}

export async function saveReel(req, res){
  try {
    const userId = req.user.id
    const fooditemId = req.params.id
    const savedReel = await pool.query("insert into usersave (user_id, reel_id) values ($1,$2)",[userId,fooditemId])
    res.status(200).json({message:"True: saved", reel:savedReel.rows[0]})
  } catch (error) {
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

export async function likeReel(req,res) {
try {
  const userId = req.user.id
  const fooditemId = req.params.id
  const likedReel = await pool.query("insert into likes (user_id, reel_id) values ($1,$2)",[userId, fooditemId])
  res.status(200).json({message:"True",like:likedReel.rows})
} catch (error) {
  return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
}
}

export async function commentReel(req, res) {
  try {
    const userId = req.user.id;
    const fooditemId = req.params.id;
    const { comment } = req.body;

    // Insert the comment and return the inserted row with user info
    const result = await pool.query(
      `INSERT INTO comments (user_id, reel_id, comment)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, reel_id, comment`,
      [userId, fooditemId, comment]
    );

    const insertedComment = result.rows[0];

    // Get the username of the commenter
    const userResult = await pool.query(
      `SELECT name FROM users WHERE id = $1`,
      [userId]
    );

    insertedComment.name = userResult.rows[0].name;

    // Return the inserted comment to the frontend
    res.status(200).json({
      message: "comment is added",
      comment: insertedComment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

// export async function createReply (req, res){
//   try {
//     const userId = req.user.id;            // logged-in user
//     const { comment_id, reply } = req.body;

//     // Basic validation
//     if (!comment_id || !reply || !reply.trim()) {
//       return res.status(400).json({ error: "Comment ID and reply text required" });
//     }

//     // Insert reply
//     const query = `
//       INSERT INTO replies (user_id, comment_id, reply)
//       VALUES ($1, $2, $3)
//       RETURNING *;
//     `;
//     const values = [userId, comment_id, reply];

//     const result = await db.query(query, values);

//     return res.status(201).json({
//       message: "Reply created",
//       reply: result.rows[0],
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };


export async function getReelComment(req, res) {
  try {
    const fooditmeid = req.params.id
    const comment = await pool.query(`select c.id,c.comment, u.name from comments as c join users as u on u.id = c.user_id where c.reel_id = $1 order by c.id desc`,[fooditmeid])
    res.status(200).json(comment.rows)
  } catch (error) {
    console.error(error)
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}