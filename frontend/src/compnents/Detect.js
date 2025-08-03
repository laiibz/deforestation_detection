// src/components/Detect.js
import React, { useState } from 'react';
import axios from 'axios';

function Detect() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post('http://localhost:5000/api/detect', formData);
      setResult(res.data.resultImage); // Assume backend returns processed image URL
    } catch (err) {
      console.error('Detection failed', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Upload Image for Detection</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>Submit</button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Detection Result:</h3>
          <img src={result} alt="Detection" style={{ width: '100%', maxWidth: '600px' }} />
        </div>
      )}
    </div>
  );
}

export default Detect;
