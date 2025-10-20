import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, Eye, Calendar, Tag } from 'lucide-react';
import { Button } from '../../components/common';
import { toast } from 'react-toastify';

const AccommodationComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComplaints();
  }, [filter, currentPage]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view complaints');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filter !== 'all' && { status: filter })
      });

      const response = await fetch(`http://localhost:3000/api/complaints/my-complaints?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setComplaints(result.data.complaints);
        setTotalPages(result.data.pagination.totalPages);
      } else {
        toast.error(result.message || 'Failed to fetch complaints');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-700',
      investigating: 'bg-amber-100 text-amber-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-slate-100 text-slate-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      accommodation: '🏨',
      transport: '🚗',
      guide: '👨‍🏫',
      platform: '💻',
      payment: '💳',
      booking: '📅',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Complaints Management</h1>
            <p className="text-slate-600">Track and manage complaints related to your accommodation services</p>
          </div>
          <Link to="/accommodation/complaints/submit">
            <Button variant="primary" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Submit New Complaint</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-semibold text-slate-900">Filter by status:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Complaints</option>
                <option value="new">New</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Complaints Found</h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all' 
                ? "You haven't submitted any complaints yet." 
                : `No complaints found with status "${filter}".`
              }
            </p>
            <Link to="/accommodation/complaints/submit">
              <Button variant="primary" className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Submit Your First Complaint</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">{getCategoryIcon(complaint.category)}</span>
                      <h3 className="text-lg font-semibold text-slate-900">{complaint.subject}</h3>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">
                      {truncateText(complaint.complaint, 150)}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Submitted {formatDate(complaint.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span className="capitalize">{complaint.category}</span>
                      </div>
                      {complaint.complaintId && (
                        <div className="flex items-center space-x-1">
                          <span className="font-mono text-blue-600">#{complaint.complaintId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link to={`/accommodation/complaints/${complaint._id}`}>
                    <Button variant="secondary" size="sm" className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </Button>
                  </Link>
                </div>

                {complaint.serviceProvider && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Service Provider</p>
                    <p className="text-sm font-medium text-slate-900">{complaint.serviceProvider}</p>
                  </div>
                )}

                {complaint.adminResponse && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Admin Response</p>
                    <p className="text-sm text-blue-800">{complaint.adminResponse.message}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      Responded on {formatDate(complaint.adminResponse.respondedAt)}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccommodationComplaints;
