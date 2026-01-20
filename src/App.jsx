import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminManagement from './components/AdminManagement';
import CreateAdmin from './components/CreateAdmin';
import CreateManager from './components/CreateManager';
import AdminDetailsPopup from './components/AdminDetailsPopup';
import AuditLogs from './components/AuditLogs';
import SecuritySettings from './components/SecuritySettings';
import SystemSettings from './components/SystemSettings';
import HelpSupport from './components/HelpSupport';
import ManagerManagement from './components/ManagerManagement';
import { initializeDummyData, updateAdminDaysRemaining } from './utils/initialData';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Update state to handle object structure for currentView
  const [currentView, setCurrentView] = useState({ view: 'dashboard' });
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminPopup, setShowAdminPopup] = useState(false);

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData();
    updateAdminDaysRemaining();

    // Check if user is already logged in
    const loggedIn = localStorage.getItem('superAdminLoggedIn') === 'true';
    setIsAuthenticated(loggedIn);

    // Auto-logout after 24 hours
    const loginTime = localStorage.getItem('superAdminLoginTime');
    if (loginTime) {
      const hoursSinceLogin = (new Date() - new Date(loginTime)) / (1000 * 60 * 60);
      if (hoursSinceLogin > 24) {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView({ view: 'dashboard' });
  };

  const handleLogout = () => {
    localStorage.removeItem('superAdminLoggedIn');
    localStorage.removeItem('superAdminUsername');
    localStorage.removeItem('superAdminLoginTime');
    setIsAuthenticated(false);
  };

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowAdminPopup(true);
  };

  // Dashboard Content based on current view
  const renderContent = () => {
    switch(currentView.view || currentView) {
      case 'dashboard':
        return <SuperAdminDashboard setCurrentView={setCurrentView} />;
      case 'admin-management':
        return (
          <AdminManagement 
            setCurrentView={setCurrentView} 
            onViewDetails={handleViewDetails}
          />
        );
      case 'create-admin':
        return (
          <CreateAdmin 
            setCurrentView={setCurrentView}
            editMode={currentView.editMode || false}
            adminToEdit={currentView.adminToEdit || null}
          />
        );
      case 'manager-management':
        return <ManagerManagement />;
      case 'create-manager':
        return <CreateManager setCurrentView={setCurrentView} />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'security':
        return <SecuritySettings />;
      case 'settings':
        return <SystemSettings />;
      case 'help':
        return <HelpSupport />;
      default:
        return <SuperAdminDashboard setCurrentView={setCurrentView} />;
    }
  };

  // Helper function to set simple view (for menu clicks)
  const setActiveView = (view) => {
    setCurrentView({ view });
  };

  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout 
                activeView={currentView.view}
                setActiveView={setActiveView}
                onLogout={handleLogout}
              >
                {renderContent()}
                
                {/* Admin Details Popup */}
                {showAdminPopup && selectedAdmin && (
                  <AdminDetailsPopup
                    admin={selectedAdmin}
                    onClose={() => setShowAdminPopup(false)}
                  />
                )}
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect all other routes */}
        <Route 
          path="*" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;