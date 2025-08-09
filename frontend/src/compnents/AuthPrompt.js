import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPrompt.css';
import backgroundImage from '../assets/authbg.jpg';

const AuthPrompt = () => {
  const navigate = useNavigate();

  return (
    <div
      className="auth-container d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="auth-box text-center p-5 rounded shadow-lg bg-white bg-opacity-75">
        <h2 className="mb-4 fw-bold">Please login or signup to continue</h2>
        <div className="d-flex justify-content-center gap-3">
          <button className="btn btn-outline-success px-4" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn btn-success px-4" onClick={() => navigate('/signup')}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
