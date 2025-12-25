import {pool} from '../db/db.js'

export async function createTable(){
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id serial primary key,
      name varchar(100) Not Null,
      email varchar(100) unique not null,
      password varchar(225) not null,
      created_at timestamp default current_timestamp
      );
      `)
  } catch (error) {
    console.error('error in creating user table', error.message)
  }
}