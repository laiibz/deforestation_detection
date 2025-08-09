import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    axios.get('http://localhost:5000/api/auth/me', { withCredentials: true })
      .then(res => {
        if (res.data.success && res.data.user) {
          if (res.data.user.role !== 'admin') {
            // Redirect non-admin users to regular dashboard
            navigate('/dashboard');
            return;
          }
          loadAdminData();
        } else {
          navigate('/login');
        }
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  const loadAdminData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', { withCredentials: true }),
        axios.get('http://localhost:5000/api/admin/stats', { withCredentials: true })
      ]);

      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setMessage('User deleted successfully');
        setUsers(users.filter(user => user._id !== userId));
        // Reload stats
        const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { withCredentials: true });
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
      } else {
        setError(response.data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

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
            border: '3px solid #dc2626',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #1a0d0d 100%)',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dc2626" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'float 20s ease-in-out infinite'
      }}></div>

      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 2rem',
        borderBottom: '2px solid #dc2626',
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
              background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              👑
            </div>
            <h1 style={{ 
              color: '#dc2626', 
              margin: 0,
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              Admin Dashboard
            </h1>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(45deg, #4ade80, #22c55e)',
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
              User Dashboard
            </button>
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
        {/* Messages */}
        {message && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid #22c55e',
            color: '#22c55e',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
        
        {error && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid #dc2626',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { title: 'Total Users', value: stats.totalUsers || 0, color: '#4ade80', icon: '👥' },
            { title: 'Admin Users', value: stats.adminUsers || 0, color: '#dc2626', icon: '👑' },
            { title: 'Regular Users', value: stats.regularUsers || 0, color: '#60a5fa', icon: '👤' },
            { title: 'Google Users', value: stats.googleUsers || 0, color: '#fbbf24', icon: '🔑' },
            { title: 'Local Users', value: stats.localUsers || 0, color: '#a78bfa', icon: '🏠' }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: `2px solid ${stat.color}40`,
                textAlign: 'center',
                animation: `slideInUp 0.8s ease-out ${index * 0.1}s both`
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {stat.icon}
              </div>
              <div style={{ 
                color: stat.color, 
                fontSize: '2rem', 
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '15px',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          animation: 'slideInUp 0.8s ease-out 0.5s both'
        }}>
          <h3 style={{ 
            color: '#dc2626', 
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '1.8rem'
          }}>
            👥 User Management
          </h3>
          
          <div style={{
            overflowX: 'auto',
            borderRadius: '8px',
            border: '1px solid rgba(220, 38, 38, 0.2)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#ffffff'
            }}>
              <thead>
                <tr style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderBottom: '2px solid rgba(220, 38, 38, 0.3)'
                }}>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(220, 38, 38, 0.3)' }}>Username</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(220, 38, 38, 0.3)' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(220, 38, 38, 0.3)' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(220, 38, 38, 0.3)' }}>Provider</th>
                  <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(220, 38, 38, 0.3)' }}>Created</th>
                  <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid rgba(220, 38, 38, 0.3)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr 
                    key={user._id}
                    style={{
                      borderBottom: '1px solid rgba(220, 38, 38, 0.1)',
                      transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.parentElement.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.parentElement.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      {user.username || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: user.role === 'admin' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                        color: user.role === 'admin' ? '#dc2626' : '#4ade80'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: user.provider === 'google' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(96, 165, 250, 0.2)',
                        color: user.provider === 'google' ? '#fbbf24' : '#60a5fa'
                      }}>
                        {user.provider}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id, user.email)}
                          style={{
                            background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default AdminDashboard; 