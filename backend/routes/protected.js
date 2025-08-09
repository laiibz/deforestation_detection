// backend/routes/protected.js
import express from 'express';
import auth from '../middleware/auth.js';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.get('/dashboard', auth, (req, res) => {
  const name = req.user.username || req.user.email;
  res.json({ message: `Welcome ${name}, this is your protected dashboard.` });
});

// Detection route (temporarily without auth for testing)
router.post('/detect', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Convert file buffer to base64
    const imageBase64 = req.file.buffer.toString('base64');
    
    // Call Python script for prediction
    const pythonScript = path.join(__dirname, '../model/predict.py');
    
    const pythonProcess = spawn('python', [pythonScript], {
      cwd: path.join(__dirname, '../model')
    });
    
    // Send image data to Python script
    const inputData = JSON.stringify({ image: imageBase64 });
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();
    
    let result = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', error);
        return res.status(500).json({ 
          error: 'Prediction failed', 
          details: error || 'Python script exited with non-zero code' 
        });
      }
      
      try {
        const predictionResult = JSON.parse(result);
        
        if (predictionResult.success) {
          res.json({
            success: true,
            resultImage: `data:image/png;base64,${predictionResult.overlay}`,
            original: `data:image/png;base64,${predictionResult.original}`,
            mask: predictionResult.mask,
            deforestation_percentage: predictionResult.deforestation_percentage,
            has_deforestation: predictionResult.has_deforestation,
            message: 'Detection completed successfully'
          });
        } else {
          res.status(500).json({ 
            error: 'Prediction failed', 
            details: predictionResult.error 
          });
        }
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError);
        res.status(500).json({ 
          error: 'Failed to parse prediction result', 
          details: parseError.message 
        });
      }
    });
    
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: 'Detection failed', details: error.message });
  }
});

export default router;
