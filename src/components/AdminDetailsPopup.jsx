import React from 'react';
import { 
  X, Building, User, Phone, Mail, Calendar, 
  CheckCircle, XCircle, AlertCircle, Key, 
  Store, Users, ShoppingBag, FileText, BarChart3,
  Clock, Shield
} from 'lucide-react';

const AdminDetailsPopup = ({ admin, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Blocked':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getPlanColor = (planType) => {
    switch(planType) {
      case 'Yearly': return 'bg-blue-100 text-blue-800';
      case 'Monthly': return 'bg-green-100 text-green-800';
      case 'Trial': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const featureIcons = {
    dashboard: BarChart3,
    productManagement: ShoppingBag,
    invoiceManagement: FileText,
    appointmentBooking: Calendar,
    reportsAnalytics: BarChart3
  };

  const featureLabels = {
    dashboard: 'Dashboard',
    productManagement: 'Product Management',
    invoiceManagement: 'Invoice Management',
    appointmentBooking: 'Appointment Booking',
    reportsAnalytics: 'Reports & Analytics'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{admin.businessName}</h2>
              <p className="text-blue-100 mt-1">Admin Account Details</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getPlanColor(admin.planType)}`}>
              {admin.planType} Plan
            </span>
            <div className="flex items-center">
              {getStatusIcon(admin.status)}
              <span className="ml-2 font-medium">{admin.status}</span>
            </div>
            {admin.daysRemaining && (
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
                    <p className="font-medium">{admin.businessName}</p>
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
                    <p className="font-medium">{admin.adminName}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">{admin.phone}</span>
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
                  <p className="text-lg font-bold text-blue-700">{admin.planType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="text-lg font-bold text-gray-900">{admin.planStartDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="text-lg font-bold text-gray-900">{admin.planEndDate}</p>
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
                  <p className="text-3xl font-bold text-blue-600">{admin.limits?.maxStores || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">Max Managers</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{admin.limits?.maxManagers || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center mb-2">
                    <ShoppingBag className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">Max Outlets</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{admin.limits?.maxOutlets || 0}</p>
                </div>
              </div>
            </div>

            {/* Enabled Features */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-4 border-b">
                <h3 className="font-semibold text-gray-900">Enabled Features & Permissions</h3>
                <p className="text-sm text-gray-600 mt-1">Admin can access only these features</p>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(admin.features || {}).map(([feature, enabled]) => {
                    const Icon = featureIcons[feature];
                    return (
                      <div 
                        key={feature} 
                        className={`flex items-center p-3 rounded-lg border ${enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-50'}`}
                      >
                        {Icon && <Icon className="h-5 w-5 mr-3 text-gray-500" />}
                        <span className="font-medium text-gray-700">{featureLabels[feature] || feature}</span>
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

            {/* Security Information */}
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="font-semibold text-amber-900">Security Information</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Last Login</span>
                  <span className="font-medium">Never (Account not used yet)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Password Method</span>
                  <span className="font-medium">{admin.passwordMethod === 'auto' ? 'Auto-generated' : 'Manual'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Account Status</span>
                  <span className="font-medium">{admin.status}</span>
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
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Renew plan functionality for ${admin.businessName} coming soon!`);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Renew Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsPopup;