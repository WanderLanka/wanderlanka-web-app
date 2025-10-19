import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Phone, Mail, DollarSign, Loader2 } from 'lucide-react';
import { Button, Card, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import { bookingsAPI } from '../../services/api';

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                
                console.log('Fetching bookings for user ID:', userId);
                const response = await bookingsAPI.getUserBookings();
                console.log('Bookings API Response:', response);
                
                // Transform API response to match our component structure
                const transformedBookings = (response.data || response || []).map(booking => ({
                    id: booking._id || booking.id,
                    type: booking.serviceType || booking.type,
                    title: booking.serviceName || booking.title,
                    location: booking.serviceProvider || booking.location,
                    dates: booking.bookingDetails || booking.dates,
                    guests: booking.bookingDetails?.adults || booking.guests,
                    passengers: booking.bookingDetails?.passengers || booking.passengers,
                    participants: booking.bookingDetails?.groupSize || booking.participants,
                    price: booking.totalAmount || booking.price,
                    status: booking.status || 'confirmed',
                    image: booking.image || '/api/placeholder/300/200',
                    bookingRef: booking.bookingReference || booking.bookingRef || `REF${booking._id?.slice(-6) || '000000'}`
                }));
                
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

                        {/* Bookings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filterBookings(activeTab).map((booking) => (
                        <Card
                            key={booking.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            hover={true}
                            padding="none"
                        >
                            <img
                                src={booking.image}
                                alt={booking.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-blue-600 capitalize">
                                        {booking.type}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2">{booking.title}</h3>
                                <div className="flex items-center text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{booking.location}</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {booking.dates.checkIn && (
                                        <div className="flex items-center text-slate-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {new Date(booking.dates.checkIn).toLocaleDateString()} - {new Date(booking.dates.checkOut).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {booking.dates.date && (
                                        <div className="flex items-center text-slate-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {new Date(booking.dates.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {booking.guests && (
                                        <div className="flex items-center text-slate-600">
                                            <Users className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{booking.guests} guests</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div>
                                        <span className="text-2xl font-bold text-slate-800">{booking.price}</span>
                                        <p className="text-sm text-slate-500">Ref: {booking.bookingRef}</p>
                                    </div>
                                    <Button variant="primary" size="sm">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
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
            <TravelerFooter />
        </div>
    );
};

export default MyBookings;