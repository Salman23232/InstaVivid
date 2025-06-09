
import express from "express";
import cors from "cors";
import path from 'path'
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoute from "./Routes/user.route.js"
import postRoute from "./Routes/post.route.js"
import messageRoute from "./Routes/message.route.js"
import connectDB from "./utils/mongodbConnect.js";
import { app,server,io } from "./socket/socket.js";
import storyRoutes from "./Routes/story.route.js";
dotenv.config({});



const port = process.env.PORT || 3000;

const __dirname = path.resolve()

console.log(__dirname);


app.get("/", (req, res) => {
  res.send("hello world");
});

// middlewares
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// api comes here
app.use('/api/v1/user', userRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/message', messageRoute)
app.use("/api/v1/story", storyRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")))
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
})

server.listen(port, (req, res) => {
  connectDB();
  console.log(`port is running at ${port}`);
});
