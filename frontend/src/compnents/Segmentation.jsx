import React, { useState } from "react";

export default function Segmentation() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please select an image");
    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data) {
        setResult({
          mask: data.overlay, // Using overlay as mask for display
          overlay: data.overlay
        });
      } else {
        console.error('Detection failed:', data.error);
        alert('Detection failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Detection failed: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Deforestation Segmentation</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {loading && <p>Processing...</p>}

      {result && (
        <div style={{ display: "flex", marginTop: "20px" }}>
          <div style={{ marginRight: "20px" }}>
            <h4>Original</h4>
            <img src={URL.createObjectURL(image)} alt="input" width="400" />
          </div>
          <div>
            <h4>Detection Result</h4>
            <img src={`data:image/png;base64,${result.overlay}`} alt="result" width="400" />
          </div>
        </div>
      )}
    </div>
  );
}
