import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Detect from './components/Detect';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthPrompt from './components/AuthPrompt';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Step before login/signup */}
        <Route path="/auth" element={<AuthPrompt />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route: only accessible if token exists */}
        <Route path="/detect" element={
          <ProtectedRoute>
            <Detect />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
