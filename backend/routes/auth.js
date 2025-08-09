import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

const isStrongPassword = (password) => {
  // Must contain: at least 6 characters, at least one uppercase, one lowercase, one digit, one symbol
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required." 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        success: false,
        message: "Username must be at least 3 characters long." 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide a valid email address." 
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 6 characters and include uppercase, lowercase, number, and symbol." 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "An account with this email already exists." 
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      provider: "local" 
    });

    console.log("User created successfully:", newUser.email);

    res.status(201).json({ 
      success: true,
      message: "Account created successfully! Please login." 
    });
    
  } catch (err) {
    console.error("Signup error:", err);
    
    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "An account with this email already exists." 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error. Please try again later." 
    });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required." 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide a valid email address." 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password." 
      });
    }

    // Check if user signed up with Google
    if (user.provider === "google" || !user.password) {
      return res.status(400).json({ 
        success: false,
        message: "This account uses Google login. Please use 'Login with Google'." 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password." 
      });
    }

    // Clear any existing session
    req.logout(() => {
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          username: user.username,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Set HTTP-only cookie
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.json({ 
        success: true,
        message: "Login successful!",
        user: {
          email: user.email, 
          username: user.username,
          role: user.role
        }
      });
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error. Please try again later." 
    });
  }
});

// ✅ Google OAuth Login
router.get("/google", passport.authenticate("google", { 
  scope: ["profile", "email"],
  prompt: "select_account",
  session: false
}));

// ✅ Google Callback
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?error=google_auth_failed",
    session: false, // Disable session to avoid serialization issues
  }),
  async (req, res) => {
    try {
      console.log("Google OAuth successful for user:", req.user.email);
      
      // Check if user exists and has required properties
      if (!req.user || !req.user._id) {
        console.error("User object is missing or invalid:", req.user);
        return res.redirect("http://localhost:3000/login?error=user_not_found");
      }
      
      // Generate JWT token for Google users
      const token = jwt.sign(
        { 
          id: req.user._id, 
          email: req.user.email, 
          username: req.user.username || req.user.displayName || "User",
          role: req.user.role || "user"
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Set cookie and redirect
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.redirect("http://localhost:3000/dashboard");
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:3000/login?error=google_callback_failed");
    }
  }
);

// ✅ Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("accessToken");
    res.json({ 
      success: true,
      message: "Logged out successfully" 
    });
  });
});

// ✅ Get current user
router.get("/me", (req, res) => {
  // Check for JWT token in cookies
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      user: null,
      message: "Not authenticated" 
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({ 
      success: true,
      user: { 
        email: decoded.email, 
        username: decoded.username,
        role: decoded.role 
      } 
    });
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ 
      success: false,
      user: null,
      message: "Invalid token" 
    });
  }
});

export default router;
