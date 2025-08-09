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

# Paths
MODEL_PATH = "model/deforestation_model_best.pth"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

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
model = DeforestationUNet().to(DEVICE)
checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

# Flask app
app = Flask(__name__)
CORS(app)

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    image_resized = image.resize((256, 256))
    image_tensor = transform(image_resized).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        pred = model(image_tensor).squeeze().cpu().numpy()

    # Simple threshold for visualization
    threshold = 0.5
    mask = (pred > threshold).astype("uint8") * 255

    # Convert mask to 3-channel (for overlay)
    mask_color = cv2.applyColorMap(mask, cv2.COLORMAP_JET)
    image_np = np.array(image_resized)
    overlay = cv2.addWeighted(image_np, 0.7, mask_color, 0.3, 0)

    # Encode original
    _, buf1 = cv2.imencode(".png", cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR))
    encoded_original = base64.b64encode(buf1).decode("utf-8")

    # Encode overlay
    _, buf2 = cv2.imencode(".png", overlay)
    encoded_overlay = base64.b64encode(buf2).decode("utf-8")

    return jsonify({
        "original": encoded_original,
        "overlay": encoded_overlay
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
