import { pool } from "../db/db.js";

export async function reelLike() {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS likes(
        id serial primary key,
        user_id int references users(id) on delete cascade,
        reel_id int references fooditem(id) on delete cascade,
        created_at timestamp default current_timestamp,
        unique(user_id, reel_id)
      )`
    )
  } catch (error) {
    console.error(error)
    console.log("Error in creating like table")
  }
}