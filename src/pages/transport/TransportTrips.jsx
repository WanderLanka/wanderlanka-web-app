import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Car, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { bookingsAPI } from '../../services/api';

const TransportTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch transport provider bookings
  useEffect(() => {
    fetchTransportBookings();
  }, []);

  const fetchTransportBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching transport provider bookings...');
      const response = await bookingsAPI.getProviderBookings('transportation');
      
      console.log('Transport bookings response:', response);
      
      if (response.success) {
        setBookings(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching transport bookings:', err);
      setError('Failed to load transport bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = searchTerm === '' || 
      booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.contactInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      failed: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency = 'LKR') => {
    return `${currency} ${Number(amount).toLocaleString()}`;
  };

  // Calculate statistics
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-4" />
            <span className="text-slate-600">Loading transport bookings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-400 mr-2" />
              <div className="text-red-800 font-medium">Error Loading Bookings</div>
            </div>
            <div className="text-red-600 mt-2">{error}</div>
            <button
              onClick={fetchTransportBookings}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Transport Operations</h1>
              <p className="text-slate-600 mt-2">Manage and track all transport bookings</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchTransportBookings}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Confirmed</p>
                <p className="text-2xl font-bold text-slate-900">{stats.confirmed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Cancelled</p>
                <p className="text-2xl font-bold text-slate-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filter by status:</span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 border border-slate-200 text-center">
              <Car className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No transport bookings found</h3>
              <p className="text-slate-600">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'Transport bookings will appear here once customers start booking your vehicles.'}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Booking #{booking.bookingId}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Confirmation: {booking.confirmationNumber}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(booking.totalAmount, booking.currency)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Trip Information */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Trip Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-600">
                            {formatDate(booking.bookingDetails?.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-600">
                            {booking.bookingDetails?.days || 1} day(s)
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-600">
                            {booking.bookingDetails?.passengers || 1} passengers
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Car className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-600 capitalize">
                            {booking.bookingDetails?.vehicleType || 'Vehicle'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location Information */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Location Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-start text-sm">
                          <MapPin className="w-4 h-4 text-slate-500 mr-2 mt-0.5" />
                          <div>
                            <span className="text-slate-600 font-medium">Pickup:</span>
                            <p className="text-slate-600">
                              {booking.bookingDetails?.pickupLocation || 'Not specified'}
                            </p>
                          </div>
                        </div>
                        {booking.bookingDetails?.dropoffLocation && (
                          <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 text-slate-500 mr-2 mt-0.5" />
                            <div>
                              <span className="text-slate-600 font-medium">Drop-off:</span>
                              <p className="text-slate-600">
                                {booking.bookingDetails.dropoffLocation}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 mr-2">Distance:</span>
                          <span className="text-slate-600">
                            {booking.bookingDetails?.estimatedDistance || 0} km
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 mr-2">Rate:</span>
                          <span className="text-slate-600">
                            {formatCurrency(booking.bookingDetails?.pricingPerKm || 0)}/km
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Customer Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="text-slate-500 mr-2">Name:</span>
                          <span className="text-slate-600">
                            {booking.contactInfo?.firstName || 'N/A'} {booking.contactInfo?.lastName || ''}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-600">
                            {booking.contactInfo?.email || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-slate-600">
                            {booking.contactInfo?.phone || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  {booking.paymentDetails && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Payment Information</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-slate-600">
                            Status: <span className="font-medium">{booking.paymentDetails.paymentStatus}</span>
                          </span>
                          {booking.paymentDetails.transactionId && (
                            <span className="text-sm text-slate-600">
                              Transaction: <span className="font-medium">{booking.paymentDetails.transactionId}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-slate-500">
                          {formatDate(booking.paymentDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportTrips;
