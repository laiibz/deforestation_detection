import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('email') || !!localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        credentials: 'include'
      });
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <nav style={{
      background: '#143b24ff',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', marginRight: '1rem' }}>Home</Link>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Dashboard</Link>
            <Link to="/detect" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Detect</Link>
          </>
        )}
      </div>
      <div>
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '1rem' }}>Login</Link>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
