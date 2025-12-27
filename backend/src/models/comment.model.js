import { pool } from "../db/db.js";

export async function commentTable() {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS comments(
        id serial primary key,
        user_id int references users(id) on delete cascade,
        reel_id int references fooditem(id) on delete cascade,
        comment text not null,
        created_at timestamp default current_timestamp
      )`
    )
  } catch (error) {
    
  }
}