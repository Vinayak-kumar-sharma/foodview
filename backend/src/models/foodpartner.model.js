import { pool } from "../db/db.js";



export async function foodPartner(){
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS foodpartner(
      id serial primary key,
      name varchar(100) not null,
      email varchar(100) unique not null,
      password varchar(225) not null,
      created_at timestamp default current_timestamp
      );`)
  } catch (error) {
    console.error('error in creating foodPartner Table', error.message)
  }
}