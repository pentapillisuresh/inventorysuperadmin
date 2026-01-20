import React, { useState, useEffect } from 'react';
import { ArrowLeft, Key, User, Building, Shield } from 'lucide-react';

const CreateManager = ({ setCurrentView }) => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    adminId: '',
    managerName: '',
    phone: '',
    email: '',
    storeId: '',
    passwordMethod: 'auto',
    password: ''
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Load admins from localStorage
    const loadedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    setAdmins(loadedAdmins);
  }, []);

  useEffect(() => {
    // When admin is selected, load their stores
    if (formData.adminId) {
      const selectedAdmin = admins.find(a => a.id === formData.adminId);
      if (selectedAdmin) {
        // For demo, create some dummy stores
        const dummyStores = [
          { id: '1', name: `${selectedAdmin.businessName} - Main Store` },
          { id: '2', name: `${selectedAdmin.businessName} - Branch 1` },
          { id: '3', name: `${selectedAdmin.businessName} - Branch 2` }
        ];
        setStores(dummyStores);
      }
    } else {
      setStores([]);
      setFormData(prev => ({ ...prev, storeId: '' }));
    }
  }, [formData.adminId, admins]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.adminId || !formData.managerName || !formData.phone || !formData.storeId) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedAdmin = admins.find(a => a.id === formData.adminId);
    if (!selectedAdmin) {
      alert('Selected admin not found');
      return;
    }

    // Create manager object
    const manager = {
      id: Date.now().toString(),
      ...formData,
      adminName: selectedAdmin.businessName,
      storeName: stores.find(s => s.id === formData.storeId)?.name || '',
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    // Save to localStorage
    const managers = JSON.parse(localStorage.getItem('managers') || '[]');
    managers.push(manager);
    localStorage.setItem('managers', JSON.stringify(managers));

    // Add to recent activity
    const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    activity.unshift({
      business: selectedAdmin.businessName,
      description: `Manager added by Super Admin: ${formData.managerName}`,
      time: "Just now",
      type: "created"
    });
    localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));

    alert('Manager account created successfully!');
    setCurrentView('dashboard');
  };

  const selectedAdmin = admins.find(a => a.id === formData.adminId);

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentView('dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">SUPER ADMIN</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Create Manager Account</h2>
        <p className="text-gray-600 mb-8">Add a manager for an existing admin business</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Select Admin */}
          <section>
            <div className="flex items-center mb-4">
              <Building className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Select Admin (Business)</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Business *
              </label>
              <select
                name="adminId"
                value={formData.adminId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select admin business</option>
                {admins.map(admin => (
                  <option key={admin.id} value={admin.id}>
                    {admin.businessName} ({admin.adminName})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Manager will be linked to this admin account
              </p>
            </div>
          </section>

          {/* Manager Details */}
          <section>
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Manager Details</h3>
            </div>
            
            <div className="space-y-6">
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
              
              <div>
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

          {/* Assign Store */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Store</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Store *
              </label>
              <select
                name="storeId"
                value={formData.storeId}
                onChange={handleInputChange}
                disabled={!formData.adminId}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                required
              >
                <option value="">
                  {!formData.adminId ? 'Please select admin first' : 'Select store'}
                </option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                One manager can be assigned to one store only
              </p>
            </div>
          </section>

          {/* Login Credentials */}
          <section>
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
          <section className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Security Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Manager will have same permissions as regular managers. They cannot access 
                  Admin or Super Admin areas. Manager will be linked to the selected admin 
                  and store only.
                </p>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
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
        </form>
      </div>
    </div>
  );
};

export default CreateManager;