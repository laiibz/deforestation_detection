from flask import Flask, request, jsonify
from PIL import Image
import io, torch
import base64
from torchvision import transforms
from model import DeforestationUNet  # make sure model.py exists

app = Flask(__name__)

DEVICE = "cpu"
MODEL_PATH = "deforestation_model_best.pth"

# Load model
model = DeforestationUNet()
ckpt = torch.load(MODEL_PATH, map_location=DEVICE)
model.load_state_dict(ckpt['model_state_dict'])
model.eval()

transform = transforms.Compose([
    transforms.Resize((256,256)),
    transforms.ToTensor()
])

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    img = Image.open(file).convert('RGB')
    img_tensor = transform(img).unsqueeze(0)

    with torch.no_grad():
        pred = model(img_tensor)
        mask = (pred.squeeze() > 0.5).float().cpu().numpy()

    # Convert mask to image and return base64
    mask_img = Image.fromarray((mask * 255).astype('uint8'))
    buf = io.BytesIO()
    mask_img.save(buf, format='PNG')
    mask_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')

    return jsonify({'mask': mask_b64})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
