import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, User, Building, Clock } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load logs from localStorage
    const activity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    const adminLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
    const allLogs = [...activity.map(item => ({
      id: `activity-${item.time}`,
      type: 'activity',
      ...item
    })), ...adminLogs];
    
    setLogs(allLogs.sort((a, b) => new Date(b.timestamp || b.time) - new Date(a.timestamp || a.time)));
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.type !== filter) return false;
    if (searchTerm && !log.business?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !log.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getLogIcon = (type) => {
    switch(type) {
      case 'created':
        return <div className="p-2 bg-green-100 rounded-lg"><User className="h-4 w-4 text-green-600" /></div>;
      case 'renewed':
        return <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="h-4 w-4 text-blue-600" /></div>;
      case 'warning':
        return <div className="p-2 bg-amber-100 rounded-lg"><Clock className="h-4 w-4 text-amber-600" /></div>;
      default:
        return <div className="p-2 bg-gray-100 rounded-lg"><Building className="h-4 w-4 text-gray-600" /></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Track all activities and changes in the system</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </button>
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
                placeholder="Search logs by business or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Activities</option>
              <option value="created">Account Created</option>
              <option value="renewed">Plan Renewed</option>
              <option value="warning">Warnings</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log, index) => (
                <tr key={log.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="mt-1">
                        {getLogIcon(log.type)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{log.description}</div>
                        <div className="text-sm text-gray-500 mt-1">{log.details}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{log.business || 'System'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.type === 'created' ? 'bg-green-100 text-green-800' :
                      log.type === 'renewed' ? 'bg-blue-100 text-blue-800' :
                      log.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.type || 'activity'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.performedBy || 'Super Admin'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500">No audit logs found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;