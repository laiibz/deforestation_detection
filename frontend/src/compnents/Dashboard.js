import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user info
    axios.get('http://localhost:5000/api/auth/me', { withCredentials: true })
      .then(res => {
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
          if (res.data.user.role === 'admin') {
            navigate('/admin');
            return;
          }
        } else {
          navigate('/login');
        }
      })
      .catch(() => {
        navigate('/login');
      })
      .finally(() => {
        setIsLoading(false);
      });

    axios.get('http://localhost:5000/api/dashboard', {
      withCredentials: true
    })
    .then(res => setMessage(res.data.message))
    .catch(err => {
      console.error(err);
      setMessage("Welcome to your AI Deforestation Detector Dashboard!");
    });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d2d1a 100%)',
        color: '#ffffff'
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #4ade80',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading your forest dashboard...
        </div>
      </div>
    );
  }

  const welcomeName = user.username || user.email || 'User';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d2d1a 100%)',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234ade80" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s ease-in-out infinite'
      }}></div>

      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderBottom: '2px solid #4ade80',
        position: 'sticky',
        top: '0',
        zIndex: '100'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(45deg, #4ade80, #22c55e)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              
            </div>
            <h1 style={{ 
              color: '#4ade80', 
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              Forest Guardian
            </h1>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ color: '#9ca3af' }}>
              Welcome, <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{welcomeName}</span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: '10'
      }}>
        {/* Welcome Section */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          animation: 'slideInUp 0.8s ease-out'
        }}>
          <h2 style={{ 
            color: '#4ade80', 
            marginBottom: '1rem',
            fontSize: '2.5rem',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(74, 222, 128, 0.5)'
          }}>
             Welcome to Your Forest Dashboard
          </h2>
          <p style={{ 
            color: '#9ca3af', 
            textAlign: 'center',
            fontSize: '1.1rem',
            margin: 0
          }}>
            {message || "Monitor and protect our forests with AI-powered deforestation detection"}
          </p>
        </div>

        {/* Stats Cards - Only Detection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {[
            {
              title: ' Detection',
              description: 'Upload satellite images to detect deforestation patterns',
              
              color: '#4ade80',
              action: () => navigate('/detect')
            }
          ].map((card, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '15px',
                border: `2px solid ${card.color}40`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideInUp 0.8s ease-out ${index * 0.1}s both`,
                transform: activeCard === index ? 'scale(1.05)' : 'scale(1)',
                boxShadow: activeCard === index 
                  ? `0 10px 30px ${card.color}40` 
                  : '0 4px 15px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              onClick={card.action}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  marginRight: '1rem'
                }}>
                  {card.icon}
                </div>
                <h3 style={{ 
                  color: card.color, 
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  {card.title}
                </h3>
              </div>
              <p style={{ 
                color: '#9ca3af', 
                margin: 0,
                lineHeight: '1.6'
              }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions - Without View Reports */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '15px',
          border: '1px solid rgba(74, 222, 128, 0.2)',
          animation: 'slideInUp 0.8s ease-out 0.4s both'
        }}>
          <h3 style={{ 
            color: '#4ade80', 
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '1.8rem'
          }}>
             Quick Actions
          </h3>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/detect')}
              style={{
                background: 'linear-gradient(45deg, #4ade80, #22c55e)',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(74, 222, 128, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(74, 222, 128, 0.3)';
              }}
            >
               Start Detection
            </button>
            
            <button
              onClick={() => navigate('/upload')}
              style={{
                background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.3)';
              }}
            >
               Upload Images
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
