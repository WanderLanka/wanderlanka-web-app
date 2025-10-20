import { useEffect, useState } from 'react';

// Mock API for demonstration
const bookingsAPI = {
  getProviderBookings: async (type) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return {
      data: [
        {
          bookingId: 'BK001',
          serviceName: 'Ocean View Villa',
          status: 'confirmed',
          contactInfo: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            phone: '+94 77 123 4567'
          },
          bookingDetails: {
            checkInDate: '2025-11-01',
            checkOutDate: '2025-11-05',
            nights: 4,
            roomBreakdown: [
              { quantity: 1, roomType: 'Deluxe Suite' },
              { quantity: 1, roomType: 'Standard Room' }
            ]
          },
          totalAmount: 75000,
          createdAt: '2025-10-15T10:30:00Z',
          updatedAt: '2025-10-16T14:20:00Z'
        },
        {
          bookingId: 'BK002',
          serviceName: 'Mountain Retreat',
          status: 'pending',
          contactInfo: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@example.com',
            phone: '+94 71 987 6543'
          },
          bookingDetails: {
            checkInDate: '2025-10-25',
            checkOutDate: '2025-10-28',
            nights: 3,
            roomBreakdown: [
              { quantity: 2, roomType: 'Family Room' }
            ]
          },
          totalAmount: 45000,
          createdAt: '2025-10-18T09:15:00Z',
          updatedAt: '2025-10-18T09:15:00Z'
        },
        {
          bookingId: 'BK003',
          serviceName: 'City Center Hotel',
          status: 'completed',
          contactInfo: {
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'mbrown@example.com',
            phone: '+94 76 555 8888'
          },
          bookingDetails: {
            checkInDate: '2025-10-10',
            checkOutDate: '2025-10-12',
            nights: 2,
            roomBreakdown: [
              { quantity: 1, roomType: 'Executive Suite' }
            ]
          },
          totalAmount: 35000,
          createdAt: '2025-10-05T16:45:00Z',
          updatedAt: '2025-10-13T11:00:00Z'
        }
      ]
    };
  }
};

// Mock components
const Button = ({ children, variant, size, onClick, className }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
  const variantClasses = variant === 'outline' 
    ? 'border-2 border-slate-300 bg-white text-slate-700' 
    : 'bg-blue-600 text-white';
  const sizeClasses = size === 'sm' ? 'text-sm px-3 py-1.5' : '';
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-lg shadow-md border border-slate-200 ${className}`}>
    {children}
  </div>
);

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center space-x-2 text-sm">
    {items.map((item, i) => (
      <div key={i} className="flex items-center">
        {i > 0 && <span className="mx-2 text-slate-400">/</span>}
        {item.isHome && (
          <svg className="w-4 h-4 mr-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )}
        <span className={item.isActive ? 'text-blue-600 font-medium' : 'text-slate-600'}>
          {item.label}
        </span>
      </div>
    ))}
  </nav>
);

export default function ProviderBookings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingsAPI.getProviderBookings('accommodation');
      const list = res?.data || [];
      setData(list);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fmt = (d) => d ? new Date(d).toLocaleDateString() : '-';
  const fmtTime = (d) => d ? new Date(d).toLocaleString() : '-';

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb 
            items={[
              { label: 'Dashboard', path: '/accommodation', isHome: true }, 
              { label: 'Accommodation' }, 
              { label: 'Bookings', isActive: true }
            ]} 
          />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">My Accommodation Bookings</h1>
              <p className="text-slate-600 mt-1">Manage and view all bookings for your accommodations</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={load}
              className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 font-medium">Loading bookings...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Bookings</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No bookings found</h3>
            <p className="text-slate-600">You don't have any accommodation bookings yet.</p>
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && !error && data.length > 0 && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                    <p className="text-2xl font-bold text-slate-900">{data.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Confirmed</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {data.filter(b => b.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {data.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-900">
                      LKR {data.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.map(booking => (
                <Card key={booking.bookingId} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{booking.serviceName}</h3>
                        <p className="text-sm text-slate-500">Booking ID: {booking.bookingId}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status?.toUpperCase()}
                    </span>
                  </div>

                  {/* Guest Information */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Guest Information</h4>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{booking.contactInfo?.firstName} {booking.contactInfo?.lastName}</span>
                      </p>
                      <p className="text-sm text-slate-600">{booking.contactInfo?.email}</p>
                      <p className="text-sm text-slate-600">{booking.contactInfo?.phone}</p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Booking Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Check-in:</span>
                        <span className="font-medium text-slate-800">{fmt(booking.bookingDetails?.checkInDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Check-out:</span>
                        <span className="font-medium text-slate-800">{fmt(booking.bookingDetails?.checkOutDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Nights:</span>
                        <span className="font-medium text-slate-800">{booking.bookingDetails?.nights || '-'}</span>
                      </div>
                      {Array.isArray(booking.bookingDetails?.roomBreakdown) && booking.bookingDetails.roomBreakdown.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Rooms:</span>
                          <span className="font-medium text-slate-800">
                            {booking.bookingDetails.roomBreakdown.map((r, i) => `${r.quantity}x ${r.roomType}`).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Total Amount:</span>
                      <span className="text-lg font-bold text-green-900">
                        LKR {Number(booking.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Created: {fmtTime(booking.createdAt)}</span>
                      <span>Updated: {fmtTime(booking.updatedAt)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}