import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, Clock, 
  TrendingUp, TrendingDown,
  Plus, RefreshCw, Building,
  Shield, BarChart3, Settings
} from 'lucide-react';

const SuperAdminDashboard = ({ setCurrentView }) => {
  const [dashboardData, setDashboardData] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    blockedAdmins: 0,
    expiringSoon: 0,
    totalManagers: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const managers = JSON.parse(localStorage.getItem('managers') || '[]');
    
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(admin => admin.status === 'Active').length;
    const blockedAdmins = admins.filter(admin => admin.status === 'Blocked').length;
    
    // Calculate expiring soon (within 7 days)
    const today = new Date();
    const expiringSoon = admins.filter(admin => {
      if (!admin.planEndDate) return false;
      const endDate = new Date(admin.planEndDate);
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && admin.status === 'Active';
    }).length;

    setDashboardData({
      totalAdmins,
      activeAdmins,
      blockedAdmins,
      expiringSoon,
      totalManagers: managers.length
    });
  }, []);

  const stats = [
    {
      title: "Total Admins",
      value: dashboardData.totalAdmins,
      change: dashboardData.totalAdmins > 0 ? "+12%" : "0%",
      changeType: dashboardData.totalAdmins > 0 ? "up" : "neutral",
      icon: <Users className="h-6 w-6 text-white" />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-600"
    },
    {
      title: "Active Admins",
      value: dashboardData.activeAdmins,
      change: dashboardData.activeAdmins > 0 ? "+5.2%" : "0%",
      changeType: dashboardData.activeAdmins > 0 ? "up" : "neutral",
      subtext: "active rate",
      icon: <UserCheck className="h-6 w-6 text-white" />,
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-green-600"
    },
    {
      title: "Total Managers",
      value: dashboardData.totalManagers,
      change: "+8%",
      changeType: "up",
      icon: <Building className="h-6 w-6 text-white" />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-600"
    },
    {
      title: "Expiring Soon",
      value: dashboardData.expiringSoon,
      subtext: "Next 7 days",
      icon: <Clock className="h-6 w-6 text-white" />,
      bgColor: "bg-gradient-to-br from-amber-500 to-amber-600",
      textColor: "text-amber-600"
    }
  ];

  const quickActions = [
    {
      title: "Create Admin",
      description: "Onboard new business",
      icon: <Plus className="h-5 w-5" />,
      action: () => setCurrentView('create-admin'),
      gradient: "from-blue-500 to-blue-600",
      hover: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Admin Management",
      description: "Manage all admin accounts",
      icon: <UserCheck className="h-5 w-5" />,
      action: () => setCurrentView('admin-management'),
      gradient: "from-green-500 to-green-600",
      hover: "hover:from-green-600 hover:to-green-700"
    },
    {
      title: "Manager Management",
      description: "Manage business managers",
      icon: <Building className="h-5 w-5" />,
      action: () => setCurrentView('manager-management'),
      gradient: "from-purple-500 to-purple-600",
      hover: "hover:from-purple-600 hover:to-purple-700"
    },
    {
      title: "Security Settings",
      description: "Platform security controls",
      icon: <Shield className="h-5 w-5" />,
      action: () => setCurrentView('security'),
      gradient: "from-indigo-500 to-indigo-600",
      hover: "hover:from-indigo-600 hover:to-indigo-700"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and quick actions</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                {stat.icon}
              </div>
              {stat.change && (
                <div className={`flex items-center ${stat.changeType === 'up' ? 'text-green-600' : stat.changeType === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                  {stat.changeType === 'up' ? <TrendingUp className="h-4 w-4" /> : 
                   stat.changeType === 'down' ? <TrendingDown className="h-4 w-4" /> : null}
                  <span className="ml-1 text-sm font-medium">{stat.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
            {stat.subtext && (
              <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`group bg-gradient-to-br ${action.gradient} ${action.hover} text-white p-5 rounded-xl transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold text-lg mb-1">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
                <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Platform Overview</h3>
            <p className="text-gray-600 mt-1">
              Manage your business ecosystem efficiently with real-time insights and controls
            </p>
          </div>
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{dashboardData.totalAdmins}</div>
            <div className="text-sm text-gray-600">Total Businesses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{dashboardData.activeAdmins}</div>
            <div className="text-sm text-gray-600">Active Subscriptions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{dashboardData.totalManagers}</div>
            <div className="text-sm text-gray-600">Managers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;