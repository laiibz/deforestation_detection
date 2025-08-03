import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPrompt = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Please login or signup to continue</h2>
      <button onClick={() => navigate('/login')} style={{ margin: '1rem' }}>Login</button>
      <button onClick={() => navigate('/signup')}>Signup</button>
    </div>
  );
};

export default AuthPrompt;
