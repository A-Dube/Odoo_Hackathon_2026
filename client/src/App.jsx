import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';

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
                <Trips />
              </ProtectedRoute>
            } />

            <Route path="/maintenance" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Safety Officer']}>
                <Maintenance />
              </ProtectedRoute>
            } />

            <Route path="/expenses" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst']}>
                <Expenses />
              </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['Fleet Manager', 'Financial Analyst', 'Safety Officer']}>
                <Reports />
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