import { pool } from "../db/db.js";

export async function foodItem() {
  try {
    await pool.query(
    `CREATE TABLE IF NOT EXISTS fooditem(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    video VARCHAR(225) NOT NULL,
    description VARCHAR(225),
    foodpartner_id INTEGER NOT NULL,

    CONSTRAINT fk_foodpartner
      FOREIGN KEY (foodpartner_id)
      REFERENCES foodpartner(id)
      ON DELETE CASCADE

      );`)
  } catch (error) {
    console.error("Errror in creating the fooditem table",error.message)
  }
}
