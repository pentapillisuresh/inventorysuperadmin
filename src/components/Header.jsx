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
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search admins, businesses, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>

            {/* Help */}
            <button
              onClick={() => setActiveView('help')}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
              title="Help"
            >
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 relative"
                title="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`p-2 rounded-lg ${notification.type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                              {notification.icon}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => setActiveView('audit-logs')}
                      className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

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