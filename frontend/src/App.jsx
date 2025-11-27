import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import VerificationPending from './components/auth/VerificationPending';
import './components/auth/Auth.css';

// Placeholder Dashboard component
const Dashboard = () => (
  <div className="dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Dashboard</h1>
    <p>Welcome to the Volunteer Portal!</p>
  </div>
);

// Placeholder Admin Dashboard
const AdminDashboard = () => (
  <div className="dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Admin Dashboard</h1>
    <p>Admin-only content goes here.</p>
  </div>
);

// Placeholder Organization Dashboard
const OrganizationDashboard = () => (
  <div className="dashboard-container" style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Organization Dashboard</h1>
    <p>Organization-specific content goes here.</p>
  </div>
);

// Unauthorized page
const Unauthorized = () => (
  <div className="auth-container">
    <div className="auth-card" style={{ textAlign: 'center' }}>
      <div className="auth-header">
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '50%'
        }}>
          <svg style={{ width: '40px', height: '40px', color: '#ffffff' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="auth-title">Access Denied</h1>
        <p className="auth-subtitle">
          You don't have permission to access this page.
        </p>
      </div>
      <a href="/dashboard" className="auth-button">
        Go to Dashboard
      </a>
    </div>
  </div>
);

// Not Found page
const NotFound = () => (
  <div className="auth-container">
    <div className="auth-card" style={{ textAlign: 'center' }}>
      <div className="auth-header">
        <h1 className="auth-title" style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>404</h1>
        <p className="auth-subtitle">
          The page you're looking for doesn't exist.
        </p>
      </div>
      <a href="/login" className="auth-button">
        Go to Login
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes - any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verification-pending"
          element={
            <ProtectedRoute>
              <VerificationPending />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Organization-only routes */}
        <Route
          path="/organization/*"
          element={
            <ProtectedRoute allowedRoles={['organization']}>
              <OrganizationDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
