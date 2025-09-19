import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, MapPin, Users, Phone, Mail, DollarSign } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [bookings, setBookings] = useState([]);

    // Mock data for bookings
    const mockBookings = useMemo(() => [
        {
            id: 1,
            type: 'accommodation',
            title: 'Heritance Kandalama Hotel',
            location: 'Dambulla, Sri Lanka',
            dates: { checkIn: '2024-01-15', checkOut: '2024-01-20' },
            guests: 2,
            price: '$450',
            status: 'confirmed',
            image: '/api/placeholder/300/200',
            bookingRef: 'HTL001'
        },
        {
            id: 2,
            type: 'transport',
            title: 'Airport Transfer - SUV',
            location: 'Colombo to Hotel',
            dates: { departure: '2024-01-15', arrival: '2024-01-15' },
            passengers: 2,
            price: '$35',
            status: 'confirmed',
            image: '/api/placeholder/300/200',
            bookingRef: 'TRP001'
        },
        {
            id: 3,
            type: 'experience',
            title: 'Sigiriya Rock Climbing Tour',
            location: 'Sigiriya, Sri Lanka',
            dates: { date: '2024-01-16' },
            participants: 2,
            price: '$85',
            status: 'pending',
            image: '/api/placeholder/300/200',
            bookingRef: 'EXP001'
        }
    ], []);

    useEffect(() => {
        setBookings(mockBookings);
    }, [mockBookings]);

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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">My Bookings</h1>
                    <p className="text-lg text-slate-600">Manage and track all your travel bookings</p>
                </div>

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
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No bookings found</h3>
                        <p className="text-slate-500">You don't have any {activeTab === 'all' ? '' : activeTab} bookings yet.</p>
                    </div>
                )}
            </div>
            <TravelerFooter />
        </div>
    );
};

export default MyBookings;