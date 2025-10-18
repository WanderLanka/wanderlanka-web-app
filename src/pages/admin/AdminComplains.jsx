import React, { useState, useEffect } from "react";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const mockComplaints = [
    {
      id: "COMP-001",
      topic: "Poor Hotel Room Conditions",
      category: "accommodation",
      complaint: "The hotel room was not cleaned properly upon arrival. There were stains on the bedsheets, the bathroom was dirty, and the air conditioning was not working.",
      userEmail: "john.traveler@email.com",
      userName: "John Smith",
      submittedDate: "2025-01-22T09:30:00Z",
      status: "new",
      priority: "high",
      photos: [
        { id: 1, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", caption: "Dirty bathroom" }
      ],
      serviceProvider: "Grand Ocean Hotel",
      bookingReference: "HOT-2025-001234",
      responseRequired: true
    },
    {
      id: "COMP-002",
      topic: "Taxi Driver Unprofessional Behavior",
      category: "transport",
      complaint: "The taxi driver was rude and unprofessional throughout the journey, speaking loudly and refusing to use air conditioning.",
      userEmail: "sarah.wilson@email.com",
      userName: "Sarah Wilson",
      submittedDate: "2025-01-21T16:45:00Z",
      status: "investigating",
      priority: "medium",
      photos: [],
      serviceProvider: "City Express Taxi",
      bookingReference: "TAX-2025-005678",
      responseRequired: true
    },
    {
      id: "COMP-003",
      topic: "Tour Guide Did Not Show Up",
      category: "guide",
      complaint: "Tour guide never showed up at the meeting point. We waited for over an hour with no response.",
      userEmail: "mike.johnson@email.com",
      userName: "Mike Johnson",
      submittedDate: "2025-01-21T11:20:00Z",
      status: "resolved",
      priority: "high",
      photos: [],
      serviceProvider: "Heritage Tours Lanka",
      bookingReference: "TOUR-2025-009876",
      responseRequired: false,
      resolution: "Full refund processed and alternative tour arranged for the following day."
    },
    {
      id: "COMP-004",
      topic: "Payment Processing Error",
      category: "platform",
      complaint: "I was charged twice for the same hotel booking on my credit card.",
      userEmail: "emma.davis@email.com",
      userName: "Emma Davis",
      submittedDate: "2025-01-20T14:30:00Z",
      status: "resolved",
      priority: "urgent",
      photos: [],
      serviceProvider: "WanderLanka Platform",
      bookingReference: "PAY-2025-112233",
      responseRequired: false,
      resolution: "Duplicate charge refunded within 24 hours. System updated to prevent similar occurrences."
    }
  ];

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setComplaints(mockComplaints);
        setFilteredComplaints(mockComplaints);
        setError("");
      } catch (err) {
        setError("Failed to fetch complaints data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  useEffect(() => {
    let filtered = [...complaints];

    if (filterCategory !== "all") {
      filtered = filtered.filter(complaint => complaint.category === filterCategory);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter(complaint => complaint.status === filterStatus);
    }
    if (filterPriority !== "all") {
      filtered = filtered.filter(complaint => complaint.priority === filterPriority);
    }
    if (filterDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(complaint => {
        const complaintDate = new Date(complaint.submittedDate);
        switch (filterDate) {
          case "today":
            return complaintDate >= today;
          case "week":
            return complaintDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          case "month":
            return complaintDate >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredComplaints(filtered);
    setCurrentPage(1);
  }, [complaints, filterCategory, filterStatus, filterPriority, filterDate, searchTerm]);

  const stats = {
    totalComplaints: filteredComplaints.length,
    newComplaints: filteredComplaints.filter(c => c.status === "new").length,
    urgentComplaints: filteredComplaints.filter(c => c.priority === "urgent").length,
    resolvedComplaints: filteredComplaints.filter(c => c.status === "resolved" || c.status === "closed").length
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-700",
      investigating: "bg-amber-100 text-amber-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-slate-100 text-slate-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-slate-100 text-slate-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700"
    };
    return colors[priority] || "bg-gray-100 text-gray-700";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      accommodation: "🏨",
      transport: "🚗",
      guide: "👨‍🏫",
      platform: "💻"
    };
    return icons[category] || "📋";
  };

  const getCategoryName = (category) => {
    const names = {
      accommodation: "Accommodation",
      transport: "Transport",
      guide: "Tour Guide",
      platform: "Platform"
    };
    return names[category] || category;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-indigo-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.618fr,1fr] gap-16 items-center relative z-10">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
              Complaints Management
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
              Monitor and resolve traveler complaints to maintain service quality and customer satisfaction across all platform services.
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">{stats.totalComplaints}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Complaints</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-blue-200 mb-2 leading-none">{stats.newComplaints}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">New Complaints</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 hover:border-red-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-4xl font-extrabold text-red-200 mb-2 leading-none">{stats.urgentComplaints}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Urgent Issues</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Search</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="accommodation">Accommodation</option>
                <option value="transport">Transport</option>
                <option value="guide">Tour Guide</option>
                <option value="platform">Platform</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Priority</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Date Range</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{filteredComplaints.length}</span> complaint{filteredComplaints.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Complaints Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {currentComplaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Complaints Found</h3>
            <p className="text-slate-600">No complaints match your current filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentComplaints.map((complaint) => (
                <div 
                  key={complaint.id} 
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-150 cursor-pointer"
                  onClick={() => { setSelectedComplaint(complaint); setShowModal(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-blue-600 font-semibold">{complaint.id}</span>
                        <span className="text-lg">{getCategoryIcon(complaint.category)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{complaint.topic}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                      </span>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4">{truncateText(complaint.complaint, 120)}</p>

                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Customer</p>
                        <p className="font-medium text-slate-900">{complaint.userName}</p>
                        <p className="text-xs text-slate-500">{complaint.userEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase">Submitted</p>
                        <p className="text-sm text-slate-900 font-medium">{formatDate(complaint.submittedDate)}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <p className="text-xs text-slate-500 uppercase">Provider</p>
                      <p className="font-medium text-slate-900">{complaint.serviceProvider}</p>
                    </div>
                  </div>

                  {complaint.photos && complaint.photos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="text-xs font-semibold text-slate-900 mb-2">📷 {complaint.photos.length} photo{complaint.photos.length !== 1 ? 's' : ''}</div>
                      <div className="flex gap-2">
                        {complaint.photos.slice(0, 3).map((photo) => (
                          <div key={photo.id} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                    {complaint.responseRequired && (
                      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Response Required</span>
                    )}
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">View Details →</button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <button 
                  className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">Page {currentPage}</span> of {totalPages} | Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredComplaints.length)} of {filteredComplaints.length}
                </div>
                <button 
                  className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Complaint Details</h2>
              <button className="text-2xl text-slate-500 hover:text-slate-700" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Complaint Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-1">ID</p>
                    <p className="text-sm font-mono font-semibold text-slate-900">{selectedComplaint.id}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Category</p>
                    <p className="text-sm text-slate-900">{getCategoryIcon(selectedComplaint.category)} {getCategoryName(selectedComplaint.category)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Status</p>
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Priority</p>
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(selectedComplaint.priority)}`}>
                      {selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Topic</h3>
                <p className="text-slate-900 font-semibold text-base">{selectedComplaint.topic}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-700 leading-relaxed">{selectedComplaint.complaint}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-slate-600">Name:</span> <span className="font-semibold text-slate-900 ml-2">{selectedComplaint.userName}</span></div>
                  <div><span className="text-slate-600">Email:</span> <span className="font-semibold text-slate-900 ml-2">{selectedComplaint.userEmail}</span></div>
                  <div><span className="text-slate-600">Provider:</span> <span className="font-semibold text-slate-900 ml-2">{selectedComplaint.serviceProvider}</span></div>
                  <div><span className="text-slate-600">Booking Ref:</span> <span className="font-semibold text-slate-900 ml-2">{selectedComplaint.bookingReference}</span></div>
                </div>
              </div>

              {selectedComplaint.photos && selectedComplaint.photos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Attached Photos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedComplaint.photos.map((photo) => (
                      <div key={photo.id} className="cursor-pointer rounded-lg overflow-hidden border border-slate-200 hover:border-blue-400" onClick={() => handleImageClick(photo)}>
                        <img src={photo.url} alt={photo.caption} className="w-full h-40 object-cover" />
                        <p className="text-xs text-slate-600 p-2 bg-slate-50">{photo.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedComplaint.resolution && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Resolution</h3>
                  <p className="text-green-800 text-sm">{selectedComplaint.resolution}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={closeImageModal}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-white text-3xl hover:text-slate-300" onClick={() => setShowImageModal(false)}>×</button>
            <img src={selectedImage.url} alt={selectedImage.caption} className="w-full rounded-lg" />
            <p className="text-white text-center mt-4">{selectedImage.caption}</p>
          </div>
        </div>
      )}
    </div>
  );

  function handleImageClick(image) {
    setSelectedImage(image);
    setShowImageModal(true);
  }

  function closeImageModal() {
    setShowImageModal(false);
    setSelectedImage(null);
  }
};

export default AdminComplaints;