import { useState, useEffect } from "react";
import api from "../../services/axiosConfig";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [errors, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("checkIn");
  const [hotels, setHotels] = useState([]);
  const [filterHotel, setFilterHotel] = useState("all");

  // Function to determine booking status based on dates
  const getBookingStatus = (checkInDate, checkOutDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut < today) {
      return { status: "Completed", className: "completed" };
    } else if (checkIn > today) {
      return { status: "Upcoming", className: "upcoming" };
    } else if (checkIn <= today && checkOut >= today) {
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

      const response = await api.get('/booking/provider/bookings?serviceType=accommodation');
      const list = response.data?.data || [];
      setBookings(list);
      
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
    // Only include bookings that have valid data
    if (!booking || !booking.bookingDetails?.checkInDate || !booking.bookingDetails?.checkOutDate) {
      return false;
    }

    if (filterStatus !== "all") {
      const status = getBookingStatus(booking.bookingDetails.checkInDate, booking.bookingDetails.checkOutDate);
      if (status.className !== filterStatus) return false;
    }
    
    if (filterHotel !== "all") {
      const serviceName = booking.serviceName || '';
      if (serviceName !== filterHotel) return false;
    }
    
    return true;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "checkIn":
        return new Date(b.bookingDetails.checkInDate) - new Date(a.bookingDetails.checkInDate);
      case "checkOut":
        return new Date(b.bookingDetails.checkOutDate) - new Date(a.bookingDetails.checkOutDate);
      case "amount":
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  // Calculate statistics - only for valid bookings
  const validBookings = bookings.filter(b => b && b.bookingDetails?.checkInDate && b.bookingDetails?.checkOutDate);
  const stats = {
    total: validBookings.length,
    active: validBookings.filter(b => getBookingStatus(b.bookingDetails.checkInDate, b.bookingDetails.checkOutDate).className === "active").length,
    upcoming: validBookings.filter(b => getBookingStatus(b.bookingDetails.checkInDate, b.bookingDetails.checkOutDate).className === "upcoming").length,
    completed: validBookings.filter(b => getBookingStatus(b.bookingDetails.checkInDate, b.bookingDetails.checkOutDate).className === "completed").length,
    totalRevenue: validBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0)
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-slate-600 font-medium">Loading bookings data...</div>
        </div>
      </div>
    );
  }

  if (errors) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-2 text-red-700 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error Loading Bookings</span>
            </div>
            <p className="text-red-600">{errors}</p>
          </div>
          <button 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            onClick={fetchBookings}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex-1 mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Bookings Management</h1>
              <p className="text-lg text-slate-600">
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
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Status Filter:</span>
                <select 
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Bookings</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Hotel Filter:</span>
                <select 
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
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
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Sort By:</span>
                <select 
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="checkIn">Check-in Date</option>
                  <option value="checkOut">Check-out Date</option>
                  <option value="amount">Total Amount</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600 font-medium">
                {sortedBookings.length} {sortedBookings.length === 1 ? 'Booking' : 'Bookings'}
              </div>
              <button 
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                onClick={fetchBookings}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Upcoming</p>
                <p className="text-2xl font-bold text-slate-900">{stats.upcoming}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {sortedBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Bookings Found</h3>
            <p className="text-slate-600">
              {filterStatus !== 'all' || filterHotel !== 'all'
                ? `No bookings found for the selected filters.`
                : 'No bookings have been made yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedBookings.map((booking) => {
              // Skip bookings with missing essential data
              if (!booking || !booking._id || !booking.bookingDetails?.checkInDate || !booking.bookingDetails?.checkOutDate) {
                return null;
              }

              const bookingStatus = getBookingStatus(booking.bookingDetails.checkInDate, booking.bookingDetails.checkOutDate);
              
              return (
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">Booking #{booking.bookingId}</h3>
                          <p className="text-sm text-slate-500">{booking.serviceName}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bookingStatus.className)}`}>
                        {bookingStatus.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-6">
                    {/* Guest Information */}
                    {booking.contactInfo && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Guest Information</h4>
                        <div className="space-y-2">
                          {booking.contactInfo.firstName && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Guest Name</span>
                              <span className="font-medium text-slate-800">
                                {booking.contactInfo.firstName} {booking.contactInfo.lastName || ''}
                              </span>
                            </div>
                          )}
                          {booking.contactInfo.email && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Email</span>
                              <span className="font-medium text-slate-800">{booking.contactInfo.email}</span>
                            </div>
                          )}
                          {booking.contactInfo.phone && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Phone</span>
                              <span className="font-medium text-slate-800">{booking.contactInfo.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Booking Details */}
                    {booking.bookingDetails && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Booking Details</h4>
                        <div className="space-y-2">
                          {booking.bookingDetails.rooms && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Rooms</span>
                              <span className="font-medium text-slate-800">{booking.bookingDetails.rooms}</span>
                            </div>
                          )}
                          {booking.bookingDetails.adults && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Adults</span>
                              <span className="font-medium text-slate-800">{booking.bookingDetails.adults}</span>
                            </div>
                          )}
                          {booking.bookingDetails.children && booking.bookingDetails.children > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Children</span>
                              <span className="font-medium text-slate-800">{booking.bookingDetails.children}</span>
                            </div>
                          )}
                          {booking.bookingDetails.nights && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Nights</span>
                              <span className="font-medium text-slate-800">{booking.bookingDetails.nights}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Schedule */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Schedule</h4>
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <div className="text-xs text-slate-500 mb-1">Check-in</div>
                          <div className="font-medium text-slate-800">{formatDate(booking.bookingDetails.checkInDate)}</div>
                          <div className="text-xs text-slate-500">{formatTime(booking.bookingDetails.checkInDate)}</div>
                        </div>
                        <div className="text-slate-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-slate-500 mb-1">Check-out</div>
                          <div className="font-medium text-slate-800">{formatDate(booking.bookingDetails.checkOutDate)}</div>
                          <div className="text-xs text-slate-500">{formatTime(booking.bookingDetails.checkOutDate)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    {booking.paymentDetails && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Payment Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Status</span>
                            <span className={`font-medium ${booking.paymentDetails.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {booking.paymentDetails.paymentStatus}
                            </span>
                          </div>
                          {booking.paymentDetails.transactionId && (
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Transaction ID</span>
                              <span className="font-medium text-slate-800 text-xs">{booking.paymentDetails.transactionId}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Amount */}
                    {booking.totalAmount && (
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800">Total Amount</span>
                        <span className="text-lg font-bold text-green-900">
                          {booking.currency || 'LKR'} {Number(booking.totalAmount).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* Booking Timeline */}
                    {booking.bookingTimeline && booking.bookingTimeline.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 mb-3">Booking Timeline</h4>
                        <div className="space-y-2">
                          {booking.bookingTimeline
                            .filter(timeline => timeline.step !== 'payment_skipped')
                            .slice(0, 3)
                            .map((timeline, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span className="text-slate-600 capitalize">{timeline.step.replace('_', ' ')}</span>
                              <span className={`px-2 py-1 rounded-full ${
                                timeline.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {timeline.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-0 border-t border-slate-200">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Created: {formatDate(booking.createdAt)}</span>
                      <span>Confirmation: {booking.confirmationNumber}</span>
                    </div>
                  </div>
                </div>
              );
            }).filter(Boolean)} {/* Remove null entries */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;