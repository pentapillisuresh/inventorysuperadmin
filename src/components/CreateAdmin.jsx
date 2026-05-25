import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Key, Calendar, Building, Upload, X, Image as ImageIcon } from 'lucide-react';
import ApiService from '../utils/ApiService';

const CreateAdmin = ({ setCurrentView, editMode = false, adminToEdit = null }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    adminName: '',
    phone: '',
    email: '',
    passwordMethod: 'auto',
    password: '',
    planType: '',
    planStartDate: '',
    planEndDate: '',
    features: {
      create_store: true,
      create_rooms: true,
      create_invoices: true,
      create_outlets: false,
      expenditure_management: true,
      create_rack: false,
      create_freezers: false
    },
    limits: {
      maxStores: 5,
    },
    amount: 0,
    profileImage: null,
    profileImagePath: '',
    businessLogo: null,
    businessLogoPath: '',
    status: 'Active',
    officeAddress: '',
    FSSAI_No: '',
    GST_No: '',
    CIN_No: ''
  });
  
  const clientToken = localStorage.getItem('token');
  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id || 1;
  
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const businessTypes = [
    'Retail Store',
    'Restaurant',
    'Salon',
    'Healthcare',
    'Education',
    'Manufacturing',
    'IT Services',
    'Other'
  ];

  const planTypes = [
    { value: 'Trial', label: 'Trial (15 days)' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' }
  ];

  const featuresList = [
    { id: 'create_store', label: 'Create Store' },
    { id: 'create_rooms', label: 'Create Rooms' },
    { id: 'create_rack', label: 'Create Rack' },
    { id: 'create_freezers', label: 'Create Freezers' },
    { id: 'create_invoices', label: 'Create Invoices' },
    { id: 'expenditure_management', label: 'Expenditure Management' },
    { id: 'create_outlets', label: 'Create Outlets' }
  ];

  // Initialize form if in edit mode
  useEffect(() => {
    if (editMode && adminToEdit) {
      console.log("adminToEdit:", adminToEdit);
      
      // Safely parse permissions
      let parsedPermissions = {};
      try {
        parsedPermissions = typeof adminToEdit.permissions === 'string' 
          ? JSON.parse(adminToEdit.permissions) 
          : (adminToEdit.permissions || {});
      } catch (error) {
        console.error('Error parsing permissions:', error);
      }

      const formattedFeatures = {};
      featuresList.forEach(feature => {
        formattedFeatures[feature.id] = parsedPermissions[feature.id] || false;
      });

      setFormData({
        businessName: adminToEdit.businessName || '',
        businessType: adminToEdit.businessType || '',
        adminName: adminToEdit.adminName || adminToEdit.name || '',
        phone: adminToEdit.phone || adminToEdit.phoneNumber || '',
        email: adminToEdit.email || '',
        passwordMethod: 'manual',
        password: '',
        planType: adminToEdit.planType || (adminToEdit.maxStores ? 'Yearly' : 'Monthly'),
        planStartDate: adminToEdit.planStartDate ? adminToEdit.planStartDate.split('T')[0] : '',
        planEndDate: adminToEdit.planEndDate ? adminToEdit.planEndDate.split('T')[0] : '',
        features: formattedFeatures,
        limits: { maxStores: adminToEdit.maxStores || 5 },
        amount: adminToEdit.amount || 0,
        profileImage: null,
        profileImagePath: adminToEdit.profileImage || adminToEdit.BusinessImage || '',
        businessLogo: null,
        businessLogoPath: adminToEdit.businessLogo || adminToEdit.BusinessLogo || '',
        status: adminToEdit.status || (adminToEdit.isActive ? 'Active' : 'Inactive'),
        officeAddress: adminToEdit.officeAddress || '',
        FSSAI_No: adminToEdit.FSSAI_No || '',
        GST_No: adminToEdit.GST_No || '',
        CIN_No: adminToEdit.CIN_No || ''
      });

      if (adminToEdit.profileImage || adminToEdit.BusinessImage) {
        setPreviewImage(adminToEdit.profileImage || adminToEdit.BusinessImage);
      }

      if (adminToEdit.businessLogo || adminToEdit.BusinessLogo) {
        setPreviewLogo(adminToEdit.businessLogo || adminToEdit.BusinessLogo);
      }
    }
  }, [editMode, adminToEdit]);

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
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureToggle = (featureId) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureId]: !prev.features[featureId]
      }
    }));
  };

  const handleLimitChange = (limitType, value) => {
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [limitType]: parseInt(value) || 0
      }
    }));
  };

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await ApiService.post('/upload/upload-Image', uploadFormData, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response || !response.imagePath) {
        throw new Error('Image upload failed');
      }

      return response.imagePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setPreviewImage(reader.result);
        } else {
          setPreviewLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Upload image to server
      const imagePath = await uploadImage(file);
      
      if (type === 'profile') {
        setFormData(prev => ({ 
          ...prev, 
          profileImage: file,
          profileImagePath: imagePath 
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          businessLogo: file,
          businessLogoPath: imagePath 
        }));
      }
    } catch (error) {
      alert('Failed to upload image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (type) => {
    if (type === 'profile') {
      setFormData(prev => ({ ...prev, profileImage: null, profileImagePath: '' }));
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setFormData(prev => ({ ...prev, businessLogo: null, businessLogoPath: '' }));
      setPreviewLogo(null);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const calculateEndDate = (startDate, planType) => {
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

  useEffect(() => {
    if (!editMode && formData.planStartDate && formData.planType) {
      const endDate = calculateEndDate(formData.planStartDate, formData.planType);
      setFormData(prev => ({ ...prev, planEndDate: endDate }));
    }
  }, [formData.planStartDate, formData.planType, editMode]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Admin name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!editMode) {
      if (!formData.planType) {
        newErrors.planType = 'Plan type is required';
      }

      if (!formData.planStartDate) {
        newErrors.planStartDate = 'Plan start date is required';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUserAPI = async (userData) => {
    try {
      const response = await ApiService.post('/users/createUser', userData, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error in createUserAPI:', error);
      throw error;
    }
  };

  const updateUserAPI = async (userData) => {
    try {
      const response = await ApiService.put(`/users/admins/${adminToEdit.id}`, userData, {
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error in updateUserAPI:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare permissions object from features
      const permissions = {
        create_store: formData.features.create_store || false,
        create_rooms: formData.features.create_rooms || false,
        create_rack: formData.features.create_rack || false,
        create_freezers: formData.features.create_freezers || false,
        create_invoices: formData.features.create_invoices || false,
        expenditure_management: formData.features.expenditure_management || false,
        create_outlets: formData.features.create_outlets || false
      };

      // Base user data object
      const userData = {
        name: formData.adminName,
        email: formData.email || `${formData.phone}@temp.com`,
        phoneNumber: formData.phone,
        role: "admin",
        maxStores: formData.limits.maxStores || 1,
        permissions: permissions,
        BusinessImage: formData.profileImagePath || '',
        BusinessLogo: formData.businessLogoPath || '',
        businessType: formData.businessType || null,
        officeAddress: formData.officeAddress || '',
        FSSAI_No: formData.FSSAI_No || '',
        GST_No: formData.GST_No || '',
        CIN_No: formData.CIN_No || ''
      };

      // Add plan fields only for new admin creation
      if (!editMode) {
        userData.planType = formData.planType;
        userData.startDate = formData.planStartDate ? new Date(formData.planStartDate).toISOString() : null;
        userData.expiryDate = formData.planEndDate ? new Date(formData.planEndDate).toISOString() : null;
        userData.password = formData.password;
        userData.amount = parseFloat(formData.amount) || 0;
        userData.createdBy = currentUserId;
      } else {
        // For edit mode, include status and other updatable fields
        userData.status = formData.status;
        userData.businessName = formData.businessName;
      }

      let result;
      
      // Call the appropriate API
      if (editMode) {
        result = await updateUserAPI(userData);
      } else {
        result = await createUserAPI(userData);
      }

      // Add to recent activity
      const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
      activity.unshift({
        business: formData.businessName,
        description: editMode ? "Admin account updated" : "New admin account created",
        time: new Date().toLocaleString(),
        type: editMode ? "updated" : "created"
      });
      localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));

      alert(`Admin account ${editMode ? 'updated' : 'created'} successfully!`);
      setCurrentView('admin-management');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Failed to ${editMode ? 'update' : 'create'} admin account: ${error.response?.data?.message || error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => setCurrentView('admin-management')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Admin Management
      </button>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {editMode ? 'Edit Admin Account' : 'Create New Admin Account'}
        </h1>
        <p className="text-gray-600 mb-8">
          {editMode ? 'Update existing business account details' : 'Onboard a new business to the platform'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Profile Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  {previewImage ? (
                    <div className="relative inline-block">
                      <img 
                        src={previewImage} 
                        alt="Profile Preview" 
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-3"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('profile')}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Click to upload profile image</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    className="hidden"
                    id="profileImage"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="profileImage"
                    className={`mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>
              </div>

              {/* Business Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                  {previewLogo ? (
                    <div className="relative inline-block">
                      <img 
                        src={previewLogo} 
                        alt="Logo Preview" 
                        className="w-32 h-32 object-contain mx-auto mb-3"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('logo')}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Click to upload business logo</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    id="businessLogo"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="businessLogo"
                    className={`mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Logo'}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div>
            <div className="flex items-center mb-4">
              <Building className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="e.g., IceCool Pvt Ltd"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.businessName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address and Registration Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Address
                </label>
                <input
                  type="text"
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleInputChange}
                  placeholder="Full office address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FSSAI Number
                </label>
                <input
                  type="text"
                  name="FSSAI_No"
                  value={formData.FSSAI_No}
                  onChange={handleInputChange}
                  placeholder="FSSAI registration number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  name="GST_No"
                  value={formData.GST_No}
                  onChange={handleInputChange}
                  placeholder="GST identification number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CIN Number
                </label>
                <input
                  type="text"
                  name="CIN_No"
                  value={formData.CIN_No}
                  onChange={handleInputChange}
                  placeholder="Company Identification Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Admin User Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin User Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.adminName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.adminName && (
                  <p className="mt-1 text-sm text-red-500">{errors.adminName}</p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
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
                  placeholder="admin@business.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Status Field (only in edit mode) */}
              {editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Login Credentials - Only for Create Mode */}
          {!editMode && (
            <div>
              <div className="flex items-center mb-4">
                <Key className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Login Credentials</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="auto-generate"
                      name="passwordMethod"
                      value="auto"
                      checked={formData.passwordMethod === 'auto'}
                      onChange={() => setFormData(prev => ({ ...prev, passwordMethod: 'auto' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="auto-generate" className="ml-2 text-gray-700">
                      Auto-generate password
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="manual-password"
                      name="passwordMethod"
                      value="manual"
                      checked={formData.passwordMethod === 'manual'}
                      onChange={() => setFormData(prev => ({ ...prev, passwordMethod: 'manual' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="manual-password" className="ml-2 text-gray-700">
                      Set password manually
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
                        disabled={isGenerating || isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subscription Plan - Only for Create Mode */}
          {!editMode && (
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Subscription Plan</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type *
                  </label>
                  <select
                    name="planType"
                    value={formData.planType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.planType ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select plan</option>
                    {planTypes.map(plan => (
                      <option key={plan.value} value={plan.value}>{plan.label}</option>
                    ))}
                  </select>
                  {errors.planType && (
                    <p className="mt-1 text-sm text-red-500">{errors.planType}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Start Date *
                  </label>
                  <input
                    type="date"
                    name="planStartDate"
                    value={formData.planStartDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.planStartDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.planStartDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.planStartDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan End Date
                  </label>
                  <input
                    type="date"
                    value={formData.planEndDate}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Usage Limits */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage Limits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Stores
                </label>
                <input
                  type="number"
                  value={formData.limits.maxStores}
                  onChange={(e) => handleLimitChange('maxStores', e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Feature Selection */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Feature & Sidebar Selection
            </h2>
            <p className="text-gray-600 mb-4">
              Select features this admin can access. Admin will only see selected menus.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuresList.map(feature => (
                <div key={feature.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id={feature.id}
                    checked={formData.features[feature.id] || false}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={feature.id} className="ml-2 text-gray-700 cursor-pointer">
                    {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Field - Only for Create Mode */}
          {!editMode && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amount</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setCurrentView('admin-management')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : (editMode ? 'Update Admin Account' : 'Create Admin Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;