import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Eye, Filter, Download, Lock, LockOpen, UserPlus, Building } from 'lucide-react';
import AdminDetailsPopup from './AdminDetailsPopup';
import ApiService from '../utils/ApiService';

const AdminManagement = ({ setCurrentView }) => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [adminToBlock, setAdminToBlock] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const clientToken = localStorage.getItem('token');
  useEffect(() => {
    loadAdmins();
  }, []);

  useEffect(() => {
    filterAdmins();
  }, [searchTerm, admins, statusFilter]);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get('/users/admins',{
        headers: {
          Authorization: `Bearer ${clientToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response) {
        throw new Error('Failed to fetch admins');
      }
            
      // Transform API data to match the component's expected format
      const transformedAdmins = response.map(admin => ({
        id: admin.id,
        businessName: admin.name || 'Business Name',
        adminName: admin.name,
        businessType: 'Business', // Default value as API doesn't provide this
        businessLogo: admin.BusinessLogo || '',
        profileImage: admin.BusinessImage || '',
        phone: admin.phoneNumber,
        email: admin.email,
        planType: admin.maxStores ? 'Yearly' : 'Monthly', // Determine plan type based on maxStores
        planStartDate: formatDate(admin.createdAt),
        planEndDate: formatDate(admin.expiryDate),
        daysRemaining: calculateDaysRemaining(admin.expiryDate),
        status: admin.isActive ? 'Active' : 'Inactive',
        permissions: admin.permissions,
        maxStores: admin.maxStores,
        maxOutlet: admin.maxOutlet
      }));
      
      setAdmins(transformedAdmins);
      setError(null);
    } catch (err) {
      console.error('Error loading admins:', err);
      setError('Failed to load admin data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to calculate days remaining until expiry
  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filterAdmins = () => {
    let filtered = [...admins];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(admin => admin.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(admin =>
        admin.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (admin.phone && admin.phone.includes(searchTerm))
      );
    }

    setFilteredAdmins(filtered);
  };

  const handleViewDetails = (admin) => {
    setSelectedAdmin(admin);
    setShowPopup(true);
  };

  const handleEdit = (admin) => {
    // Navigate to CreateAdmin in edit mode
    setCurrentView({
      view: 'create-admin',
      editMode: true,
      adminToEdit: admin
    });
  };

  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteConfirm(true);
  };

  const handleBlockUnblock = (admin) => {
    setAdminToBlock(admin);
    setShowBlockConfirm(true);
  };

  const confirmDelete = async () => {
    if (adminToDelete) {
      try {
        const response = await fetch(`http://localhost:5001/api/users/${adminToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete admin');
        }

        // Update recent activity in localStorage (keeping this as it's UI-related)
        const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        activity.unshift({
          business: adminToDelete.businessName,
          description: "Admin account deleted",
          time: "Just now",
          type: "warning"
        });
        localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));
        
        // Reload admins from API
        await loadAdmins();
        setShowDeleteConfirm(false);
        setAdminToDelete(null);
      } catch (err) {
        console.error('Error deleting admin:', err);
        alert('Failed to delete admin. Please try again.');
      }
    }
  };

  const confirmBlockUnblock = async () => {
    if (adminToBlock) {
      try {
        const newStatus = !adminToBlock.isActive;
        
        const response = await ApiService.delete(`/users/${adminToBlock.id}/${false}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response) {
          throw new Error('Failed to update admin status');
        }

        // Add to recent activity
        const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
        activity.unshift({
          business: adminToBlock.businessName,
          description: `Admin account ${newStatus ? 'unblocked' : 'blocked'}`,
          time: "Just now",
          type: newStatus ? 'updated' : 'warning'
        });
        localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));
        
        // Reload admins from API
        await loadAdmins();
        setShowBlockConfirm(false);
        setAdminToBlock(null);
      } catch (err) {
        console.error('Error updating admin status:', err);
        alert('Failed to update admin status. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      case 'Expired': return 'bg-amber-100 text-amber-800';
      case 'Suspended': return 'bg-orange-100 text-orange-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return '🟢';
      case 'Blocked': return '🔴';
      case 'Expired': return '🟡';
      case 'Suspended': return '🟠';
      case 'Inactive': return '⚫';
      default: return '⚪';
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(admins, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'admins-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const stats = {
    total: admins.length,
    active: admins.filter(a => a.status === 'Active').length,
    blocked: admins.filter(a => a.status === 'Blocked').length,
    expiring: admins.filter(a => a.daysRemaining && a.daysRemaining <= 7 && a.status === 'Active').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading admins...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SUPER ADMIN</h1>
          <p className="text-gray-600 mt-1">Plan Monitoring & Management</p>
          <p className="text-gray-500 text-sm">Monitor subscription plans and manage admin accounts</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setCurrentView('create-admin')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Create Admin</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-3">
              <span className="text-blue-600 font-bold">{stats.total}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-3">
              <span className="text-green-600 font-bold">{stats.active}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-3">
              <span className="text-red-600 font-bold">{stats.blocked}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.blocked}</p>
              <p className="text-sm text-gray-600">Blocked</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg mr-3">
              <span className="text-amber-600 font-bold">{stats.expiring}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.expiring}</p>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by business name, admin name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Admin Accounts</h2>
          <p className="text-sm text-gray-600 mt-1">{filteredAdmins.length} accounts found</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BUSINESS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ADMIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PLAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  START DATE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  END DATE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {admin.businessLogo ? (
                        <img 
                          src={admin.businessLogo} 
                          alt={admin.businessName}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{admin.businessName}</div>
                        <div className="text-sm text-gray-500">{admin.businessType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {admin.profileImage ? (
                        <img 
                          src={admin.profileImage} 
                          alt={admin.adminName}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="font-medium text-gray-600">
                            {admin.adminName?.charAt(0) || 'A'}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{admin.adminName}</div>
                        <div className="text-sm text-gray-500">{admin.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      admin.planType === 'Yearly' ? 'bg-blue-100 text-blue-800' :
                      admin.planType === 'Monthly' ? 'bg-green-100 text-green-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {admin.planType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {admin.planStartDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{admin.planEndDate}</div>
                    {admin.daysRemaining && (
                      <div className={`text-xs ${admin.daysRemaining <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
                        {admin.daysRemaining} days remaining
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2">{getStatusIcon(admin.status)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                        {admin.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(admin)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleBlockUnblock(admin)}
                        className={admin.status === 'Blocked' ? "text-green-600 hover:text-green-900 p-1" : "text-red-600 hover:text-red-900 p-1"}
                        title={admin.status === 'Blocked' ? "Unblock" : "Block"}
                      >
                        {admin.status === 'Blocked' ? (
                          <LockOpen className="h-5 w-5" />
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                      </button>
                      {/* <button
                        onClick={() => handleDelete(admin)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No admin accounts found</div>
            <button
              onClick={() => setCurrentView('create-admin')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first admin account
            </button>
          </div>
        )}
      </div>

      {/* Admin Details Popup */}
      {showPopup && selectedAdmin && (
        <AdminDetailsPopup
          admin={selectedAdmin}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the admin account for <strong>{adminToDelete?.businessName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block/Unblock Confirmation Modal */}
      {showBlockConfirm && adminToBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {adminToBlock.status === 'Blocked' ? 'Unblock Account' : 'Block Account'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to {adminToBlock.status === 'Blocked' ? 'unblock' : 'block'} the admin account for <strong>{adminToBlock.businessName}</strong>?
              {adminToBlock.status !== 'Blocked' && ' The admin will lose access to the system.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlockUnblock}
                className={`px-4 py-2 rounded-lg text-white ${
                  adminToBlock.status === 'Blocked' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {adminToBlock.status === 'Blocked' ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;