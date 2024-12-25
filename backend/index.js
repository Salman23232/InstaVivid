import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoute from "./Routes/user.route.js"
import connectDB from "./utils/mongodbConnect.js";
dotenv.config({});
const port = process.env.PORT || 3000;
const app = express();
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

app.listen(port, (req, res) => {
  connectDB();
  console.log(`port is running at ${port}`);
});
