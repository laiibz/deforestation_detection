// ✅ Load environment variables first
import dotenv from "dotenv";
dotenv.config();

// Now it's safe to import everything else
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

console.log("GOOGLE_CLIENT_ID from env:", process.env.GOOGLE_CLIENT_ID); // Keep for debug

//import './config/passportConfig.js';
import passport from "passport";

import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protected.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000"], // React frontend and backend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(cookieParser());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production
    httpOnly: true,
    sameSite: "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection with better error handling
(async () => {
  try {
    // Load passportConfig AFTER dotenv is ready
    await import('./config/passportConfig.js');

    // Set mongoose options to prevent timeout issues
    mongoose.set('bufferCommands', false);
    mongoose.set('bufferMaxEntries', 0);
    
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/deforestationDB", {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("MongoDB connection failed, using in-memory storage:", err.message);
    console.log("Authentication will work with in-memory storage (data will be lost on restart)");
    
    // Disable mongoose buffering to prevent timeout errors
    mongoose.set('bufferCommands', false);
  }
  
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})().catch(err => {
  console.error("Server startup error:", err);
  process.exit(1);
});
