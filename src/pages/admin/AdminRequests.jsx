import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import config from "../../config/config.js";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await adminAPI.requests();
      // Handle different response formats
      // API may return an array OR an object with numeric keys (e.g. {"0": {...}, "1": {...}, "message":"..."})
      const raw = result?.data ?? result;

      let requestsArray = [];
      if (Array.isArray(raw)) {
        requestsArray = raw;
      } else if (raw && typeof raw === 'object') {
        // If it's an object with numeric keys, extract the object values that look like requests
        const values = Object.values(raw).filter(v => v && typeof v === 'object' && (v._id || v.username || v.email));
        if (values.length) requestsArray = values;
        // If there's a nested 'requests' array, prefer that
        else if (Array.isArray(raw.requests)) requestsArray = raw.requests;
      }

      setRequests(requestsArray);
      // If API provided a message and there are no request items, surface it as info
      if ((!requestsArray || requestsArray.length === 0) && raw && raw.message) {
        setError(raw.message);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
      setError(err.response?.data?.message || "Failed to load requests. Please try again.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesRole = filterRole === "all" || request.role === filterRole;
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate !== "all") {
      const requestDate = new Date(request.createdAt || request.submittedDate);
      const now = new Date();
      const daysDiff = Math.floor((now - requestDate) / (1000 * 60 * 60 * 24));
      
      if (filterDate === "today") matchesDate = daysDiff === 0;
      else if (filterDate === "week") matchesDate = daysDiff <= 7;
      else if (filterDate === "month") matchesDate = daysDiff <= 30;
    }
    
    return matchesRole && matchesStatus && matchesDate;
  });

  // Calculate statistics
  const stats = {
    totalRequests: filteredRequests.length,
    pendingRequests: filteredRequests.filter(r => r.status === "pending").length,
    approvedRequests: filteredRequests.filter(r => r.status === "approved").length,
    rejectedRequests: filteredRequests.filter(r => r.status === "rejected").length
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
      approved: "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800",
      rejected: "px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
    };
    return badges[status] || "px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (role) => {
    const icons = {
      accommodation: "🏨",
      transport: "🚗",
      guide: "👨‍🏫"
    };
    return icons[role] || "💼";
  };

  const getRoleName = (role) => {
    const names = {
      accommodation: "Accommodation Provider",
      transport: "Transport Provider",
      guide: "Tour Guide"
    };
    return names[role] || role;
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleAction = async (requestId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) {
      return;
    }

    setActionLoading(true);
    try {
      // Call API to approve/reject
      await adminAPI.updateRequestStatus(requestId, action);
      
      // Refresh requests
      await fetchRequests();
      
      closeModal();
      alert(`Request has been ${action} successfully!`);
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      alert(err.response?.data?.message || `Failed to ${action} request. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-gray-600">Loading access requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Requests</h1>
        <p className="text-gray-600">
          Manage and review access requests from accommodation providers, transport services, and tour guides
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedRequests}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejectedRequests}</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provider Type</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Providers</option>
              <option value="accommodation">Hotels & Accommodations</option>
              <option value="transport">Transport Services</option>
              <option value="guide">Tour Guides</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={fetchRequests}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {currentRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Access Requests Found</h3>
            <p className="text-gray-600">No access requests match your current filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRequests.map((request) => (
                    <tr key={request._id || request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request._id?.slice(-8) || request.id}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.username}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getRoleIcon(request.role)}</span>
                          <span className="text-sm text-gray-900">{getRoleName(request.role)}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(request.status)}>
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt || request.submittedDate)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button 
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            onClick={() => handleRequestClick(request)}
                          >
                            View
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button 
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                onClick={() => handleAction(request._id || request.id, 'approved')}
                                disabled={actionLoading}
                              >
                                Approve
                              </button>
                              <button 
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                onClick={() => handleAction(request._id || request.id, 'rejected')}
                                disabled={actionLoading}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button 
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                  <button 
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastItem, filteredRequests.length)}</span> of{' '}
                      <span className="font-medium">{filteredRequests.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button 
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        Previous
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
              <button className="text-gray-400 hover:text-gray-600 text-3xl" onClick={closeModal}>×</button>
            </div>
            
            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Request ID:</span>
                    <p className="font-medium">{selectedRequest._id?.slice(-8) || selectedRequest.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p><span className={getStatusBadge(selectedRequest.status)}>
                      {selectedRequest.status?.charAt(0).toUpperCase() + selectedRequest.status?.slice(1)}
                    </span></p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Provider Type:</span>
                    <p className="font-medium">{getRoleIcon(selectedRequest.role)} {getRoleName(selectedRequest.role)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Submitted Date:</span>
                    <p className="font-medium">{formatDate(selectedRequest.createdAt || selectedRequest.submittedDate)}</p>
                  </div>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Username:</span>
                    <p className="font-medium">{selectedRequest.username}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Platform:</span>
                    <p className="font-medium">{selectedRequest.platform}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email Verified:</span>
                    <p className="font-medium">{selectedRequest.emailVerified ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Document */}
              {selectedRequest.document && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Attached Document</h3>
                  <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">📄</span>
                      <div>
                        <p className="font-medium text-gray-900">Document</p>
                        <p className="text-sm text-gray-600">{selectedRequest.document}</p>
                      </div>
                    </div>
                    <a 
                      href={`${config.API_BASE_URL.replace(/\/$/, '')}/auth/requests/${selectedRequest._id || selectedRequest.id}/document`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {selectedRequest.status === 'pending' && (
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button 
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={() => handleAction(selectedRequest._id || selectedRequest.id, 'rejected')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Reject Request'}
                </button>
                <button 
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  onClick={() => handleAction(selectedRequest._id || selectedRequest.id, 'approved')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Approve Request'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;