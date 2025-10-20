import React, { useState, useEffect } from "react";
// import "../styles/AdminRequests.css"; // Converted to Tailwind CSS

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
      pending: "bg-amber-100 text-amber-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return badges[status] || "bg-slate-100 text-slate-800";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-slate-600">Loading access requests...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-slate-950 to-slate-900 relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-indigo-500/10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
              Access Requests
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Manage and review access requests from accommodation providers, transport services, and tour guides
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-amber-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-3xl font-extrabold text-amber-200 mb-2 leading-none">{stats.pendingRequests}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-green-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-3xl font-extrabold text-green-200 mb-2 leading-none">{stats.approvedRequests}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Approved</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-red-500/30 transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="text-3xl font-extrabold text-red-200 mb-2 leading-none">{stats.rejectedRequests}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Rejected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Provider Type:</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Status:</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range:</label>
              <select 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="text-right">
              <span className="text-sm text-slate-600">
                {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-400 text-xl mr-3">⚠️</span>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {currentRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Access Requests Found</h3>
            <p className="text-slate-600">
              No access requests match your current filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Request ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Provider Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Business Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {currentRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">{request.id}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{request.applicantName}</div>
                            <div className="text-sm text-slate-500">{request.applicantEmail}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getRoleIcon(request.role)}</span>
                            <span className="text-sm text-slate-900">{getRoleName(request.role)}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{request.businessName}</div>
                            <div className="text-sm text-slate-500">{request.businessAddress}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {formatDate(request.submittedDate)}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button 
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                
                <div className="text-sm text-slate-700">
                  <span className="font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <span className="ml-2 text-slate-500">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length}
                  </span>
                </div>
                
                <button 
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Access Request Details</h2>
              <button className="text-slate-300 hover:text-white text-2xl" onClick={closeModal}>×</button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Request ID:</span>
                      <span className="text-slate-900">{selectedRequest.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedRequest.status)}`}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Provider Type:</span>
                      <span className="text-slate-900">
                        {getRoleIcon(selectedRequest.role)} {getRoleName(selectedRequest.role)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Submitted Date:</span>
                      <span className="text-slate-900">{formatDate(selectedRequest.submittedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Applicant Information */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Applicant Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Name:</span>
                      <span className="text-slate-900">{selectedRequest.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Email:</span>
                      <span className="text-slate-900">{selectedRequest.applicantEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Contact:</span>
                      <span className="text-slate-900">{selectedRequest.contactNumber}</span>
                    </div>
                    {selectedRequest.website && (
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">Website:</span>
                        <a href={selectedRequest.website} className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                          {selectedRequest.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Business Name:</span>
                      <span className="text-slate-900">{selectedRequest.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Address:</span>
                      <span className="text-slate-900">{selectedRequest.businessAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Registration:</span>
                      <span className="text-slate-900">{selectedRequest.businessRegistration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700">Tax ID:</span>
                      <span className="text-slate-900">{selectedRequest.taxId}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Description</h3>
                  <p className="text-slate-700 leading-relaxed">{selectedRequest.description}</p>
                </div>

                {/* Additional Information */}
                {selectedRequest.additionalInfo && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedRequest.additionalInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium text-slate-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="text-slate-900">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Attached Documents</h3>
                  <div className="space-y-3">
                    {selectedRequest.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">📄</span>
                          <div>
                            <span className="font-medium text-slate-900">{doc.name}</span>
                            <span className="ml-2 text-sm text-slate-500">({doc.type.toUpperCase()})</span>
                          </div>
                        </div>
                        <a href={doc.url} className="text-blue-600 hover:text-blue-800 font-medium" target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Processing Information (for approved/rejected requests) */}
                {(selectedRequest.status === 'approved' || selectedRequest.status === 'rejected') && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Processing Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">Processed Date:</span>
                        <span className="text-slate-900">{formatDate(selectedRequest.processedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">Processed By:</span>
                        <span className="text-slate-900">{selectedRequest.processedBy}</span>
                      </div>
                      {selectedRequest.rejectionReason && (
                        <div className="col-span-2">
                          <span className="font-medium text-slate-700">Rejection Reason:</span>
                          <p className="text-slate-900 mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
                            {selectedRequest.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedRequest.status === 'pending' && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                <button 
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors duration-150" 
                  onClick={() => handleAction(selectedRequest.id, 'rejected')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Reject Request'}
                </button>
                <button 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-colors duration-150" 
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