import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js"
import MessageRoute from "./routes/messageRoute.js"
dotenv.config();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: process.env.URL,
  credentials: true,
};
const app = express();

//middlewares

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",MessageRoute)
app.listen(port, () => {
  try {
    console.log(`server started on port  ${port}`);
    connectDB();
  } catch (error) {
    console.log("something went wrong")
  }
});
