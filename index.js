import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
// import connectDB from "./config/connectdb.js";
import mongoose from "mongoose";
import userRoutes from "./routes/user.router.js";

const app = express();

const port = process.env.PORT || 7000;
const DATABASE_URL = process.env.DATABASE_URL;

//Cors Policy
app.use(cors());

// JSON
app.use(express.json());

//Database connection
mongoose.connect("mongodb://localhost:27017/shopperStop");
try {
  console.log("Database Connected Successfully...");
} catch (err) {
  console.log(err);
}

// Load Routes
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(`Server listening to http:localhost:${port}`);
});
