// create server
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import userRoute from "./routes/auth.route.js";
import foodRoute from "./routes/food.route.js";
import profileRoute from "./routes/profile.routes.js"

const app = express();
dotenv.config();

// recreate __dirname (ES modules fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// API routes
app.get("/",(req, res)=>{
  res.render("landing")
})
app.use("/api", userRoute);
app.use("/api", foodRoute);
app.use("/user", profileRoute);

export default app;
