from flask import Flask, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import io
import numpy as np
import segmentation_models_pytorch as smp
import base64
import cv2
from flask_cors import CORS
import os

# Paths
MODEL_PATH = "model/deforestation_model_best.pth"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"Using device: {DEVICE}")
print(f"Model path: {MODEL_PATH}")

# Model class (same as during training)
class DeforestationUNet(torch.nn.Module):
    def __init__(self, encoder_name="efficientnet-b0", encoder_weights=None):
        super().__init__()
        self.model = smp.Unet(
            encoder_name=encoder_name,
            encoder_weights=None,
            classes=1,
            activation=None
        )
    
    def forward(self, x):
        return torch.sigmoid(self.model(x))

# Load model
try:
    model = DeforestationUNet().to(DEVICE)
    if os.path.exists(MODEL_PATH):
        checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
        model.load_state_dict(checkpoint["model_state_dict"])
        model.eval()
        print("Model loaded successfully!")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")

# Flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow requests from React frontend

# Image preprocessing with proper normalization
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Validate file upload
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'tiff', 'bmp'}
        file_ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if file_ext not in allowed_extensions:
            return jsonify({"error": "Invalid file type. Please upload an image file (PNG, JPG, JPEG, TIFF, BMP)"}), 400

        # Check if model is loaded
        if 'model' not in globals() or model is None:
            return jsonify({"error": "Model not loaded. Please check server logs."}), 500

        # Process image
        try:
            image = Image.open(io.BytesIO(file.read())).convert("RGB")
        except Exception as e:
            return jsonify({"error": f"Invalid image file: {str(e)}"}), 400

        # Resize and preprocess
        original_size = image.size
        image_resized = image.resize((256, 256))
        image_tensor = transform(image_resized).unsqueeze(0).to(DEVICE)

        # Make prediction
        with torch.no_grad():
            pred = model(image_tensor).squeeze().cpu().numpy()

        # Calculate deforestation percentage
        deforestation_pixels = np.sum(pred > 0.5)
        total_pixels = pred.size
        deforestation_percentage = (deforestation_pixels / total_pixels) * 100

        # Create binary mask
        mask = (pred > 0.5).astype("uint8") * 255

        # Create colored overlay for deforestation areas
        mask_color = cv2.applyColorMap(mask, cv2.COLORMAP_HOT)  # Red/yellow for deforestation
        image_np = np.array(image_resized)
        overlay = cv2.addWeighted(image_np, 0.7, mask_color, 0.3, 0)

        # Encode images to base64
        _, buf1 = cv2.imencode(".png", cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR))
        encoded_original = base64.b64encode(buf1).decode("utf-8")

        _, buf2 = cv2.imencode(".png", overlay)
        encoded_overlay = base64.b64encode(buf2).decode("utf-8")

        _, buf3 = cv2.imencode(".png", mask)
        encoded_mask = base64.b64encode(buf3).decode("utf-8")

        return jsonify({
            "success": True,
            "original": encoded_original,
            "overlay": encoded_overlay,
            "mask": encoded_mask,
            "deforestation_percentage": round(deforestation_percentage, 2),
            "original_size": original_size,
            "processed_size": [256, 256],
            "message": f"Analysis complete. {deforestation_percentage:.1f}% deforestation detected."
        })

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({"error": f"Server error during prediction: {str(e)}"}), 500

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify model status"""
    model_status = "loaded" if 'model' in globals() and model is not None else "not loaded"
    return jsonify({
        "status": "healthy",
        "model_status": model_status,
        "device": DEVICE,
        "model_path": MODEL_PATH
    })

if __name__ == "__main__":
    print("🚀 Starting Flask Model Service on port 5001...")
    app.run(host="0.0.0.0", port=5001, debug=True)
