import { Pool } from 'pg'

export const pool = new Pool({
  user: 'postgres',
  host:'localhost',
  database:'food-view',
  password:'1319',
  port:5432
})

export const connectDb = async ()=>{
  try{
    const client = await pool.connect();

    console.log("Database connected successfully..! By PostgreSQl")
    client.release();
  }
  catch(err){
    console.error("Connection Failed", err.message);
    process.exit(1);
  }
};

