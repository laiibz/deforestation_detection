import React from 'react';

function GoogleLoginButton() {
  const handleGoogle = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  return (
    <button
      onClick={handleGoogle}
      style={{ background: '#4285F4', color: 'white', padding: '0.5rem 1rem' }}
    >
      Sign in with Google
    </button>
  );
}

export default GoogleLoginButton;
