//index.js
import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 
import authRouter from './auth/auth.route.js';
import chatRouter from './chat/chat.route.js';
import connectDB from './models/db.js'
const app = express();
const Port = process.env.PORT;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

app.get("/", (req, res) => {
    res.send("Hello World! Welcome to Queryflow");
})

app.listen(Port, () => console.log("App running on port: ", Port));