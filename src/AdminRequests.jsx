import React, { useState, useEffect } from "react";
import "./AdminRequests.css";

const AdminRequests = () => {
  // State management
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filter states
  const [filterRole, setFilterRole] = useState("all"); // all, accommodation, transport, guide
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected
  const [filterDate, setFilterDate] = useState("all"); // all, today, week, month
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock access request data - replace with actual API call
  const mockRequests = [
    {
      id: "REQ-001",
      applicantName: "Cinnamon Hotels & Resorts",
      applicantEmail: "admin@cinnamonhotels.com",
      role: "accommodation",
      status: "pending",
      submittedDate: "2025-01-22T09:30:00Z",
      businessName: "Cinnamon Grand Colombo",
      businessAddress: "77 Galle Rd, Colombo 03, Sri Lanka",
      contactNumber: "+94 11 249 1000",
      website: "https://cinnamonhotels.com",
      businessRegistration: "BR-2018-001234",
      taxId: "TAX-001234567",
      description: "Leading luxury hotel chain seeking to join WanderLanka platform to reach more international tourists.",
      documents: [
        { name: "Business Registration Certificate", url: "#", type: "pdf" },
        { name: "Tax Registration Document", url: "#", type: "pdf" },
        { name: "Hotel Photos Portfolio", url: "#", type: "zip" },
        { name: "Service Brochure", url: "#", type: "pdf" }
      ],
      additionalInfo: {
        roomCount: 501,
        starRating: 5,
        amenities: ["Pool", "Spa", "Gym", "Restaurant", "Bar", "Business Center"],
        checkInTime: "14:00",
        checkOutTime: "12:00"
      }
    },
    {
      id: "REQ-002",
      applicantName: "Lanka Taxi Services",
      applicantEmail: "contact@lankataxi.lk",
      role: "transport",
      status: "pending",
      submittedDate: "2025-01-21T14:45:00Z",
      businessName: "Lanka Express Taxi Service",
      businessAddress: "No. 45, Galle Road, Mount Lavinia",
      contactNumber: "+94 77 123 4567",
      website: "https://lankataxi.lk",
      businessRegistration: "BR-2020-005678",
      taxId: "TAX-005678901",
      description: "Reliable taxi service with 15+ years experience providing airport transfers and city tours.",
      documents: [
        { name: "Business License", url: "#", type: "pdf" },
        { name: "Vehicle Registration Documents", url: "#", type: "zip" },
        { name: "Driver License Copies", url: "#", type: "zip" },
        { name: "Insurance Certificates", url: "#", type: "pdf" }
      ],
      additionalInfo: {
        vehicleCount: 25,
        serviceTypes: ["Airport Transfer", "City Tours", "Long Distance"],
        operatingHours: "24/7",
        coverage: ["Colombo", "Galle", "Kandy", "Negombo"]
      }
    },
    {
      id: "REQ-003",
      applicantName: "Samantha Perera",
      applicantEmail: "samantha.guide@gmail.com",
      role: "guide",
      status: "approved",
      submittedDate: "2025-01-20T11:20:00Z",
      businessName: "Cultural Heritage Tours",
      businessAddress: "Temple Road, Kandy",
      contactNumber: "+94 71 234 5678",
      website: "",
      businessRegistration: "GUIDE-2021-001",
      taxId: "TAX-234567890",
      description: "Licensed tour guide specializing in cultural and historical tours with 8 years experience.",
      documents: [
        { name: "Tour Guide License", url: "#", type: "pdf" },
        { name: "Language Certificates", url: "#", type: "pdf" },
        { name: "Tourism Board Registration", url: "#", type: "pdf" },
        { name: "Previous Client Reviews", url: "#", type: "pdf" }
      ],
      additionalInfo: {
        languages: ["English", "German", "Japanese", "Sinhala"],
        specializations: ["Cultural Tours", "Historical Sites", "Temple Visits", "Nature Walks"],
        experience: "8 years",
        certifications: ["Licensed Tour Guide", "First Aid Certified"]
      },
      processedDate: "2025-01-21T10:15:00Z",
      processedBy: "admin@wanderlanka.com"
    },
    {
      id: "REQ-004",
      applicantName: "Green Villa Eco Resort",
      applicantEmail: "info@greenvilla.lk",
      role: "accommodation",
      status: "pending",
      submittedDate: "2025-01-19T16:30:00Z",
      businessName: "Green Villa Eco Resort",
      businessAddress: "Ella, Badulla District",
      contactNumber: "+94 57 223 8900",
      website: "https://greenvilla.lk",
      businessRegistration: "BR-2019-009876",
      taxId: "TAX-987654321",
      description: "Eco-friendly boutique resort nestled in the hills of Ella, offering sustainable tourism experiences.",
      documents: [
        { name: "Environmental Certification", url: "#", type: "pdf" },
        { name: "Business Registration", url: "#", type: "pdf" },
        { name: "Property Photos", url: "#", type: "zip" },
        { name: "Sustainability Report", url: "#", type: "pdf" }
      ],
      additionalInfo: {
        roomCount: 12,
        starRating: 4,
        amenities: ["Organic Garden", "Yoga Deck", "Nature Trails", "Eco-friendly Facilities"],
        checkInTime: "15:00",
        checkOutTime: "11:00"
      }
    },
    {
      id: "REQ-005",
      applicantName: "Adventure Sports Lanka",
      applicantEmail: "info@adventuresportslk.com",
      role: "guide",
      status: "rejected",
      submittedDate: "2025-01-18T13:15:00Z",
      businessName: "Extreme Adventures Lanka",
      businessAddress: "Kitulgala, Kegalle District",
      contactNumber: "+94 36 228 7654",
      website: "https://adventuresportslk.com",
      businessRegistration: "GUIDE-2022-002",
      taxId: "TAX-345678901",
      description: "Adventure tourism company offering white water rafting, rock climbing, and jungle trekking.",
      documents: [
        { name: "Adventure Sports License", url: "#", type: "pdf" },
        { name: "Safety Certifications", url: "#", type: "pdf" },
        { name: "Equipment Inspection Reports", url: "#", type: "pdf" }
      ],
      additionalInfo: {
        languages: ["English", "Sinhala"],
        specializations: ["White Water Rafting", "Rock Climbing", "Jungle Trekking", "Canyoning"],
        experience: "5 years",
        certifications: ["Adventure Sports License", "Safety Instructor"]
      },
      processedDate: "2025-01-19T09:30:00Z",
      processedBy: "admin@wanderlanka.com",
      rejectionReason: "Incomplete safety documentation and missing insurance coverage details."
    },
    {
      id: "REQ-006",
      applicantName: "Royal Express Transport",
      applicantEmail: "bookings@royalexpress.lk",
      role: "transport",
      status: "approved",
      submittedDate: "2025-01-17T10:00:00Z",
      businessName: "Royal Express Coach Service",
      businessAddress: "Colombo 07, Sri Lanka",
      contactNumber: "+94 11 269 8745",
      website: "https://royalexpress.lk",
      businessRegistration: "BR-2017-112233",
      taxId: "TAX-112233445",
      description: "Premium coach service providing luxury transportation for tourists across Sri Lanka.",
      documents: [
        { name: "Transport License", url: "#", type: "pdf" },
        { name: "Fleet Registration", url: "#", type: "zip" },
        { name: "Safety Inspection Reports", url: "#", type: "pdf" },
        { name: "Insurance Documentation", url: "#", type: "pdf" }
      ],
      additionalInfo: {
        vehicleCount: 45,
        serviceTypes: ["Luxury Coaches", "Mini Buses", "Airport Transfers"],
        operatingHours: "06:00 - 22:00",
        coverage: ["All Major Cities", "Tourist Destinations", "Airports"]
      },
      processedDate: "2025-01-18T14:20:00Z",
      processedBy: "admin@wanderlanka.com"
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRequests(mockRequests);
        setFilteredRequests(mockRequests);
        setError("");
      } catch (err) {
        setError("Failed to fetch access requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests
  useEffect(() => {
    let filtered = [...requests];

    // Filter by role
    if (filterRole !== "all") {
      filtered = filtered.filter(request => request.role === filterRole);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(request => request.status === filterStatus);
    }

    // Filter by date
    if (filterDate !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.submittedDate);
        
        switch (filterDate) {
          case "today":
            return requestDate >= today;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return requestDate >= weekAgo;
          case "month":
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return requestDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [requests, filterRole, filterStatus, filterDate]);

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
      pending: "status-badge status-badge--warning",
      approved: "status-badge status-badge--success",
      rejected: "status-badge status-badge--error"
    };
    return badges[status] || "status-badge";
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
    setActionLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the request status
      const updatedRequests = requests.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              status: action,
              processedDate: new Date().toISOString(),
              processedBy: "admin@wanderlanka.com"
            }
          : request
      );
      
      setRequests(updatedRequests);
      closeModal();
      
      // Show success message (you can implement a toast notification here)
      console.log(`Request ${requestId} has been ${action}`);
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="access-requests">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading access requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="access-requests">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Access Requests</h1>
            <p className="page-subtitle">
              Manage and review access requests from accommodation providers, transport services, and tour guides
            </p>
          </div>
          
          <div className="header-stats">
            <div className="stats-grid">
              <div className="stat-item stat-item--warning">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.pendingRequests}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
              <div className="stat-item stat-item--success">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.approvedRequests}</div>
                  <div className="stat-label">Approved</div>
                </div>
              </div>
              <div className="stat-item stat-item--error">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <div className="stat-number">{stats.rejectedRequests}</div>
                  <div className="stat-label">Rejected</div>
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
              <label className="filter-label">Provider Type:</label>
              <select 
                className="filter-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Providers</option>
                <option value="accommodation">Hotels & Accommodations</option>
                <option value="transport">Transport Services</option>
                <option value="guide">Tour Guides</option>
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
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
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

      {/* Requests Table */}
      <div className="requests-section">
        {currentRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No Access Requests Found</h3>
            <p className="empty-description">
              No access requests match your current filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="requests-table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Applicant</th>
                    <th>Provider Type</th>
                    <th>Business Name</th>
                    <th>Status</th>
                    <th>Submitted Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
                    <tr key={request.id} className="request-row">
                      <td className="request-id-cell">
                        <div className="request-id">{request.id}</div>
                      </td>
                      
                      <td className="applicant-cell">
                        <div className="applicant-info">
                          <div className="applicant-name">{request.applicantName}</div>
                          <div className="applicant-email">{request.applicantEmail}</div>
                        </div>
                      </td>
                      
                      <td className="role-cell">
                        <div className="provider-type">
                          <span className="role-icon">{getRoleIcon(request.role)}</span>
                          <span className="role-text">{getRoleName(request.role)}</span>
                        </div>
                      </td>
                      
                      <td className="business-cell">
                        <div className="business-info">
                          <div className="business-name">{request.businessName}</div>
                          <div className="business-address">{request.businessAddress}</div>
                        </div>
                      </td>
                      
                      <td className="status-cell">
                        <span className={getStatusBadge(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      
                      <td className="date-cell">
                        <div className="date-info">
                          {formatDate(request.submittedDate)}
                        </div>
                      </td>
                      
                      <td className="actions-cell">
                        <button 
                          className="view-btn"
                          onClick={() => handleRequestClick(request)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length}
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

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Access Request Details</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="request-details">
                {/* Basic Information */}
                <div className="details-section">
                  <h3 className="section-title">Basic Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Request ID:</span>
                      <span className="detail-value">{selectedRequest.id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={getStatusBadge(selectedRequest.status)}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Provider Type:</span>
                      <span className="detail-value">
                        {getRoleIcon(selectedRequest.role)} {getRoleName(selectedRequest.role)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Submitted Date:</span>
                      <span className="detail-value">{formatDate(selectedRequest.submittedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Applicant Information */}
                <div className="details-section">
                  <h3 className="section-title">Applicant Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{selectedRequest.applicantName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedRequest.applicantEmail}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Contact:</span>
                      <span className="detail-value">{selectedRequest.contactNumber}</span>
                    </div>
                    {selectedRequest.website && (
                      <div className="detail-item">
                        <span className="detail-label">Website:</span>
                        <a href={selectedRequest.website} className="detail-link" target="_blank" rel="noopener noreferrer">
                          {selectedRequest.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div className="details-section">
                  <h3 className="section-title">Business Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Business Name:</span>
                      <span className="detail-value">{selectedRequest.businessName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{selectedRequest.businessAddress}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Registration:</span>
                      <span className="detail-value">{selectedRequest.businessRegistration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tax ID:</span>
                      <span className="detail-value">{selectedRequest.taxId}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="details-section">
                  <h3 className="section-title">Description</h3>
                  <p className="description-text">{selectedRequest.description}</p>
                </div>

                {/* Additional Information */}
                {selectedRequest.additionalInfo && (
                  <div className="details-section">
                    <h3 className="section-title">Additional Information</h3>
                    <div className="additional-info">
                      {Object.entries(selectedRequest.additionalInfo).map(([key, value]) => (
                        <div key={key} className="detail-item">
                          <span className="detail-label">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="detail-value">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="details-section">
                  <h3 className="section-title">Attached Documents</h3>
                  <div className="documents-list">
                    {selectedRequest.documents.map((doc, index) => (
                      <div key={index} className="document-item">
                        <div className="document-info">
                          <span className="document-icon">📄</span>
                          <span className="document-name">{doc.name}</span>
                          <span className="document-type">({doc.type.toUpperCase()})</span>
                        </div>
                        <a href={doc.url} className="document-link" target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Information (for approved/rejected requests) */}
                {(selectedRequest.status === 'approved' || selectedRequest.status === 'rejected') && (
                  <div className="details-section">
                    <h3 className="section-title">Processing Information</h3>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Processed Date:</span>
                        <span className="detail-value">{formatDate(selectedRequest.processedDate)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Processed By:</span>
                        <span className="detail-value">{selectedRequest.processedBy}</span>
                      </div>
                      {selectedRequest.rejectionReason && (
                        <div className="detail-item rejection-reason">
                          <span className="detail-label">Rejection Reason:</span>
                          <span className="detail-value">{selectedRequest.rejectionReason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedRequest.status === 'pending' && (
              <div className="modal-footer">
                <button 
                  className="action-btn reject-btn" 
                  onClick={() => handleAction(selectedRequest.id, 'rejected')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Reject Request'}
                </button>
                <button 
                  className="action-btn approve-btn" 
                  onClick={() => handleAction(selectedRequest.id, 'approved')}
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