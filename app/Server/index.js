import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import router from "./routes/Authentication/Authe.js";
import routerDonation from "./routes/Service/DonationRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 9090;
const DB_URL = process.env.DB_URL;

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://blooddonatio2-9.vercel.app",
  "https://blooddonatio2-9-a443.vercel.app",

];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));



app.use(express.json());
app.use(cookieParser());
app.use("/auth/api", router);
app.use("/auth/dontaion/api", routerDonation);

app.get("/", (req, res) => {
  res.json({ status: "✅ Server is running" });
});

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Connected to MongoDB & running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("❌ MongoDB connection error:", e);
  });
