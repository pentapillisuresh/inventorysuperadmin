import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('superAdminLoggedIn');
      localStorage.removeItem('superAdminUsername');
      localStorage.removeItem('superAdminLoginTime');
      onLogout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Logout"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </button>
  );
};

export default LogoutButton;