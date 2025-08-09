// src/components/Detect.js
import React, { useState } from 'react';
import axios from 'axios';
import './Detect.css'; // ✅ Import the CSS

function Detect() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post('http://localhost:5001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (res.data) {
        setResult(`data:image/png;base64,${res.data.overlay}`);
      } else {
        alert('Detection failed: No response data');
      }
    } catch (err) {
      alert('Detection failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detect-page">
      <div className="detect-box">
        <h2 className="mb-3">Upload Image for Detection</h2>
        <input type="file" className="form-control mb-3" onChange={handleFileChange} />
        <button 
          onClick={handleSubmit} 
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>

        {result && (
          <div className="mt-4">
            <h3>Detection Result:</h3>
            <img src={result} alt="Detection" className="img-fluid mt-2" style={{ maxHeight: '500px' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Detect;
