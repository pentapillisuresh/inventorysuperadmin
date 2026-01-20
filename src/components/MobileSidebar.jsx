import React from 'react';
import { X, Home, Users, UserPlus, Settings, LogOut, Shield } from 'lucide-react';

const MobileSidebar = ({ isOpen, onClose, activeView, setActiveView, onLogout }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      view: 'dashboard'
    },
    {
      id: 'admin-management',
      label: 'Admin Management',
      icon: <Users className="h-5 w-5" />,
      view: 'admin-management'
    },
      {
    id: 'manager-management',
    label: 'Manager Management',
    icon: <Users className="h-5 w-5" />,
    view: 'manager-management'
  },
    {
      id: 'create-admin',
      label: 'Create Admin',
      icon: <UserPlus className="h-5 w-5" />,
      view: 'create-admin'
    },
    {
      id: 'create-manager',
      label: 'Create Manager',
      icon: <UserPlus className="h-5 w-5" />,
      view: 'create-manager'
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-5 w-5" />,
      view: 'security'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      view: 'settings'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SUPER ADMIN</h1>
                <p className="text-xs text-gray-400">Mobile Menu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.view);
                onClose();
              }}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeView === item.view
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="font-bold">SA</span>
            </div>
            <div className="ml-3">
              <p className="font-medium">Super Admin</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200 border border-red-800/30"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;