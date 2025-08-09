import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/detect');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="home-hero d-flex align-items-center justify-content-center">
      <div className="overlay text-center text-white">
        <h1 className="display-4 fw-bold mb-3">AI Deforestation Detector</h1>
        <p className="lead mb-4">
           Detect your deforested areas using satellite imagery.
        </p>
        <button className="btn btn-success btn-lg px-5 py-2" onClick={handleClick}>
          Detect Now
        </button>
      </div>
    </div>
  );
}

export default Home;
