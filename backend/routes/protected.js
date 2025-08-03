// backend/routes/protected.js
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import FormData from "form-data";
// Using built-in fetch (Node.js 18+)

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Access denied. Please login." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ 
      success: false,
      message: "Invalid token. Please login again." 
    });
  }
};

// Dashboard route
router.get("/dashboard", requireAuth, (req, res) => {
  res.json({ 
    success: true,
    message: "Welcome to the dashboard!",
    user: {
      email: req.user.email,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// Proxy route to Flask model prediction service
router.post("/predict", requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    // Create form data to send to Flask service
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Forward request to Flask prediction service
    const flaskResponse = await fetch('http://localhost:5001/predict', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const result = await flaskResponse.json();

    if (!flaskResponse.ok) {
      return res.status(flaskResponse.status).json({
        success: false,
        error: result.error || 'Prediction failed'
      });
    }

    // Add user information to the response
    const response = {
      ...result,
      user: {
        email: req.user.email,
        username: req.user.username
      },
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (err) {
    console.error('Prediction proxy error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error during prediction. Please try again.'
    });
  }
});

// Health check for Flask model service
router.get("/model-status", requireAuth, async (req, res) => {
  try {
    const flaskResponse = await fetch('http://localhost:5001/health');
    const result = await flaskResponse.json();
    
    res.json({
      success: true,
      modelService: result
    });
  } catch (err) {
    console.error('Model status check error:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to connect to model service',
      modelService: { status: 'unavailable' }
    });
  }
});

export default router;
