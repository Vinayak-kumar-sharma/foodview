// import { Pool } from 'pg'

/*  ===local setup===   */

// export const pool = new Pool({
//   user: 'postgres',
//   host:'localhost',
//   database:'food-view',
//   password:'1319',
//   port:5432
// })

// export const connectDb = async ()=>{
//   try{
//     const client = await pool.connect();

//     console.log("Database connected successfully..! By PostgreSQl")
//     client.release();
//   }
//   catch(err){
//     console.error("Connection Failed", err.message);
//     process.exit(1);
//   }
// };
import { Pool } from "pg";
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // This ignores self-signed certificate errors
  }
  
});

export const connectDb = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to Supabase PostgreSQL successfully!");
    client.release();
  } catch (err) {
    console.error("Connection Failed:", err.message);
    process.exit(1);
  }
};

