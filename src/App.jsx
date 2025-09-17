import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import TestPage from './components/TestPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const { isDarkMode } = useDarkMode();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-100 text-gray-900'
    }`}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireDashboard={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </DarkModeProvider>
    </ErrorBoundary>
  );
}

export default App;
