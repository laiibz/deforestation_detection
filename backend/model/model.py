# model.py
import torch
import torch.nn as nn
import segmentation_models_pytorch as smp

# Your UNet model class
class DeforestationUNet(nn.Module):
    def __init__(self, encoder_name="efficientnet-b0", encoder_weights="imagenet"):
        super().__init__()
        self.model = smp.Unet(
            encoder_name=encoder_name,
            encoder_weights=encoder_weights,
            classes=1,
            activation=None
        )

    def forward(self, x):
        return torch.sigmoid(self.model(x))
