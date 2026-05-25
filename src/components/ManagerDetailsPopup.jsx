import React, { useState } from 'react';
import { 
  X, User, Phone, Mail, Building, 
  Calendar, Shield, Key, Store, 
  CheckCircle, XCircle, AlertCircle,
  Edit, RefreshCw, Clock, ShoppingBag, FileText, BarChart3
} from 'lucide-react';
import ApiService from '../utils/ApiService';

const ManagerDetailsPopup = ({ manager, onClose, onRenewSuccess }) => {
  console.log("manager::", manager);
  
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewFormData, setRenewFormData] = useState({
    planType: manager.planType || 'Monthly',
    startDate: '',
    expiryDate: '',
    amount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'blocked':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getPlanColor = (planType) => {
    switch(planType?.toLowerCase()) {
      case 'yearly': 
        return 'bg-blue-100 text-blue-800';
      case 'monthly': 
        return 'bg-green-100 text-green-800';
      case 'trial': 
        return 'bg-amber-100 text-amber-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert('Please generate a password first');
      return;
    }

    setIsResettingPassword(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await ApiService.put(`/users/store-managers/${manager.id}/reset-password`, 
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response) {
        alert(`Password reset successfully for ${manager.managerName}`);
        setShowResetPassword(false);
        setNewPassword('');
        
        // Add to recent activity
        const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        activity.unshift({
          business: manager.adminBusiness,
          description: `Password reset for manager ${manager.managerName}`,
          time: new Date().toLocaleString(),
          type: "updated"
        });
        localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert(`Failed to reset password: ${error.response?.data?.message || error.message || 'Please try again.'}`);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    const confirmMessage = newStatus === 'Blocked' 
      ? `Are you sure you want to block ${manager.managerName}? They will lose access to the system.`
      : `Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} ${manager.managerName}?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await ApiService.put(`/users/store-managers/${manager.id}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response) {
        alert(`Manager status changed to ${newStatus}`);
        
        // Add to recent activity
        const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        activity.unshift({
          business: manager.adminBusiness,
          description: `Manager ${manager.managerName} status changed to ${newStatus}`,
          time: new Date().toLocaleString(),
          type: "updated"
        });
        localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));
        
        // Refresh or update the manager data
        if (onRenewSuccess) {
          onRenewSuccess();
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${error.response?.data?.message || error.message || 'Please try again.'}`);
    }
  };

  const calculateExpiryDate = (startDate, planType) => {
    if (!startDate || !planType) return '';
    
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return '';
    
    const end = new Date(start);
    
    switch(planType) {
      case 'Trial':
        end.setDate(end.getDate() + 15);
        break;
      case 'Monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'Yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        return '';
    }
    
    return end.toISOString().split('T')[0];
  };

  const handleRenewInputChange = (e) => {
    const { name, value } = e.target;
    setRenewFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'startDate' || name === 'planType') {
        if (updated.startDate && updated.planType) {
          updated.expiryDate = calculateExpiryDate(updated.startDate, updated.planType);
        }
      }
      return updated;
    });
  };

  const handleRenewSubmit = async () => {
    if (!renewFormData.planType || !renewFormData.startDate) {
      alert('Please select plan type and start date');
      return;
    }

    if (renewFormData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const requestData = {
        startDate: new Date(renewFormData.startDate).toISOString(),
        expiryDate: renewFormData.expiryDate ? new Date(renewFormData.expiryDate).toISOString() : null,
        planType: renewFormData.planType,
        amount: parseFloat(renewFormData.amount)
      };

      const response = await ApiService.put(`/users/store-managers/${manager.id}/renew`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response) {
        alert('Plan renewed successfully!');
        setShowRenewModal(false);
        
        // Add to recent activity
        const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        activity.unshift({
          business: manager.adminBusiness,
          description: `Plan renewed for manager ${manager.managerName}: ${renewFormData.planType} plan`,
          time: new Date().toLocaleString(),
          type: "updated"
        });
        localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));
        
        // Call success callback if provided
        if (onRenewSuccess) {
          onRenewSuccess();
        }
      }
    } catch (error) {
      console.error('Error renewing plan:', error);
      alert(`Failed to renew plan: ${error.response?.data?.message || error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const planTypes = [
    { value: 'Trial', label: 'Trial (15 days)' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' }
  ];

  const featureIcons = {
    create_store: Store,
    create_rooms: Building,
    create_rack: ShoppingBag,
    create_freezers: ShoppingBag,
    create_invoices: FileText,
    expenditure_management: BarChart3,
    create_outlets: Building
  };

  const featureLabels = {
    create_store: 'Create Store',
    create_rooms: 'Create Rooms',
    create_rack: 'Create Rack',
    create_freezers: 'Create Freezers',
    create_invoices: 'Create Invoices',
    expenditure_management: 'Expenditure Management',
    create_outlets: 'Create Outlets'
  };

  // Safely parse permissions
  const getPermissions = () => {
    try {
      if (manager.permissions) {
        return typeof manager.permissions === 'string' 
          ? JSON.parse(manager.permissions) 
          : manager.permissions;
      }
      return {};
    } catch (error) {
      console.error('Error parsing permissions:', error);
      return {};
    }
  };

  const permissions = getPermissions();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{manager.managerName || 'Unknown Manager'}</h2>
                <p className="text-blue-100 mt-1">Manager Account Details</p>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center">
                    {getStatusIcon(manager.status)}
                    <span className="ml-2 font-medium">{manager.status || 'Unknown'}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(manager.planType)}`}>
                    {manager.planType || 'No Plan'} Plan
                  </span>
                  <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
                    ID: {getDisplayId(manager.id)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {manager.daysRemaining && manager.daysRemaining > 0 && (
              <div className="flex items-center text-blue-100 mt-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>{manager.daysRemaining} days remaining in current plan</span>
              </div>
            )}
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
                      <p className="font-medium">{manager.managerName || manager.name || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{manager.phone || manager.phoneNumber || 'N/A'}</span>
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
                      <p className="font-medium">{manager.adminBusiness || manager.businessName || 'Unknown'}</p>
                      {manager.adminPlan && (
                        <p className="text-sm text-gray-500 mt-1">Admin Plan: {manager.adminPlan}</p>
                      )}
                    </div>
                    <div className="flex items-start">
                      <Store className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                      <div>
                        <p className="font-medium">{manager.storeName || 'Not Assigned'}</p>
                        {manager.storeId && (
                          <p className="text-sm text-gray-500">Store ID: {getDisplayId(manager.storeId)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              {manager.planType && (
                <div className="bg-blue-50 p-5 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Subscription Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Plan Type</p>
                      <p className="text-lg font-bold text-blue-700">{manager.planType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="text-lg font-bold text-gray-900">{formatDate(manager.planStartDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="text-lg font-bold text-gray-900">{formatDate(manager.planEndDate)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Permissions & Access */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Manager Permissions</h3>
                {Object.keys(permissions).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(permissions).map(([feature, enabled]) => {
                      const Icon = featureIcons[feature] || ShoppingBag;
                      return (
                        <div 
                          key={feature} 
                          className={`flex items-center p-3 rounded-lg border ${
                            enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'
                          }`}
                        >
                          <Icon className="h-5 w-5 mr-3 text-gray-500" />
                          <span className="font-medium text-gray-700">
                            {featureLabels[feature] || feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <div className="ml-auto">
                            {enabled ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-2">Default Store Access</h4>
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
                )}
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
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
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
                        {manager.passwordMethod === 'auto' ? 'Auto-generated' : manager.passwordMethod === 'manual' ? 'Manual' : 'Unknown'}
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
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-mono bg-white"
                            placeholder="Generate new password"
                          />
                          <button
                            type="button"
                            onClick={generatePassword}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowResetPassword(false);
                              setNewPassword('');
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleResetPassword}
                            disabled={!newPassword || isResettingPassword}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                    {manager.storeName && (
                      <div className="flex items-start">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <Store className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Store Assigned</p>
                          <p className="text-sm text-gray-600">Assigned to {manager.storeName}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(manager.createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="border-t px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleStatusChange('Active')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    manager.status === 'Active'
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Activate
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Inactive')}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    manager.status === 'Inactive'
                      ? 'bg-gray-100 text-gray-800 border-gray-300'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Deactivate
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowRenewModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Renew Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Renew Plan Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Renew Plan</h3>
                <button
                  onClick={() => setShowRenewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Renew subscription plan for manager <span className="font-semibold">{manager.managerName}</span>
              </p>

              <div className="space-y-4">
                {/* Plan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type *
                  </label>
                  <select
                    name="planType"
                    value={renewFormData.planType}
                    onChange={handleRenewInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    {planTypes.map(plan => (
                      <option key={plan.value} value={plan.value}>{plan.label}</option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={renewFormData.startDate}
                    onChange={handleRenewInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                {/* Expiry Date (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={renewFormData.expiryDate}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically calculated based on plan type and start date
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    onChange={handleRenewInputChange}
                    value={renewFormData.amount}
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowRenewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenewSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Renewal'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerDetailsPopup;