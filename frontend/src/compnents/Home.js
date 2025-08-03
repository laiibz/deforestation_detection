import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/detect');
    } else {
      navigate('/auth');  // ask login or signup
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🌳 AI Deforestation Detector</h1>
      <p>This tool helps detect deforestation areas using satellite imagery and AI.</p>
      <button onClick={handleClick} style={{ padding: '1rem', marginTop: '1rem' }}>
        Detect Now
      </button>
    </div>
  );
}

export default Home;
