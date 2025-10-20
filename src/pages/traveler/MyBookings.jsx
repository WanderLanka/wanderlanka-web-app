import { useState, useEffect } from 'react';
import { Calendar, Clock, Phone, Mail, DollarSign, Loader2, Eye, MoreHorizontal } from 'lucide-react';
import { Button, Card, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import { bookingsAPI } from '../../services/api';

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Removed viewMode state - only using list/table view

    // Fetch user bookings from API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get user data from localStorage
                const userData = localStorage.getItem('user');
                if (!userData) {
                    setError('User not logged in. Please log in to view your bookings.');
                    setBookings([]);
                    setLoading(false);
                    return;
                }
                
                const parsedUserData = JSON.parse(userData);
                const userId = parsedUserData.id;
                
                if (!userId) {
                    setError('User ID not found. Please log in again.');
                    setBookings([]);
                    setLoading(false);
                    return;
                }
                
                console.log('🔍 [DEBUG] Fetching bookings for user ID:', userId);
                const response = await bookingsAPI.getUserBookings();
                console.log('📦 [DEBUG] Raw Bookings API Response:', response);
                
                // Transform API response to match our component structure
                const transformedBookings = (response.data || response || []).map(booking => {
                    // Determine the primary date based on service type
                    let primaryDate = null;
                    let checkInDate = null;
                    let checkOutDate = null;
                    
                    if (booking.serviceType === 'accommodation') {
                        checkInDate = booking.bookingDetails?.checkInDate;
                        checkOutDate = booking.bookingDetails?.checkOutDate;
                        primaryDate = checkInDate;
                    } else if (booking.serviceType === 'transportation') {
                        primaryDate = booking.bookingDetails?.startDate;
                    } else if (booking.serviceType === 'guide') {
                        primaryDate = booking.bookingDetails?.tourDate;
                    }
                    
                    const transformed = {
                        id: booking._id || booking.id,
                        type: booking.serviceType || booking.type,
                        title: booking.serviceName || booking.title,
                        provider: booking.serviceProvider || booking.provider,
                        location: booking.bookingDetails?.location || booking.location,
                        dates: {
                            checkIn: checkInDate,
                            checkOut: checkOutDate,
                            startDate: booking.bookingDetails?.startDate,
                            tourDate: booking.bookingDetails?.tourDate,
                            date: primaryDate // Primary date for display
                        },
                        guests: booking.bookingDetails?.adults || booking.guests,
                        passengers: booking.bookingDetails?.passengers || booking.passengers,
                        participants: booking.bookingDetails?.groupSize || booking.participants,
                        price: booking.totalAmount || booking.price || 0,
                        currency: booking.currency || 'LKR',
                        status: booking.status || 'confirmed',
                        image: booking.image || '/api/placeholder/300/200',
                        bookingRef: booking.bookingId || booking.confirmationNumber || `REF${booking._id?.slice(-6) || '000000'}`,
                        // Store full booking data for modal
                        fullBookingData: booking
                    };
                    
                    return transformed;
                });
                setBookings(transformedBookings);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
                setError('Failed to load your bookings. Please try again.');
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filterBookings = (status) => {
        if (status === 'all') return bookings;
        return bookings.filter(booking => booking.status === status);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const openBookingModal = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const closeBookingModal = () => {
        setSelectedBooking(null);
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb 
                        items={[
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'My Bookings', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">My Bookings</h1>
                    <p className="text-lg text-slate-600">Manage and track all your travel bookings</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-slate-600">Loading your bookings...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="text-red-800 font-medium mb-2">Error Loading Bookings</div>
                        <div className="text-red-600 mb-4">{error}</div>
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Content - only show when not loading and no error */}
                {!loading && !error && (
                    <>
                        {/* Filter Tabs */}
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-2">
                                {['all', 'confirmed', 'pending', 'cancelled'].map((tab) => (
                                    <Button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        variant={activeTab === tab ? 'primary' : 'outline'}
                                        size="md"
                                        className="capitalize"
                                    >
                                        {tab === 'all' ? 'All Bookings' : tab}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Bookings Display - List/Table View Only */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Service Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Provider
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Dates
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {filterBookings(activeTab).map((booking) => {
                                            return (
                                                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-slate-900 capitalize">
                                                            {booking.type}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {booking.title}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-600">
                                                            {booking.provider || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                        {booking.dates?.checkIn ? (
                                                            <div>
                                                                <div className="font-medium">{new Date(booking.dates.checkIn).toLocaleDateString()}</div>
                                                                <div className="text-xs text-slate-400">
                                                                    Check-out: {new Date(booking.dates.checkOut).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        ) : booking.dates?.startDate ? (
                                                            <div>
                                                                <div className="font-medium">{new Date(booking.dates.startDate).toLocaleDateString()}</div>
                                                                <div className="text-xs text-slate-400">
                                                                    {booking.dates?.days || 1} day(s)
                                                                </div>
                                                            </div>
                                                        ) : booking.dates?.tourDate ? (
                                                            <div>
                                                                <div className="font-medium">{new Date(booking.dates.tourDate).toLocaleDateString()}</div>
                                                                <div className="text-xs text-slate-400">
                                                                    Tour booking
                                                                </div>
                                                            </div>
                                                        ) : booking.dates?.date ? (
                                                            <div className="font-medium">{new Date(booking.dates.date).toLocaleDateString()}</div>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {booking.currency || 'LKR'} {booking.price?.toLocaleString() || '0'}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            Ref: {booking.bookingRef}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => openBookingModal(booking)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View booking details"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {filterBookings(activeTab).length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">No current bookings</h3>
                                <p className="text-slate-500">
                                    {activeTab === 'all' 
                                        ? "You don't have any bookings yet. Start planning your trip!" 
                                        : `You don't have any ${activeTab} bookings.`
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Booking Details Modal */}
            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Booking Details</h2>
                                <button
                                    onClick={closeBookingModal}
                                    className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Booking Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Basic Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Service Type</label>
                                            <p className="text-slate-800 capitalize">{selectedBooking.type}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Service Name</label>
                                            <p className="text-slate-800">{selectedBooking.title}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Provider</label>
                                            <p className="text-slate-800">{selectedBooking.provider || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Location</label>
                                            <p className="text-slate-800">{selectedBooking.location || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Status</label>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                                                {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Booking Reference</label>
                                            <p className="text-slate-800 font-mono">{selectedBooking.bookingRef}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates and Pricing */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Dates & Pricing</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Dates</label>
                                            <div className="text-slate-800">
                                                {selectedBooking.dates?.checkIn ? (
                                                    <div>
                                                        <div>Check-in: {new Date(selectedBooking.dates.checkIn).toLocaleDateString()}</div>
                                                        <div>Check-out: {new Date(selectedBooking.dates.checkOut).toLocaleDateString()}</div>
                                                    </div>
                                                ) : selectedBooking.dates?.date ? (
                                                    <div>Date: {new Date(selectedBooking.dates.date).toLocaleDateString()}</div>
                                                ) : selectedBooking.dates?.startDate ? (
                                                    <div>Start Date: {new Date(selectedBooking.dates.startDate).toLocaleDateString()}</div>
                                                ) : selectedBooking.dates?.tourDate ? (
                                                    <div>Tour Date: {new Date(selectedBooking.dates.tourDate).toLocaleDateString()}</div>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-500">Total Price</label>
                                            <p className="text-slate-800 text-xl font-bold">LKR {selectedBooking.price}</p>
                                        </div>
                                        {selectedBooking.guests && (
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Guests</label>
                                                <p className="text-slate-800">{selectedBooking.guests} guests</p>
                                            </div>
                                        )}
                                        {selectedBooking.passengers && (
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Passengers</label>
                                                <p className="text-slate-800">{selectedBooking.passengers} passengers</p>
                                            </div>
                                        )}
                                        {selectedBooking.participants && (
                                            <div>
                                                <label className="text-sm font-medium text-slate-500">Participants</label>
                                                <p className="text-slate-800">{selectedBooking.participants} participants</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        // TODO: Implement cancel booking functionality
                                        console.log('Cancel booking:', selectedBooking.id);
                                        alert('Cancel booking functionality will be implemented');
                                    }}
                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                    Cancel Booking
                                </Button>
                                <Button variant="outline" onClick={closeBookingModal}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <TravelerFooter />
        </div>
    );
};

export default MyBookings;