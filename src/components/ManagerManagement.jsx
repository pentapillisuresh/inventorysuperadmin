import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, User, Phone, Mail, Building, Calendar, Shield } from 'lucide-react';
import ManagerDetailsPopup from './ManagerDetailsPopup';

const ManagerManagement = () => {
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState(null);
  const [filterAdmin, setFilterAdmin] = useState('all');

  useEffect(() => {
    loadManagers();
  }, []);

  useEffect(() => {
    filterManagers();
  }, [searchTerm, managers, filterAdmin]);

  const loadManagers = () => {
    const storedManagers = JSON.parse(localStorage.getItem('managers') || '[]');
    const storedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // Enrich manager data with admin info
    const enrichedManagers = storedManagers.map(manager => {
      const admin = storedAdmins.find(a => a.id === manager.adminId);
      return {
        ...manager,
        adminBusiness: admin?.businessName || 'Unknown',
        adminPlan: admin?.planType || 'Unknown'
      };
    });
    
    setManagers(enrichedManagers);
  };

  const filterManagers = () => {
    let filtered = [...managers];

    if (filterAdmin !== 'all') {
      filtered = filtered.filter(manager => manager.adminId === filterAdmin);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(manager =>
        manager.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.adminBusiness.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.phone.includes(searchTerm) ||
        manager.storeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredManagers(filtered);
  };

  const handleViewDetails = (manager) => {
    setSelectedManager(manager);
    setShowPopup(true);
  };

  const handleEdit = (manager) => {
    alert(`Edit functionality for ${manager.managerName} coming soon!`);
  };

  const handleDelete = (manager) => {
    setManagerToDelete(manager);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (managerToDelete) {
      const updatedManagers = managers.filter(m => m.id !== managerToDelete.id);
      localStorage.setItem('managers', JSON.stringify(updatedManagers));
      
      // Update recent activity
      const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
      activity.unshift({
        business: managerToDelete.adminBusiness,
        description: `Manager deleted: ${managerToDelete.managerName}`,
        time: "Just now",
        type: "warning"
      });
      localStorage.setItem('recentActivity', JSON.stringify(activity.slice(0, 20)));
      
      loadManagers();
      setShowDeleteConfirm(false);
      setManagerToDelete(null);
    }
  };

  const getAdminsList = () => {
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    return admins;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Safe ID display function
  const getDisplayId = (id) => {
    if (!id) return 'N/A';
    const idStr = String(id);
    return idStr.slice(0, 8);
  };

  // Safe date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Safe time formatting
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manager Management</h1>
          <p className="text-gray-600 mt-1">Manage all business managers across the platform</p>
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
                placeholder="Search by manager name, business, phone, or store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter by Admin */}
          <div className="flex items-center space-x-4">
            <Building className="h-5 w-5 text-gray-500" />
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Businesses</option>
              {getAdminsList().map(admin => (
                <option key={admin.id} value={admin.id}>
                  {admin.businessName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{managers.length}</p>
              <p className="text-sm text-gray-600">Total Managers</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {managers.filter(m => m.status === 'Active').length}
              </p>
              <p className="text-sm text-gray-600">Active Managers</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-amber-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(managers.map(m => m.adminBusiness)).size}
              </p>
              <p className="text-sm text-gray-600">Businesses</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {managers.filter(m => {
                  try {
                    const createdAt = new Date(m.createdAt);
                    return !isNaN(createdAt.getTime()) && 
                           createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  } catch {
                    return false;
                  }
                }).length}
              </p>
              <p className="text-sm text-gray-600">New This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Managers Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">All Managers</h2>
          <p className="text-sm text-gray-600 mt-1">{filteredManagers.length} managers found</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredManagers.map((manager) => (
                <tr key={manager.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{manager.managerName}</div>
                        <div className="text-sm text-gray-500">ID: {getDisplayId(manager.id)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{manager.adminBusiness}</div>
                    <div className="text-sm text-gray-500">{manager.adminPlan} Plan</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{manager.storeName}</div>
                    <div className="text-sm text-gray-500">Store ID: {getDisplayId(manager.storeId)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {manager.phone || 'N/A'}
                    </div>
                    {manager.email && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {manager.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(manager.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(manager.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(manager.status)}`}>
                      {manager.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(manager)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(manager)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(manager)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredManagers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500">No managers found</div>
            {filterAdmin !== 'all' && (
              <p className="text-sm text-gray-400 mt-2">
                Try changing your filters or create a new manager
              </p>
            )}
          </div>
        )}
      </div>

      {/* Manager Details Popup */}
      {showPopup && selectedManager && (
        <ManagerDetailsPopup
          manager={selectedManager}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete manager <strong>{managerToDelete?.managerName}</strong>? 
              This action cannot be undone.
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
                Delete Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerManagement;