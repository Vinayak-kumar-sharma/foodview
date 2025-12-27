import { pool } from "../db/db.js";

export async function userSaveTable() {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS usersave(
        id serial primary key,
        user_id INT references users(id) on delete cascade,
        reel_id INT references fooditem(id) on delete cascade,
        created_at timestamp default current_timestamp,
        unique(user_id,reel_id)
      )`
    )
  } catch (error) {
    console.error(error)
    console.log("error in creating user_save table")
  }
}
