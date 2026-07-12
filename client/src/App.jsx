import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Vehicles from './pages/Vehicles'; // Wired to UI
import Drivers from './pages/Drivers';   // Wired to UI
import ProtectedRoute from './components/ProtectedRoute';

const PagePlaceholder = ({ title }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-xs">
    <h2 className="text-xl font-bold text-[#0F172A] mb-1">{title} Module</h2>
    <p className="text-xs text-[#64748B] font-medium">
      This view is mapped securely within the platform dashboard grid layout frame.
    </p>
  </div>
);

function AppContent() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-10">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/vehicles" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}>
                <Vehicles />
              </ProtectedRoute>
            } />
            <Route path="/drivers" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}>
                <Drivers />
              </ProtectedRoute>
            } />
            <Route path="/trips" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Driver']}>
                <PagePlaceholder title="Active Trip Manifests" />
              </ProtectedRoute>
            } />
            <Route path="/maintenance" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}>
                <PagePlaceholder title="Vehicle Service Logging" />
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}>
                <PagePlaceholder title="Fuel Logs & Expense Ledger" />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst', 'Safety Officer']}>
                <PagePlaceholder title="Operational Intelligence Metrics" />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;