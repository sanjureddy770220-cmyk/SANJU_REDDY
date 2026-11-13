// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import FarmsPage from './pages/FarmsPage';
import NewAdvisoryPage from './pages/NewAdvisoryPage';
import AdvisoryDetailPage from './pages/AdvisoryDetailPage';
import HistoryPage from './pages/HistoryPage';

function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-stone-500">Initializing AgriPulse AI...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <div className="min-h-screen flex flex-col bg-stone-50">
            <Navbar />
            <main className="flex-1">
              <LandingPage />
            </main>
          </div>
        }
      />
      <Route
        path="/auth"
        element={
          <div className="min-h-screen flex flex-col bg-stone-50">
            <Navbar />
            <main className="flex-1">
              <AuthPage />
            </main>
          </div>
        }
      />

      {/* Protected Routes with Sidebar Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/farms"
        element={
          <ProtectedLayout>
            <FarmsPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/advisory/new"
        element={
          <ProtectedLayout>
            <NewAdvisoryPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/advisory/:id"
        element={
          <ProtectedLayout>
            <AdvisoryDetailPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedLayout>
            <HistoryPage />
          </ProtectedLayout>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

