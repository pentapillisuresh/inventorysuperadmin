import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileSidebar from './MobileSidebar';

const Layout = ({ children, activeView, setActiveView, onLogout }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage
  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    const notificationItems = activity.slice(0, 5).map((item, index) => ({
      id: index,
      title: item.business,
      message: item.description,
      time: item.time,
      type: item.type,
      icon: item.type === 'warning' ? '⚠️' : '📝',
      read: false
    }));
    setNotifications(notificationItems);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          activeView={activeView}
          notifications={notifications}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          mobileSidebarOpen={mobileSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-white py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Super Admin Platform</p>
              <p className="text-xs text-gray-400 mt-1">All rights reserved</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Version 1.0.0 • {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;