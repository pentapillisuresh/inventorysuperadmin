import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Shield,
  TrendingUp,
  Settings
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
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
    icon: <UserCog className="h-5 w-5" />,
    view: 'manager-management'
  },
    {
      id: 'admin-creation',
      label: 'Admin Creation',
      icon: <UserCog className="h-5 w-5" />,
      submenu: [
        {
          id: 'create-admin',
          label: 'Create New Admin',
          icon: <UserPlus className="h-4 w-4" />,
          view: 'create-admin'
        },
        {
          id: 'create-manager',
          label: 'Create Manager',
          icon: <UserPlus className="h-4 w-4" />,
          view: 'create-manager'
        }
      ]
    },
    {
      id: 'monitoring',
      label: 'Plan Monitoring',
      icon: <TrendingUp className="h-5 w-5" />,
      view: 'admin-management'
    },
    // {
    //   id: 'audit',
    //   label: 'Audit Logs',
    //   icon: <FileText className="h-5 w-5" />,
    //   view: 'audit-logs'
    // },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-5 w-5" />,
      view: 'security'
    }
  ];

  const handleItemClick = (item) => {
    if (item.view) {
      setActiveView(item.view);
      setActiveSubmenu(null);
    } else if (item.submenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    }
  };

  const handleSubmenuClick = (subItem) => {
    setActiveView(subItem.view);
  };

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} flex flex-col h-screen no-scrollbar`}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SUPER ADMIN</h1>
                <p className="text-xs text-gray-400">Platform Control</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center w-full">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center ${collapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-lg mb-1 transition-colors ${
                  activeView === item.view || activeSubmenu === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="ml-3 flex-1 text-left font-medium">{item.label}</span>
                )}
                {!collapsed && item.submenu && (
                  <ChevronRight className={`h-4 w-4 transition-transform ${
                    activeSubmenu === item.id ? 'rotate-90' : ''
                  }`} />
                )}
              </button>
              
              {/* Submenu */}
              {!collapsed && item.submenu && activeSubmenu === item.id && (
                <div className="ml-10 mt-1 mb-2 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleSubmenuClick(subItem)}
                      className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm transition-colors ${
                        activeView === subItem.view
                          ? 'bg-blue-900 text-blue-100'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                      }`}
                    >
                      <span className="mr-3">{subItem.icon}</span>
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-800 p-4">
      

        {/* Bottom Menu - Only Logout */}
        <div className="space-y-1">
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'px-4'} py-2.5 rounded-lg text-red-300 hover:bg-red-900/20 hover:text-red-200`}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>

      
        {/* Version */}
        {!collapsed && (
          <div className="mt-4 px-4">
            <p className="text-xs text-gray-500 text-center">v1.0.0</p>
          </div>
        )}
      </div>

      {/* Add inline styles for scrollbar removal */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;