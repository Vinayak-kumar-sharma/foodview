import { pool } from "../db/db.js";

export async function createReplieTable() {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS replies(
        id serial primary key,
        user_id int not null references users(id) on delete cascade,
        comment_id int not null references comments(id) on delete cascade,
        reply text not null,
        created_at timestamp default current_timestamp
      )`
    )
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:"server error from replies table."})
  }
}