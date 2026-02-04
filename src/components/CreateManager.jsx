import React, { useState } from 'react';
import { ArrowLeft, Key, User, Building, Shield, Image as ImageIcon, Layout, Check } from 'lucide-react';

const CreateManager = ({ setCurrentView }) => {
  const [formData, setFormData] = useState({
    managerName: '',
    phone: '',
    email: '',
    passwordMethod: 'auto',
    password: '',
    profileImage: '',
    businessLogo: '',
  });

  const [selectedFeatures, setSelectedFeatures] = useState({
    dashboard: false,
    productManagement: true,
    invoiceManagement: true,
    appointmentBooking: true,
    inventoryManagement: true,
    reportsAnalytics: false,
    staffManagement: false,
    advancedAnalytics: false,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePassword = () => {
    setIsGenerating(true);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setFormData(prev => ({ ...prev, password }));
    setTimeout(() => setIsGenerating(false), 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setFormData(prev => ({ ...prev, profileImage: reader.result }));
        } else {
          setFormData(prev => ({ ...prev, businessLogo: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.managerName || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Create manager object
    const manager = {
      id: Date.now().toString(),
      ...formData,
      selectedFeatures,
      createdAt: new Date().toISOString(),
      status: 'Active',
      lastLogin: null
    };

    // Save to localStorage
    const managers = JSON.parse(localStorage.getItem('managers') || '[]');
    managers.push(manager);
    localStorage.setItem('managers', JSON.stringify(managers));

    // Add to recent activity
    const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    activity.unshift({
      description: `Manager created: ${formData.managerName}`,
      time: "Just now",
      type: "created"
    });
    localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));

    alert('Manager account created successfully!');
    setCurrentView('dashboard');
  };

  const featureList = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'productManagement', label: 'Product Management' },
    { id: 'invoiceManagement', label: 'Invoice Management' },
    { id: 'appointmentBooking', label: 'Appointment Booking' },
    { id: 'inventoryManagement', label: 'Inventory Management' },
    { id: 'reportsAnalytics', label: 'Reports & Analytics' },
    { id: 'staffManagement', label: 'Staff Management' },
    { id: 'advancedAnalytics', label: 'Advanced Analytics' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => setCurrentView('manager-management')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Manager Management
      </button>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">SUPER ADMIN</h1>
          <h2 className="text-lg font-semibold text-gray-700 mt-1">Create Manager Account</h2>
          <p className="text-gray-600 mt-2">Manage your platform</p>
        </div>

        <form onSubmit={handleSubmit} className="divide-y">
          {/* Section 1: Profile Images */}
          <section className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Admin Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Profile Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('profile', e)}
                    />
                    {formData.profileImage ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                          <img
                            src={formData.profileImage}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-blue-600 font-medium">Change Photo</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <div className="text-gray-600 font-medium">Click to upload profile image</div>
                        <div className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Business Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('business', e)}
                    />
                    {formData.businessLogo ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-white rounded-xl overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg p-2">
                          <img
                            src={formData.businessLogo}
                            alt="Business logo preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-sm text-blue-600 font-medium">Change Logo</span>
                      </div>
                    ) : (
                      <>
                        <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <div className="text-gray-600 font-medium">Click to upload business logo</div>
                        <div className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</div>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Manager Details */}
          <section className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Manager Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Name *
                </label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Login ID) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="manager@business.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Section 3: Feature & Sidebar Selection */}
          <section className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature & Sidebar Selection</h3>
            <p className="text-gray-600 mb-6">Select features this manager can access. Manager will only see selected menus.</p>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureList.map((feature) => (
                  <div
                    key={feature.id}
                    onClick={() => handleFeatureToggle(feature.id)}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedFeatures[feature.id]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded border flex items-center justify-center mr-3 ${
                      selectedFeatures[feature.id]
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedFeatures[feature.id] && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Login Credentials */}
          <section className="p-8">
            <div className="flex items-center mb-4">
              <Key className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Login Credentials</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-generate"
                    checked={formData.passwordMethod === 'auto'}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        passwordMethod: e.target.checked ? 'auto' : 'manual' 
                      }));
                    }}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="auto-generate" className="ml-2 text-gray-700">
                    Auto-generate password
                  </label>
                </div>
              </div>

              {formData.passwordMethod === 'auto' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Generated Password</label>
                    <button
                      type="button"
                      onClick={generatePassword}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Password'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.password}
                    readOnly
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg font-mono"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    A secure 12-character password will be generated automatically
                  </p>
                </div>
              )}

              {formData.passwordMethod === 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}
            </div>
          </section>

          {/* Security Notice */}
          <section className="p-8 bg-blue-50 border-t">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Security Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Manager will have access only to selected features. They cannot access 
                  Admin or Super Admin areas.
                </p>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="px-8 py-6 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2026 Super Admin Platform<br />
              All rights reserved
            </div>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setCurrentView('manager-management')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Manager Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManager;