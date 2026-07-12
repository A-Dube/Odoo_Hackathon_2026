import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Structural inline shell placeholders to handle missing files elegantly during test execution
const PagePlaceholder = ({ title }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-xs">
    <h2 className="text-xl font-bold text-[#0F172A] mb-1">{title} Module</h2>
    <p className="text-xs text-[#64748B] font-medium">
      This view is mapped securely within the platform dashboard grid layout frame. Awaiting code generation in the upcoming milestone sprint.
    </p>
  </div>
);

function AppContent() {
  const { user } = useContext(AuthContext);

  // Unauthenticated Route Guard Mapping
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Authenticated Platform Shell Execution Grid
  return (
    <Router>
      <div className="min-h-screen flex bg-[#F8FAFC]">
        {/* Persistent Workspace Sidebar */}
        <Sidebar />
        
        {/* Dynamic Secondary Action Panel Layout Stack */}
        <div className="flex-1 flex flex-col pl-64">
          <Navbar />
          
          {/* Core Route Display Canvas Component */}
          <main className="flex-1 p-8 bg-[#F8FAFC]">
            <Routes>
              {/* Dashboard Route Panel */}
              <Route path="/" element={
                <ProtectedRoute allowedRoles={['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst']}>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Active Asset Modules */}
              <Route path="/vehicles" element={
                <ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}>
                  <PagePlaceholder title="Vehicles Registry" />
                </ProtectedRoute>
              } />

              <Route path="/drivers" element={
                <ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}>
                  <PagePlaceholder title="Driver Registry" />
                </ProtectedRoute>
              } />

              {/* Core Logistics Workflow Modules */}
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

              {/* Financial & Analytics Modules */}
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

              {/* Global Catch-all Redirection Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;