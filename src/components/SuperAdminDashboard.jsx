import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserX, Clock, 
  TrendingUp, TrendingDown,
  Plus, RefreshCw, FileText,
  AlertTriangle
} from 'lucide-react';

const SuperAdminDashboard = ({ setCurrentView }) => {
  const [dashboardData, setDashboardData] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    blockedAdmins: 0,
    expiringSoon: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(admin => admin.status === 'Active').length;
    const blockedAdmins = admins.filter(admin => admin.status === 'Blocked').length;
    
    // Calculate expiring soon (within 7 days)
    const today = new Date();
    const expiringSoon = admins.filter(admin => {
      const endDate = new Date(admin.planEndDate);
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && admin.status === 'Active';
    }).length;

    setDashboardData({
      totalAdmins,
      activeAdmins,
      blockedAdmins,
      expiringSoon
    });

    // Load recent activity
    const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    setRecentActivity(activity.slice(0, 4));
  }, []);

  const stats = [
    {
      title: "TOTAL ADMINS",
      value: dashboardData.totalAdmins,
      change: "+12%",
      changeType: "up",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-50"
    },
    {
      title: "ACTIVE ADMINS",
      value: dashboardData.activeAdmins,
      change: "+5.2%",
      changeType: "up",
      subtext: "active rate",
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      color: "bg-green-50"
    },
    {
      title: "BLOCKED ADMINS",
      value: dashboardData.blockedAdmins,
      change: "-3",
      changeType: "down",
      subtext: "from yesterday",
      icon: <UserX className="h-6 w-6 text-red-500" />,
      color: "bg-red-50"
    },
    {
      title: "EXPIRING SOON",
      value: dashboardData.expiringSoon,
      subtext: "Next 7 days",
      icon: <Clock className="h-6 w-6 text-amber-500" />,
      color: "bg-amber-50"
    }
  ];

  const quickActions = [
    {
      title: "Create New Admin",
      description: "Onboard new business",
      icon: <Plus className="h-5 w-5" />,
      action: () => setCurrentView('create-admin'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Extend Plan",
      description: "Renew subscriptions",
      icon: <RefreshCw className="h-5 w-5" />,
      action: () => setCurrentView('admin-management'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "View Audit Logs",
      description: "Consistent monitoring",
      icon: <FileText className="h-5 w-5" />,
      action: () => alert('Audit logs feature coming soon!'),
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'created':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'renewed':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              {stat.change && (
                <div className={`flex items-center ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.changeType === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="ml-1 text-sm font-medium">{stat.change}</span>
                </div>
              )}
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
            {stat.subtext && (
              <p className="text-gray-500 text-sm mt-1">{stat.subtext}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Admin Activity</h2>
            <div className="space-y-6">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.business}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'created' ? 'bg-green-100 text-green-800' :
                      activity.type === 'renewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`w-full flex items-center justify-between p-4 rounded-lg ${action.color} text-white transition-colors`}
                >
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm opacity-90">{action.description}</div>
                  </div>
                  {action.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;