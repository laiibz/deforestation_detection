import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admin privileges required." 
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Admin auth error:", err);
    res.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};

// Get all users (admin only)
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    
    // Remove sensitive information
    const sanitizedUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      provider: user.provider,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({
      success: true,
      users: sanitizedUsers,
      total: sanitizedUsers.length
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users"
    });
  }
});

// Delete user (admin only)
router.delete("/users/:userId", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account"
      });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: `User ${deletedUser.email} deleted successfully`,
      deletedUser: {
        _id: deletedUser._id,
        email: deletedUser.email,
        username: deletedUser.username
      }
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user"
    });
  }
});

// Get user statistics (admin only)
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const allUsers = await User.find({});
    
    const stats = {
      totalUsers: allUsers.length,
      usersByProvider: {
        local: allUsers.filter(u => u.provider === "local").length,
        google: allUsers.filter(u => u.provider === "google").length
      },
      usersByRole: {
        admin: allUsers.filter(u => u.role === "admin").length,
        user: allUsers.filter(u => u.role === "user").length
      },
      recentUsers: allUsers
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(user => ({
          _id: user._id,
          email: user.email,
          username: user.username,
          provider: user.provider,
          createdAt: user.createdAt
        }))
    };

    res.json({
      success: true,
      stats
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics"
    });
  }
});

// Promote user to admin (admin only)
router.patch("/users/:userId/promote", requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "User is already an admin"
      });
    }

    user.role = "admin";
    await user.save();

    res.json({
      success: true,
      message: `User ${user.email} promoted to admin`,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Promote user error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while promoting user"
    });
  }
});

export default router;
