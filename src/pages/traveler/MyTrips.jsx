import { useState, useMemo } from 'react';
import { Calendar, MapPin, Clock, Users, Camera, Star, Plus } from 'lucide-react';
import { Button, Card, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const MyTrips = () => {
    const [activeTab, setActiveTab] = useState('upcoming');

    // Mock data for trips
    const mockTrips = useMemo(() => ({
        upcoming: [
            {
                id: 1,
                title: 'Cultural Heritage Tour',
                destination: 'Sri Lanka',
                startDate: '2024-01-15',
                endDate: '2024-01-25',
                duration: '10 days',
                travelers: 2,
                image: '/api/placeholder/400/250',
                progress: 75,
                highlights: ['Sigiriya Rock', 'Temple of Tooth', 'Galle Fort'],
                totalCost: '$1,250',
                status: 'confirmed'
            },
            {
                id: 2,
                title: 'Beach & Wildlife Safari',
                destination: 'Sri Lanka',
                startDate: '2024-03-10',
                endDate: '2024-03-18',
                duration: '8 days',
                travelers: 4,
                image: '/api/placeholder/400/250',
                progress: 35,
                highlights: ['Yala National Park', 'Mirissa Beach', 'Whale Watching'],
                totalCost: '$2,100',
                status: 'planning'
            }
        ],
        completed: [
            {
                id: 3,
                title: 'Hill Country Adventure',
                destination: 'Sri Lanka',
                startDate: '2023-12-01',
                endDate: '2023-12-10',
                duration: '9 days',
                travelers: 2,
                image: '/api/placeholder/400/250',
                rating: 5,
                highlights: ['Ella Rock', 'Tea Plantations', 'Nine Arch Bridge'],
                totalCost: '$980',
                status: 'completed',
                memories: 24
            }
        ],
        draft: [
            {
                id: 4,
                title: 'Adventure Sports Weekend',
                destination: 'Sri Lanka',
                duration: '3 days',
                travelers: 3,
                image: '/api/placeholder/400/250',
                highlights: ['White Water Rafting', 'Rock Climbing', 'Zip Lining'],
                estimatedCost: '$450',
                status: 'draft'
            }
        ]
    }), []);

    const getProgressColor = (progress) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getStatusBadge = (status) => {
        const badges = {
            confirmed: 'bg-green-100 text-green-700',
            planning: 'bg-blue-100 text-blue-700',
            completed: 'bg-purple-100 text-purple-700',
            draft: 'bg-gray-100 text-gray-700'
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb 
                        items={[
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'My Trips', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">My Trips</h1>
                    <p className="text-lg text-slate-600">Plan, track, and relive your travel adventures</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['upcoming', 'completed', 'draft'].map((tab) => (
                        <Button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            variant={activeTab === tab ? 'primary' : 'outline'}
                            size="md"
                            className="capitalize"
                        >
                            {tab} ({mockTrips[tab].length})
                        </Button>
                    ))}
                    <div className="ml-auto">
                        <Button variant="primary" size="md" className="flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Plan New Trip
                        </Button>
                    </div>
                </div>

                {/* Trips Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockTrips[activeTab].map((trip) => (
                        <Card
                            key={trip.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            hover={true}
                            padding="none"
                        >
                            <div className="relative">
                                <img
                                    src={trip.image}
                                    alt={trip.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(trip.status)}`}>
                                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                                    </span>
                                </div>
                                {trip.progress && (
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-slate-700">Progress</span>
                                                <span className="text-xs font-medium text-slate-700">{trip.progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(trip.progress)}`}
                                                    style={{ width: `${trip.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{trip.title}</h3>
                                <div className="flex items-center text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{trip.destination}</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {trip.startDate && (
                                        <div className="flex items-center text-slate-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                {trip.endDate 
                                                    ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
                                                    : new Date(trip.startDate).toLocaleDateString()
                                                }
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-slate-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{trip.duration}</span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <Users className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{trip.travelers} travelers</span>
                                    </div>
                                    {trip.rating && (
                                        <div className="flex items-center text-slate-600">
                                            <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm">{trip.rating} stars</span>
                                        </div>
                                    )}
                                    {trip.memories && (
                                        <div className="flex items-center text-slate-600">
                                            <Camera className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{trip.memories} photos</span>
                                        </div>
                                    )}
                                </div>

                                {/* Highlights */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-slate-700 mb-2">Highlights</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {trip.highlights.map((highlight, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div>
                                        <span className="text-2xl font-bold text-slate-800">
                                            {trip.totalCost || trip.estimatedCost}
                                        </span>
                                        <p className="text-sm text-slate-500">
                                            {trip.totalCost ? 'Total spent' : 'Estimated cost'}
                                        </p>
                                    </div>
                                    <Button variant="primary" size="sm">
                                        {activeTab === 'completed' ? 'View Memories' : 
                                         activeTab === 'draft' ? 'Continue Planning' : 'View Details'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {mockTrips[activeTab].length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">✈️</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No {activeTab} trips</h3>
                        <p className="text-slate-500">
                            {activeTab === 'upcoming' && "You don't have any upcoming trips planned."}
                            {activeTab === 'completed' && "You haven't completed any trips yet."}
                            {activeTab === 'draft' && "You don't have any draft trips saved."}
                        </p>
                        <Button variant="primary" size="md" className="mt-4">
                            Plan Your First Trip
                        </Button>
                    </div>
                )}
            </div>
            <TravelerFooter />
        </div>
    );
};

export default MyTrips;