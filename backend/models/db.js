// .Models/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const mongoURL = process.env.mongo_conn;
// process.env.mongo_conn;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURL);
    console.log("Connection successful.");
    return connection;
  } catch (error) {
    console.error("Connection Failed: ", error);
  }
}

export default connectDB;