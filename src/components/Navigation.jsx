import React from 'react';
import { Home, Users, PlusCircle, UserPlus, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      active: location.pathname === '/dashboard'
    },
    {
      name: 'Admin Management',
      path: '/admin-management',
      icon: <Users className="h-5 w-5" />,
      active: location.pathname === '/admin-management'
    },
    {
      name: 'Create Admin',
      path: '/create-admin',
      icon: <PlusCircle className="h-5 w-5" />,
      active: location.pathname === '/create-admin'
    },
    {
      name: 'Create Manager',
      path: '/create-manager',
      icon: <UserPlus className="h-5 w-5" />,
      active: location.pathname === '/create-manager'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and main nav */}
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <Home className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">SUPER ADMIN</h1>
            </div>
            
            <div className="ml-6 flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {localStorage.getItem('superAdminUsername') || 'Super Admin'}
              </div>
              <div className="text-xs text-gray-500">Platform Administrator</div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;