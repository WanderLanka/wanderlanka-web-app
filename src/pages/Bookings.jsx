import { useState, useEffect } from "react";
// import "../styles/Bookings.css"; // Converted to Tailwind CSS
import api from "../services/axiosConfig";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [errors, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("checkIn");
  const [hotels, setHotels] = useState([]); // Now stores only hotel names
  const [filterHotel, setFilterHotel] = useState("all"); // New hotel filter state

  // Function to determine booking status based on dates
  const getBookingStatus = (checkIn, checkOut) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate < today) {
      return { status: "Completed", className: "completed" };
    } else if (checkInDate > today) {
      return { status: "Upcoming", className: "upcoming" };
    } else if (checkInDate <= today && checkOutDate >= today) {
      return { status: "Active", className: "active" };
    }
    
    return { status: "Unknown", className: "unknown" };
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required to view bookings.');
        setBookings([]);
        setLoading(false);
        return;
      }

      const response = await api.get('/booking/current');
      
      if (response.data && Array.isArray(response.data)) {
        setBookings(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setBookings([response.data]);
      } else {
        setBookings([]);
      }
      
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings. Please try again later.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBookings();
      try {
        const response = await api.get('/accommodation/places');
        if (response.status === 200) {
          // Extract only hotel names and remove duplicates
          const hotelNames = [...new Set(response.data.map(hotel => hotel.name))];
          setHotels(hotelNames);
        } else {
          console.error('Error fetching hotels:', response.data);
          setError('Failed to fetch hotels. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setError('Failed to fetch hotels. Please try again later.');
      }
    };
    fetchData();
  }, []);

  // Filter bookings based on status and hotel name
  const filteredBookings = bookings.filter(booking => {
    // Status filter
    if (filterStatus !== "all") {
      const status = getBookingStatus(booking.checkIn, booking.checkOut);
      if (status.className !== filterStatus) return false;
    }
    
    // Hotel filter
    if (filterHotel !== "all") {
      const hotel = Array.isArray(booking.hotel) ? booking.hotel[0] : booking.hotel;
      const hotelName = hotel?.name || '';
      if (hotelName !== filterHotel) return false;
    }
    
    return true;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "checkIn":
        return new Date(b.checkIn) - new Date(a.checkIn);
      case "checkOut":
        return new Date(b.checkOut) - new Date(a.checkOut);
      case "amount":
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  // Calculate statistics
  const stats = {
    total: bookings.length,
    active: bookings.filter(b => getBookingStatus(b.checkIn, b.checkOut).className === "active").length,
    upcoming: bookings.filter(b => getBookingStatus(b.checkIn, b.checkOut).className === "upcoming").length,
    completed: bookings.filter(b => getBookingStatus(b.checkIn, b.checkOut).className === "completed").length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-slate-600 font-medium">Loading bookings data...</div>
        </div>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 text-red-700">
              <span className="text-lg">⚠️</span>
              <span>{errors}</span>
            </div>
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-150"
            onClick={fetchBookings}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Executive Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex-1 mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Bookings Management</h1>
              <p className="text-xl text-slate-600">
                Monitor and manage all hotel bookings with real-time status tracking and comprehensive analytics.
              </p>
            </div>
          
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">LKR {stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <span className="filter-label">Status Filter:</span>
            <select 
              className="filter-dropdown"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Bookings</option>
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>

            <span className="filter-label">Hotel Filter:</span>
            <select 
              className="filter-dropdown"
              value={filterHotel}
              onChange={(e) => setFilterHotel(e.target.value)}
            >
              <option value="all">All Hotels</option>
              {hotels.map((hotelName, index) => (
                <option key={index} value={hotelName}>
                  {hotelName}
                </option>
              ))}
            </select>

            <span className="filter-label">Sort By:</span>
            <select 
              className="filter-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="checkIn">Check-in Date</option>
              <option value="checkOut">Check-out Date</option>
              <option value="amount">Total Amount</option>
            </select>
          </div>
          
          <div className="filter-right">
            <div className="results-count">
              {sortedBookings.length} {sortedBookings.length === 1 ? 'Booking' : 'Bookings'}
            </div>
            <button className="refresh-btn" onClick={fetchBookings}>
              <span className="btn-icon">🔄</span>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bookings-container">
        <div className="quick-stats">
          <div className="quick-stat-card active">
            <div className="quick-stat-number">{stats.active}</div>
            <div className="quick-stat-label">Active</div>
          </div>
          <div className="quick-stat-card upcoming">
            <div className="quick-stat-number">{stats.upcoming}</div>
            <div className="quick-stat-label">Upcoming</div>
          </div>
          <div className="quick-stat-card completed">
            <div className="quick-stat-number">{stats.completed}</div>
            <div className="quick-stat-label">Completed</div>
          </div>
        </div>

        {/* Bookings Grid */}
        {sortedBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3 className="empty-title">No Bookings Found</h3>
            <p className="empty-description">
              {filterStatus !== 'all' || filterHotel !== 'all'
                ? `No bookings found for the selected filters.`
                : 'No bookings have been made yet.'}
            </p>
          </div>
        ) : (
          <div className="bookings-grid">
            {sortedBookings.map((booking) => {
              // Extract data from the nested arrays
              const hotel = Array.isArray(booking.hotel) ? booking.hotel[0] : booking.hotel;
              const room = Array.isArray(booking.room) ? booking.room[0] : booking.room;
              
              // Get booking status
              const bookingStatus = getBookingStatus(booking.checkIn, booking.checkOut);
              
              return (
                <div key={booking._id} className="booking-card">
                  <div className="card-header">
                    <div className="booking-id">
                      <span className="id-label">Booking ID:</span>
                      <span className="id-value">{booking._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <span className={`status-badge status-badge--${bookingStatus.className}`}>
                      {bookingStatus.status}
                    </span>
                  </div>
                  
                  <div className="booking-info">
                    <div className="info-section">
                      <h3 className="section-title">Hotel Information</h3>
                      <div className="info-grid">
                        <div className="info-row">
                          <span className="info-label">Property</span>
                          <span className="info-value">{hotel?.name || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Location</span>
                          <span className="info-value">{hotel?.location || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Type</span>
                          <span className="info-value capitalize">{hotel?.accommodationType || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3 className="section-title">Guest & Room Details</h3>
                      <div className="info-grid">
                        <div className="info-row">
                          <span className="info-label">Guest</span>
                          <span className="info-value">{booking.user}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Room Type</span>
                          <span className="info-value capitalize">{room?.type || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Booking Type</span>
                          <span className="info-value capitalize">{booking.bookingType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3 className="section-title">Schedule</h3>
                      <div className="schedule-grid">
                        <div className="schedule-item">
                          <div className="schedule-label">Check-in</div>
                          <div className="schedule-date">{formatDate(booking.checkIn)}</div>
                          <div className="schedule-time">{formatTime(booking.checkIn)}</div>
                        </div>
                        <div className="schedule-divider">→</div>
                        <div className="schedule-item">
                          <div className="schedule-label">Check-out</div>
                          <div className="schedule-date">{formatDate(booking.checkOut)}</div>
                          <div className="schedule-time">{formatTime(booking.checkOut)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="amount-section">
                      <span className="amount-label">Total Amount</span>
                      <span className="amount-value">LKR {booking.totalAmount?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    
                    {bookingStatus.className !== 'completed' && (
                      <button className="action-btn action-btn--secondary">
                        <span className="btn-icon">✏️</span>
                        Modify
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;