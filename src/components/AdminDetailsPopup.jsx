import React, { useState } from 'react';
import { 
  X, Building, User, Phone, Mail, Calendar, 
  CheckCircle, XCircle, AlertCircle, Key, 
  Store, Users, ShoppingBag, FileText, BarChart3,
  Clock, Shield, RefreshCw
} from 'lucide-react';
import ApiService from '../utils/ApiService';

const AdminDetailsPopup = ({ admin, onClose, onRenewSuccess }) => {
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewFormData, setRenewFormData] = useState({
    planType: admin.planType || 'Monthly',
    startDate: '',
    expiryDate: '',
    amount: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'blocked':
        return <XCircle className="h-5 w-5 text-red-500" />;
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

      const response = await ApiService.put(`users/admins/${admin.id}/renew`, requestData, {
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
          business: admin.businessName,
          description: `Plan renewed: ${renewFormData.planType} plan`,
          time: new Date().toLocaleString(),
          type: "updated"
        });
        localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));
        
        // Call success callback if provided
        if (onRenewSuccess) {
          onRenewSuccess();
        } else {
          window.location.reload();
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
    create_outlets: Users
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

  // Parse permissions safely
  const getPermissions = () => {
    try {
      if (admin.permissions) {
        return typeof admin.permissions === 'string' 
          ? JSON.parse(admin.permissions) 
          : admin.permissions;
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
                <h2 className="text-2xl font-bold">{admin.businessName || 'N/A'}</h2>
                <p className="text-blue-100 mt-1">Admin Account Details</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getPlanColor(admin.planType)}`}>
                {admin.planType || 'N/A'} Plan
              </span>
              <div className="flex items-center">
                {getStatusIcon(admin.status)}
                <span className="ml-2 font-medium">{admin.status || 'N/A'}</span>
              </div>
              {admin.daysRemaining !== undefined && admin.daysRemaining !== null && (
                <div className="flex items-center text-blue-100">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{admin.daysRemaining} days remaining</span>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6 space-y-8">
              {/* Business & Admin Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-xl">
                  <div className="flex items-center mb-4">
                    <Building className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="font-semibold text-gray-900">Business Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="font-medium">{admin.businessName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Type</p>
                      <p className="font-medium">{admin.businessType || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Created</p>
                      <p className="font-medium">{formatDate(admin.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl">
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="font-semibold text-gray-900">Admin Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Admin Name</p>
                      <p className="font-medium">{admin.adminName || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-medium">{admin.phone || 'N/A'}</span>
                    </div>
                    {admin.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">{admin.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-blue-50 p-5 rounded-xl">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Subscription Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Plan Type</p>
                    <p className="text-lg font-bold text-blue-700">{admin.planType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(admin.planStartDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="text-lg font-bold text-gray-900">{formatDate(admin.planEndDate)}</p>
                  </div>
                </div>
              </div>

              {/* Usage Limits */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Usage Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Store className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700">Max Stores</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{admin.maxStores || 0}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700">Max Outlets</span>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{admin.maxOutlet || 0}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-700">Max Managers</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">5</p>
                  </div>
                </div>
              </div>

              {/* Enabled Features */}
              {Object.keys(permissions).length > 0 && (
                <div className="bg-white border rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b">
                    <h3 className="font-semibold text-gray-900">Enabled Features & Permissions</h3>
                    <p className="text-sm text-gray-600 mt-1">Admin can access only these features</p>
                  </div>
                  <div className="p-5">
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
                  </div>
                </div>
              )}

              {/* Security Information */}
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-amber-600 mr-2" />
                  <h3 className="font-semibold text-amber-900">Security Information</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-800">Last Login</span>
                    <span className="font-medium">
                      {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never (Account not used yet)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-800">Password Method</span>
                    <span className="font-medium">
                      {admin.passwordMethod === 'auto' ? 'Auto-generated' : admin.passwordMethod === 'manual' ? 'Manual' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-800">Account Status</span>
                    <span className="font-medium">{admin.status || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50">
            <div className="flex justify-end space-x-3">
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
                Renew subscription plan for <span className="font-semibold">{admin.businessName}</span>
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

export default AdminDetailsPopup;