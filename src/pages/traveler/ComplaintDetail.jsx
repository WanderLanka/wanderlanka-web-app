import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, User, Mail, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/common';
import { toast } from 'react-toastify';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view complaint details');
        navigate('/auth');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/complaints/my-complaints/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setComplaint(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch complaint details');
        navigate('/user/complaints');
      }
    } catch (error) {
      console.error('Error fetching complaint:', error);
      toast.error('Failed to fetch complaint details');
      navigate('/user/complaints');
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Complaint Not Found</h3>
          <p className="text-slate-600 mb-6">The complaint you're looking for doesn't exist or you don't have access to it.</p>
          <Button variant="primary" onClick={() => navigate('/user/complaints')}>
            Back to Complaints
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="secondary"
            onClick={() => navigate('/user/complaints')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Complaints</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">Complaint Details</h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* Complaint Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getCategoryIcon(complaint.category)}</span>
                  <h2 className="text-2xl font-bold text-slate-900">{complaint.subject}</h2>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                  {complaint.complaintId && (
                    <span className="text-sm font-mono text-slate-500">#{complaint.complaintId}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Submitted:</span>
                  <span className="text-sm font-medium text-slate-900">{formatDate(complaint.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">Category:</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">{complaint.category}</span>
                </div>
                {complaint.serviceProvider && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Service Provider:</span>
                    <span className="text-sm font-medium text-slate-900">{complaint.serviceProvider}</span>
                  </div>
                )}
                {complaint.bookingReference && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Booking Reference:</span>
                    <span className="text-sm font-medium text-slate-900">{complaint.bookingReference}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{complaint.complaint}</p>
            </div>
          </div>

          {/* Photos */}
          {complaint.photos && complaint.photos.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Attached Photos ({complaint.photos.length})</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {complaint.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(photo)}
                    />
                    {photo.caption && (
                      <p className="text-xs text-slate-600 mt-2">{photo.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Response */}
          {complaint.adminResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Admin Response</h3>
              <p className="text-blue-800 leading-relaxed mb-4">{complaint.adminResponse.message}</p>
              <div className="text-sm text-blue-600">
                <p>Responded on {formatDate(complaint.adminResponse.respondedAt)}</p>
              </div>
            </div>
          )}

          {/* Resolution */}
          {complaint.resolution && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Resolution</h3>
              <p className="text-green-800 leading-relaxed mb-4">{complaint.resolution}</p>
              {complaint.resolvedAt && (
                <div className="text-sm text-green-600">
                  <p>Resolved on {formatDate(complaint.resolvedAt)}</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Need Further Assistance?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Customer Service</p>
                <p className="text-slate-900 font-medium">+94 11 234 5678</p>
                <p className="text-slate-900 font-medium">support@wanderlanka.com</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Response Time</p>
                <p className="text-slate-900 font-medium">24-48 hours</p>
                <p className="text-slate-900 font-medium">Monday - Friday</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white text-3xl hover:text-slate-300 z-10"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || 'Complaint photo'}
              className="w-full rounded-lg"
            />
            {selectedImage.caption && (
              <p className="text-white text-center mt-4">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
