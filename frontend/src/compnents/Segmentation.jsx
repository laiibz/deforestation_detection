import React, { useState } from "react";

export default function Segmentation() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please select an image");
    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Deforestation Segmentation</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <button onClick={handleSubmit}>Submit</button>

      {loading && <p>Processing...</p>}

      {result && (
        <div style={{ display: "flex", marginTop: "20px" }}>
          <div style={{ marginRight: "20px" }}>
            <h4>Original</h4>
            <img src={URL.createObjectURL(image)} alt="input" width="400" />
          </div>
          <div>
            <h4>Predicted Mask</h4>
            <img src={`data:image/png;base64,${result.mask}`} alt="mask" width="400" />
          </div>
        </div>
      )}
    </div>
  );
}
