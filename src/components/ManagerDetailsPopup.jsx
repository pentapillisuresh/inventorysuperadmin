import React, { useState } from 'react';
import { 
  X, User, Phone, Mail, Building, 
  Calendar, Shield, Key, Store, 
  CheckCircle, XCircle, AlertCircle,
  Edit, RefreshCw
} from 'lucide-react';

const ManagerDetailsPopup = ({ manager, onClose }) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Inactive':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'Blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  // Safe ID display function
  const getDisplayId = (id) => {
    if (!id) return 'N/A';
    const idStr = String(id);
    return idStr.slice(0, 8);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const handleResetPassword = () => {
    if (newPassword) {
      alert(`Password reset for ${manager.managerName} to: ${newPassword}`);
      setShowResetPassword(false);
      setNewPassword('');
    }
  };

  const handleStatusChange = (newStatus) => {
    const confirmMessage = newStatus === 'Blocked' 
      ? `Are you sure you want to block ${manager.managerName}? They will lose access to the system.`
      : `Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} ${manager.managerName}?`;

    if (window.confirm(confirmMessage)) {
      alert(`Manager status changed to ${newStatus}`);
      // In real app, update in localStorage/backend
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{manager.managerName || 'Unknown Manager'}</h2>
              <p className="text-blue-100 mt-1">Manager Account Details</p>
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center">
                  {getStatusIcon(manager.status)}
                  <span className="ml-2 font-medium">{manager.status || 'Unknown'}</span>
                </div>
                <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
                  Manager ID: {getDisplayId(manager.id)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-8">
            {/* Manager & Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">Manager Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{manager.managerName || 'N/A'}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">{manager.phone || 'N/A'}</span>
                  </div>
                  {manager.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{manager.email}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Account Created</p>
                    <p className="font-medium">{formatDate(manager.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <div className="flex items-center mb-4">
                  <Building className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">Business & Store</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium">{manager.adminBusiness || 'Unknown'}</p>
                    <p className="text-sm text-gray-500 mt-1">Plan: {manager.adminPlan || 'Unknown'}</p>
                  </div>
                  <div className="flex items-start">
                    <Store className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="font-medium">{manager.storeName || 'Not Assigned'}</p>
                      <p className="text-sm text-gray-500">Store ID: {getDisplayId(manager.storeId)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assigned Store</p>
                    <p className="font-medium">{manager.storeName || 'Not Assigned'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login & Security */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="font-semibold text-gray-900">Security & Access</h3>
                  </div>
                  <button
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Reset Password
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="font-medium text-gray-900">
                      {manager.lastLogin ? formatDate(manager.lastLogin) : 'Never logged in'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Password Method</p>
                    <p className="font-medium text-gray-900">
                      {manager.passwordMethod === 'auto' ? 'Auto-generated' : 'Manual' || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Login Attempts</p>
                    <p className="font-medium text-gray-900">
                      {manager.loginAttempts || 0} (Last 24 hours)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <div className="flex items-center">
                      {getStatusIcon(manager.status)}
                      <span className="ml-2 font-medium">{manager.status || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {/* Reset Password Section */}
                {showResetPassword && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Reset Password</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={newPassword}
                          readOnly
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono"
                          placeholder="Generate new password"
                        />
                        <button
                          onClick={generatePassword}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setShowResetPassword(false)}
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleResetPassword}
                          disabled={!newPassword}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          Reset Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Permissions & Access */}
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4">Manager Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Store Access</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      View assigned store only
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Manage store inventory
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Create invoice drafts
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Restrictions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      Cannot access admin settings
                    </li>
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      Cannot create new managers
                    </li>
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      Cannot modify subscription plans
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-4 border-b">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600 mt-1">Last actions performed by this manager</p>
              </div>
              <div className="p-5">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Account Created</p>
                      <p className="text-sm text-gray-600">Manager account was created by Super Admin</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(manager.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Store Assigned</p>
                      <p className="text-sm text-gray-600">Assigned to {manager.storeName || 'Not Assigned'}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(manager.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusChange('Active')}
                className={`px-4 py-2 rounded-lg border ${
                  manager.status === 'Active'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Activate
              </button>
              <button
                onClick={() => handleStatusChange('Inactive')}
                className={`px-4 py-2 rounded-lg border ${
                  manager.status === 'Inactive'
                    ? 'bg-gray-100 text-gray-800 border-gray-300'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Deactivate
              </button>
              <button
                onClick={() => handleStatusChange('Blocked')}
                className={`px-4 py-2 rounded-lg border ${
                  manager.status === 'Blocked'
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Block
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Edit functionality for ${manager.managerName} coming soon!`);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Manager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDetailsPopup;