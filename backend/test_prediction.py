#!/usr/bin/env python3
"""
Test script to verify prediction functionality
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'model'))

# Import the predict function directly
sys.path.append('model')
from predict import predict_image
import base64

def test_prediction():
    """Test the prediction functionality with a sample image"""
    
    # Create a simple test image (1x1 pixel)
    test_image_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    
    print("Testing prediction functionality...")
    
    try:
        result = predict_image(test_image_data)
        
        if result["success"]:
            print("✅ Prediction test passed!")
            print(f"Original image size: {len(result['original'])} bytes")
            print(f"Overlay image size: {len(result['overlay'])} bytes")
            print(f"Mask size: {len(result['mask'])} bytes")
        else:
            print("❌ Prediction test failed!")
            print(f"Error: {result['error']}")
            return False
            
    except Exception as e:
        print(f"❌ Prediction test failed with exception: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = test_prediction()
    sys.exit(0 if success else 1) 