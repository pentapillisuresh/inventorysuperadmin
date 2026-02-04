import React, { useState } from 'react';
import { Search, Bell, HelpCircle, User, Menu, X } from 'lucide-react';

const Header = ({ activeView, notifications = [], onToggleMobileSidebar, mobileSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Dashboard',
      'admin-management': 'Admin Management',
      'create-admin': 'Create New Admin',
      'create-manager': 'Create Manager',
      'audit-logs': 'Audit Logs',
      'security': 'Security Settings',
      'settings': 'System Settings',
      'help': 'Help & Support'
    };
    return titles[activeView] || 'Dashboard';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section - Mobile menu and title */}
          <div className="flex items-center">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden mr-4 p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileSidebarOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-600">
                {activeView === 'dashboard' ? 'Platform overview and statistics' : 'Manage your platform'}
              </p>
            </div>
          </div>

          {/* Right section - Search and icons */}
          <div className="flex items-center space-x-4">
        

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-sm">SA</span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">Super Admin</p>
                  <p className="text-xs text-gray-500">Platform Owner</p>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">Super Admin</p>
                        <p className="text-sm text-gray-500">superadmin@system.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveView('settings');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveView('security');
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Security
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;