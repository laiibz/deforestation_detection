#!/usr/bin/env python3
"""
Prediction script that can be called from Express backend
"""
import sys
import json
import base64
import io
import os
from PIL import Image
import torch
from torchvision import transforms
import numpy as np
import cv2
from model import DeforestationUNet

def load_model():
    """Load the trained model"""
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "deforestation_model_best.pth")
    
    model = DeforestationUNet()
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()
    model.to(DEVICE)
    
    return model, DEVICE

def preprocess_image(image_data):
    """Preprocess image for prediction"""
    # Decode base64 image
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    # Resize and normalize
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    image_tensor = transform(image).unsqueeze(0)
    return image_tensor, image

def predict_image(image_data):
    """Make prediction on the image"""
    try:
        # Load model
        model, device = load_model()
        
        # Preprocess image
        image_tensor, original_image = preprocess_image(image_data)
        image_tensor = image_tensor.to(device)
        
        # Make prediction
        with torch.no_grad():
            pred = model(image_tensor).squeeze().cpu().numpy()
        
        # Threshold to binary mask
        mask = (pred > 0.5).astype("uint8") * 255
        
        # Calculate deforestation percentage
        total_pixels = mask.shape[0] * mask.shape[1]
        deforested_pixels = np.sum(mask > 0)
        deforestation_percentage = (deforested_pixels / total_pixels) * 100
        
        # Convert mask to 3-channel (for overlay)
        mask_color = cv2.applyColorMap(mask, cv2.COLORMAP_JET)
        image_np = np.array(original_image.resize((256, 256)))
        overlay = cv2.addWeighted(image_np, 0.7, mask_color, 0.3, 0)
        
        # Encode results
        _, buf1 = cv2.imencode(".png", cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR))
        encoded_original = base64.b64encode(buf1).decode("utf-8")
        
        _, buf2 = cv2.imencode(".png", overlay)
        encoded_overlay = base64.b64encode(buf2).decode("utf-8")
        
        return {
            "success": True,
            "original": encoded_original,
            "overlay": encoded_overlay,
            "mask": base64.b64encode(mask.tobytes()).decode("utf-8"),
            "deforestation_percentage": round(deforestation_percentage, 2),
            "has_deforestation": deforestation_percentage > 0
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    # Read input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    
    # Make prediction
    result = predict_image(data["image"])
    
    # Output result to stdout
    print(json.dumps(result)) 