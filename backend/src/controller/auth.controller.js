import { pool } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// 1. User Authentication Controllers Register, Login, Logout

export async function getuser(req,res){
  res.render('index')
}
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
    const token = jwt.sign({ id: user.id }, process.env.USER_JWT_KEY, {
      expiresIn: "1d",
    });

    // 5. Send response
    res.cookie("token", token);
    res.status(201).json({ success: true, redirect: "/api/user/login" });
  } catch (error) {
    console.error(error);
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}
export async function getLogin(req, res) {
  res.render("userLogin")
}
export async function loginUser(req, res) {
  try {
    const { password, email } = req.body;
    const dbResult = await pool.query(
      "SELECT id, password FROM users WHERE email = $1",
      [email]
    );

    if (dbResult.rows.length === 0) {
      return res.status(400).json({ message: "False: Invalid email" });
    }

    const user = dbResult.rows[0];
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: "False: Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.USER_JWT_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production
    });
  
    return res.status(200).json({ success: true, redirect: "/api/home" })
  } catch (error) {
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}
export async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).redirect("/");
  } catch (error) {
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

// 2. Food Partner Authentication Controller Register, Login, Logout 

export async function getpartner(req,res) {
  res.render("foodPartnerregister")
}
export async function registerfoodPartner(req, res) {
  try {
    const { name, email, password } = req.body;

    const foodPartnerexist = await pool.query("SELECT id FROM users WHERE email = $1", 
      [email]);
  

    if (foodPartnerexist.rows.length > 0) {
      return res.status(409).json({ message: "Food Partner already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newfoodPartner = await pool.query(
      `INSERT INTO foodpartner (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    const foodpartner = newfoodPartner.rows[0];

    const token = jwt.sign({ id: foodpartner.id }, process.env.PARTNER_JWT_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token);
    res.status(201).json({ success: true, redirect: "/api/foodpartner/login" });
  } catch (error) {
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}
export async function getpartnerLogin(req, res){
  res.render("foodpartnerLogin")
}
export async function loginfoodPartner(req, res){
  try {
    const {password, email} = req.body

    const isuserExist = await pool.query(
      "SELECT id, password FROM foodpartner WHERE email =$1",[email]
    )
    if(isuserExist.rows.length === 0){
      return res.status(400).json({success:" False ",message:" Email is not exists "})
    }

    const user = isuserExist.rows[0]

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.status(400).json({message:" Invalid password "})
    }
    const token = jwt.sign({userId:user.id},process.env.PARTNER_JWT_KEY,{expiresIn:"1d"})

    res.cookie("token", token)
    return res.status(200).redirect("/api/store")
  } catch (error) {
    console.error(error)
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}

export async function logoutfoodPartner(req, res){
  try{
    res.clearCookie("token")
    res.status(200).redirect("/")
  }
  catch(err){
    return res.status(500).render("serverside",{
      statusCode: 500,
      message: "Something broke on our end."
    })
  }
}
