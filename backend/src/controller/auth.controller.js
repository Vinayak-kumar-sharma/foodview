import { pool } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user exists
    const isExits = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (isExits.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    const user = newUser.rows[0];

    // 4. Create JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    // 5. Send response
    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function registerfoodPartner(req, res){
  try {
    const {name, email, password} = req.body
    const foodPartnerexist = await pool.query("Select id from foodpatner where email = $1",[email])
    if(foodPartnerexist.rows.length>0){
      return res.status(409).json({message:"Food Partner already exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newfoodPartner = await pool.query(`INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword])
    
      const foodpartner = newfoodPartner.rows[0]

      const token = jwt.sign({id:foodpartner.id},process.env.JWT_KEY,{expiresIn:"1d"})

      res.cookie("token",token)
      res.status(201).json({
        message:"Food Partner entry successfull.",
        foodpartner,
        token
      })

  } catch (error) {
    res.status(500).json({
      message:"server error from food partner"
    })
  }
}