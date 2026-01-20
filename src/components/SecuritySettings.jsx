import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Key, AlertTriangle } from 'lucide-react';

const SecuritySettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const securitySettings = [
    {
      id: 'session-timeout',
      label: 'Session Timeout',
      description: 'Automatically logout after inactivity',
      value: '24 hours',
      enabled: true
    },
    {
      id: 'two-factor',
      label: 'Two-Factor Authentication',
      description: 'Require 2FA for login',
      value: 'Disabled',
      enabled: false
    },
    {
      id: 'ip-restriction',
      label: 'IP Restrictions',
      description: 'Allow access only from specific IPs',
      value: 'Disabled',
      enabled: false
    },
    {
      id: 'login-alerts',
      label: 'Login Alerts',
      description: 'Email alerts for new logins',
      value: 'Enabled',
      enabled: true
    },
    {
      id: 'password-policy',
      label: 'Password Policy',
      description: 'Enforce strong passwords',
      value: 'Enabled',
      enabled: true
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    alert('Password changed successfully!');
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const toggleSetting = (id) => {
    // Toggle setting logic
    console.log('Toggle setting:', id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-1">Manage platform security and access controls</p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Security Score</h3>
              <p className="text-3xl font-bold text-green-600">85/100</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Good - Keep improving security measures</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Last Password Change</h3>
              <p className="text-lg font-bold text-gray-900">30 days ago</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Recommended to change every 90 days</p>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Failed Logins</h3>
              <p className="text-lg font-bold text-gray-900">3 attempts</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">In the last 24 hours</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center mb-6">
          <Key className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Security Features</h2>
          <p className="text-sm text-gray-600 mt-1">Configure platform security settings</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {securitySettings.map((setting) => (
            <div key={setting.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <h3 className="font-medium text-gray-900">{setting.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
                <p className="text-sm text-gray-500 mt-1">Current: {setting.value}</p>
              </div>
              <button
                onClick={() => toggleSetting(setting.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  setting.enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex">
          <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
          <div className="ml-4">
            <h3 className="font-semibold text-blue-900">Security Best Practices</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-2">
              <li>• Change your password every 90 days</li>
              <li>• Enable two-factor authentication for additional security</li>
              <li>• Regularly review audit logs for suspicious activity</li>
              <li>• Never share your credentials with anyone</li>
              <li>• Logout from shared computers immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;