import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import QuizView from './pages/QuizView';
import TimetableView from './pages/TimetableView';
import BuddyView from './pages/BuddyView';
import Navbar from './components/layout/Navbar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center font-black animate-pulse">LOADING...</div>;
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizView /></ProtectedRoute>} />
        <Route path="/timetable" element={<ProtectedRoute><TimetableView /></ProtectedRoute>} />
        <Route path="/buddy" element={<ProtectedRoute><BuddyView /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
