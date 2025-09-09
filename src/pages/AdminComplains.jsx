import React, { useState, useEffect } from "react";
import "../styles/AdminComplains.css";

const AdminComplains = () => {
  // State management
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Filter states
  const [filterCategory, setFilterCategory] = useState("all"); // all, accommodation, transport, guide, platform
  const [filterStatus, setFilterStatus] = useState("all"); // all, new, investigating, resolved, closed
  const [filterPriority, setFilterPriority] = useState("all"); // all, low, medium, high, urgent
  const [filterDate, setFilterDate] = useState("all"); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Mock complaints data - replace with actual API call
  const mockComplaints = [
    {
      id: "COMP-001",
      topic: "Poor Hotel Room Conditions",
      category: "accommodation",
      complaint: "The hotel room was not cleaned properly upon arrival. There were stains on the bedsheets, the bathroom was dirty, and the air conditioning was not working. Despite multiple calls to the front desk, no action was taken to resolve these issues during our 3-day stay.",
      userEmail: "john.traveler@email.com",
      userName: "John Smith",
      submittedDate: "2025-01-22T09:30:00Z",
      status: "new",
      priority: "high",
      photos: [
        { id: 1, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800", caption: "Dirty bathroom conditions" },
        { id: 2, url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800", caption: "Stained bedsheets" },
        { id: 3, url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", caption: "Broken air conditioning unit" }
      ],
      serviceProvider: "Grand Ocean Hotel",
      bookingReference: "HOT-2025-001234",
      responseRequired: true
    },
    {
      id: "COMP-002",
      topic: "Taxi Driver Unprofessional Behavior",
      category: "transport",
      complaint: "The taxi driver was extremely rude and unprofessional. He was speaking loudly on his phone throughout the journey, driving recklessly, and refused to use the air conditioning despite the hot weather. He also took a longer route to increase the fare.",
      userEmail: "sarah.wilson@email.com",
      userName: "Sarah Wilson",
      submittedDate: "2025-01-21T16:45:00Z",
      status: "investigating",
      priority: "medium",
      photos: [
        { id: 4, url: "https://images.unsplash.com/photo-1572195036190-86c78466e0e1?w=800", caption: "Taxi with incorrect route taken" }
      ],
      serviceProvider: "City Express Taxi",
      bookingReference: "TAX-2025-005678",
      responseRequired: true
    },
    {
      id: "COMP-003",
      topic: "Tour Guide Did Not Show Up",
      category: "guide",
      complaint: "We had booked a cultural heritage tour for 10 AM today, but the tour guide never showed up at the meeting point. We waited for over an hour and tried calling the provided number multiple times, but no one answered. This ruined our entire day's itinerary.",
      userEmail: "mike.johnson@email.com",
      userName: "Mike Johnson",
      submittedDate: "2025-01-21T11:20:00Z",
      status: "resolved",
      priority: "high",
      photos: [
        { id: 5, url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800", caption: "Empty meeting point where guide should have been" }
      ],
      serviceProvider: "Heritage Tours Lanka",
      bookingReference: "TOUR-2025-009876",
      responseRequired: false,
      resolution: "Full refund processed and alternative tour arranged for the following day."
    },
    {
      id: "COMP-004",
      topic: "Payment Processing Error",
      category: "platform",
      complaint: "I was charged twice for the same hotel booking. The first payment went through successfully, but then I received another charge on my credit card for the exact same amount. I have bank statements showing both transactions.",
      userEmail: "emma.davis@email.com",
      userName: "Emma Davis",
      submittedDate: "2025-01-20T14:30:00Z",
      status: "resolved",
      priority: "urgent",
      photos: [
        { id: 6, url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800", caption: "Bank statement showing duplicate charges" },
        { id: 7, url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", caption: "Email confirmation of original booking" }
      ],
      serviceProvider: "WanderLanka Platform",
      bookingReference: "PAY-2025-112233",
      responseRequired: false,
      resolution: "Duplicate charge identified and refunded within 24 hours. System updated to prevent similar occurrences."
    },
    {
      id: "COMP-005",
      topic: "Unsafe Vehicle Condition",
      category: "transport",
      complaint: "The vehicle provided for our airport transfer was in poor condition. The seatbelts were broken, there were visible damages to the exterior, and the driver mentioned the brakes were making strange noises. We felt unsafe throughout the journey.",
      userEmail: "alex.brown@email.com",
      userName: "Alex Brown",
      submittedDate: "2025-01-19T08:15:00Z",
      status: "investigating",
      priority: "urgent",
      photos: [
        { id: 8, url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", caption: "Broken seatbelt mechanism" },
        { id: 9, url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", caption: "Vehicle exterior damage" },
        { id: 10, url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800", caption: "Dashboard warning lights" }
      ],
      serviceProvider: "Airport Express Transport",
      bookingReference: "TRANS-2025-445566",
      responseRequired: true
    },
    {
      id: "COMP-006",
      topic: "Misleading Accommodation Photos",
      category: "accommodation",
      complaint: "The photos on the booking platform were completely misleading. The actual room was much smaller, the view was blocked by another building, and the facilities shown in the photos were not available. This was clearly false advertising.",
      userEmail: "lisa.garcia@email.com",
      userName: "Lisa Garcia",
      submittedDate: "2025-01-18T19:45:00Z",
      status: "new",
      priority: "medium",
      photos: [
        { id: 11, url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800", caption: "Actual small room vs advertised photos" },
        { id: 12, url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", caption: "Blocked view from window" }
      ],
      serviceProvider: "Paradise Beach Resort",
      bookingReference: "HOT-2025-778899",
      responseRequired: true
    },
    {
      id: "COMP-007",
      topic: "Platform App Malfunction",
      category: "platform",
      complaint: "The mobile app crashed multiple times during booking process, causing me to lose my progress and preferred room selection. Eventually had to complete booking on desktop, but lost the mobile-exclusive discount that was advertised.",
      userEmail: "david.wilson@email.com",
      userName: "David Wilson",
      submittedDate: "2025-01-17T12:00:00Z",
      status: "closed",
      priority: "low",
      photos: [
        { id: 13, url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800", caption: "App error screen screenshot" }
      ],
      serviceProvider: "WanderLanka Platform",
      bookingReference: "APP-2025-334455",
      responseRequired: false,
      resolution: "Mobile app bug fixed in latest update. Customer compensated with additional discount voucher."
    },
    {
      id: "COMP-008",
      topic: "Guide Provided Incorrect Information",
      category: "guide",
      complaint: "Our city tour guide provided completely incorrect historical information about several monuments and temples. When we fact-checked later, most of what he told us was wrong. This was supposed to be an educational tour.",
      userEmail: "maria.rodriguez@email.com",
      userName: "Maria Rodriguez",
      submittedDate: "2025-01-16T15:30:00Z",
      status: "investigating",
      priority: "medium",
      photos: [],
      serviceProvider: "Cultural Discovery Tours",
      bookingReference: "TOUR-2025-667788",
      responseRequired: true
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        // Simulate API delay
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

  // Filter complaints
  useEffect(() => {
    let filtered = [...complaints];

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter(complaint => complaint.category === filterCategory);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(complaint => complaint.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter(complaint => complaint.priority === filterPriority);
    }

    // Filter by date
    if (filterDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(complaint => {
        const complaintDate = new Date(complaint.submittedDate);
        
        switch (filterDate) {
          case "today":
            return complaintDate >= today;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return complaintDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return complaintDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Search filter
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

  // Calculate statistics
  const stats = {
    totalComplaints: filteredComplaints.length,
    newComplaints: filteredComplaints.filter(c => c.status === "new").length,
    urgentComplaints: filteredComplaints.filter(c => c.priority === "urgent").length,
    resolvedComplaints: filteredComplaints.filter(c => c.status === "resolved" || c.status === "closed").length
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  // Helper functions
  const formatDate = (dateString) => {
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
      new: "status-badge status-badge--new",
      investigating: "status-badge status-badge--warning",
      resolved: "status-badge status-badge--success",
      closed: "status-badge status-badge--neutral"
    };
    return badges[status] || "status-badge";
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: "priority-badge priority-badge--low",
      medium: "priority-badge priority-badge--medium",
      high: "priority-badge priority-badge--high",
      urgent: "priority-badge priority-badge--urgent"
    };
    return badges[priority] || "priority-badge";
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

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="complaints-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading complaints...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="complaints-management">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Complaints Management</h1>
            <p className="page-subtitle">
              Monitor and resolve traveler complaints to maintain service quality and customer satisfaction
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stats-grid">
              <div className="stat-item stat-item--primary">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.totalComplaints}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
              <div className="stat-item stat-item--warning">
                <div className="stat-icon">🆕</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.newComplaints}</div>
                  <div className="stat-label">New</div>
                </div>
              </div>
              <div className="stat-item stat-item--error">
                <div className="stat-icon">🚨</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.urgentComplaints}</div>
                  <div className="stat-label">Urgent</div>
                </div>
              </div>
              <div className="stat-item stat-item--success">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.resolvedComplaints}</div>
                  <div className="stat-label">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filters-group">
            <div className="filter-item">
              <label className="filter-label">Search:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label className="filter-label">Category:</label>
              <select 
                className="filter-select"
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

            <div className="filter-item">
              <label className="filter-label">Status:</label>
              <select 
                className="filter-select"
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

            <div className="filter-item">
              <label className="filter-label">Priority:</label>
              <select 
                className="filter-select"
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

            <div className="filter-item">
              <label className="filter-label">Date Range:</label>
              <select 
                className="filter-select"
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

          <div className="results-info">
            <span className="results-count">
              {filteredComplaints.length} complaint{filteredComplaints.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Complaints Grid */}
      <div className="complaints-section">
        {currentComplaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3 className="empty-title">No Complaints Found</h3>
            <p className="empty-description">
              No complaints match your current filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="complaints-grid">
              {currentComplaints.map((complaint) => (
                <div 
                  key={complaint.id} 
                  className="complaint-card"
                  onClick={() => handleComplaintClick(complaint)}
                >
                  <div className="card-header">
                    <div className="complaint-meta">
                      <span className="complaint-id">{complaint.id}</span>
                      <div className="badges">
                        <span className={getStatusBadge(complaint.status)}>
                          {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                        </span>
                        <span className={getPriorityBadge(complaint.priority)}>
                          {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="category-info">
                      <span className="category-icon">{getCategoryIcon(complaint.category)}</span>
                      <span className="category-name">{getCategoryName(complaint.category)}</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <h3 className="complaint-topic">{complaint.topic}</h3>
                    <p className="complaint-preview">
                      {truncateText(complaint.complaint, 120)}
                    </p>
                    
                    <div className="user-info">
                      <div className="user-details">
                        <span className="user-name">{complaint.userName}</span>
                        <span className="user-email">{complaint.userEmail}</span>
                      </div>
                      <div className="submission-date">
                        {formatDate(complaint.submittedDate)}
                      </div>
                    </div>

                    {complaint.photos && complaint.photos.length > 0 && (
                      <div className="photos-preview">
                        <div className="photos-indicator">
                          <span className="photo-icon">📷</span>
                          <span className="photo-count">{complaint.photos.length} photo{complaint.photos.length !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="photos-thumbnails">
                          {complaint.photos.slice(0, 3).map((photo) => (
                            <div key={photo.id} className="photo-thumbnail">
                              <img src={photo.url} alt={photo.caption} />
                            </div>
                          ))}
                          {complaint.photos.length > 3 && (
                            <div className="more-photos">+{complaint.photos.length - 3}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    <div className="service-provider">
                      <span className="provider-label">Provider:</span>
                      <span className="provider-name">{complaint.serviceProvider}</span>
                    </div>
                    {complaint.responseRequired && (
                      <div className="response-required">
                        <span className="response-indicator">Response Required</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                
                <div className="pagination-info">
                  <span className="page-numbers">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="items-info">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredComplaints.length)} of {filteredComplaints.length}
                  </span>
                </div>
                
                <button 
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Complaint Details</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="complaint-details">
                {/* Basic Information */}
                <div className="details-section">
                  <h3 className="section-title">Complaint Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Complaint ID:</span>
                      <span className="detail-value">{selectedComplaint.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">
                        {getCategoryIcon(selectedComplaint.category)} {getCategoryName(selectedComplaint.category)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={getStatusBadge(selectedComplaint.status)}>
                        {selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Priority:</span>
                      <span className={getPriorityBadge(selectedComplaint.priority)}>
                        {selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Submitted Date:</span>
                      <span className="detail-value">{formatDate(selectedComplaint.submittedDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Booking Reference:</span>
                      <span className="detail-value">{selectedComplaint.bookingReference}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="details-section">
                  <h3 className="section-title">Customer Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedComplaint.userName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedComplaint.userEmail}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Service Provider:</span>
                      <span className="detail-value">{selectedComplaint.serviceProvider}</span>
                    </div>
                  </div>
                </div>

                {/* Complaint Details */}
                <div className="details-section">
                  <h3 className="section-title">Complaint Topic</h3>
                  <h4 className="complaint-topic-detail">{selectedComplaint.topic}</h4>
                </div>

                <div className="details-section">
                  <h3 className="section-title">Complaint Description</h3>
                  <p className="complaint-description">{selectedComplaint.complaint}</p>
                </div>

                {/* Photos */}
                {selectedComplaint.photos && selectedComplaint.photos.length > 0 && (
                  <div className="details-section">
                    <h3 className="section-title">Attached Photos ({selectedComplaint.photos.length})</h3>
                    <div className="photos-gallery">
                      {selectedComplaint.photos.map((photo) => (
                        <div key={photo.id} className="gallery-item" onClick={() => handleImageClick(photo)}>
                          <img src={photo.url} alt={photo.caption} />
                          <div className="photo-caption">{photo.caption}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution Information */}
                {selectedComplaint.resolution && (
                  <div className="details-section">
                    <h3 className="section-title">Resolution</h3>
                    <p className="resolution-text">{selectedComplaint.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={closeImageModal}>×</button>
            <img src={selectedImage.url} alt={selectedImage.caption} />
            <div className="image-caption">{selectedImage.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplains;