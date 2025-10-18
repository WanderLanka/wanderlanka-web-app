import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Loader2 } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import { accommodationAPI } from '../../services/api';

const Accommodations = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [accommodations, setAccommodations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAccommodations();
    }, []);

    const fetchAccommodations = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await accommodationAPI.getAll();
            setAccommodations(response || []);
        } catch (err) {
            setError('Failed to load accommodations. Please try again.');
            console.error('Error fetching accommodations:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAccommodations = useMemo(() => {
        let filtered = accommodations || [];
        
        if (searchTerm) {
            filtered = filtered.filter(acc =>
                acc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.accommodationType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [accommodations, searchTerm]);

    const getAvailabilityColor = (availability) => {
        if (!availability) return 'bg-green-100 text-green-700'; // Default to available
        
        switch (availability.toLowerCase()) {
            case 'available': 
            case 'active': 
                return 'bg-green-100 text-green-700';
            case 'limited': 
                return 'bg-yellow-100 text-yellow-700';
            case 'unavailable': 
            case 'inactive': 
                return 'bg-red-100 text-red-700';
            default: 
                return 'bg-green-100 text-green-700'; // Default to available
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
                            { label: 'Services'},
                            { label: 'Accommodations', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Accommodations</h1>
                    <p className="text-lg text-slate-600 mb-2">Find the perfect hotels, resorts, and stays for your Sri Lankan adventure</p>
                    {!loading && !error && (
                        <p className="text-sm text-slate-500">
                            Showing {filteredAccommodations.length} of {accommodations.length} accommodations
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-slate-600">Loading accommodations...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="text-red-800 font-medium mb-2">Error Loading Accommodations</div>
                        <div className="text-red-600 mb-4">{error}</div>
                        <Button 
                            onClick={fetchAccommodations}
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

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="max-w-md">
                        <Input
                            type="text"
                            placeholder="Search accommodations, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            icon={Search}
                        />
                    </div>
                </div>

                {/* Accommodations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAccommodations.map((accommodation) => (
                        <Card
                            key={accommodation._id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            hover={true}
                            padding="none"
                        >
                            <div className="relative">
                                {accommodation?.images?.[0] ? (
                                    <img
                                        src={accommodation.images[0]}
                                        alt={accommodation.name}
                                        className="w-full h-48 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                                        <span className="text-gray-600 text-lg">🏨</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(accommodation.status || 'available')}`}>
                                        {accommodation.status === 'active' ? 'Available' : accommodation.status || 'Available'}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
                                    <span className="text-sm font-medium text-slate-700">
                                        {accommodation.accommodationType}
                                    </span>
                                </div>
                                {accommodation?.rating && (
                                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-sm font-medium text-slate-700">{accommodation.rating}</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{accommodation.name}</h3>
                                
                                <div className="flex items-center text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{accommodation.location}</span>
                                </div>

                                <div className="mb-4">
                                    <div className="text-sm text-slate-600 space-y-1">
                                        <p><strong>Total Rooms:</strong> {accommodation.totalRooms}</p>
                                        <p><strong>Check-in:</strong> {accommodation.checkInTime || '14:00'}</p>
                                        <p><strong>Check-out:</strong> {accommodation.checkOutTime || '11:00'}</p>
                                        {accommodation.phone && (
                                            <p><strong>Phone:</strong> {accommodation.phone}</p>
                                        )}
                                        {accommodation.description && (
                                            <p className="text-xs text-slate-500 line-clamp-2">{accommodation.description}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div>
                                        {accommodation?.price ? (
                                            <div>
                                                <span className="text-2xl font-bold text-blue-600">${accommodation.price}</span>
                                                <span className="text-sm text-slate-500">/night</span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-bold text-slate-800">
                                                {accommodation.accommodationType.charAt(0).toUpperCase() + accommodation.accommodationType.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate(`/user/accommodations/${accommodation._id}`)}
                                        >
                                            Details
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            disabled={accommodation.status === 'inactive'}
                                            onClick={() => navigate(`/user/accommodations/${accommodation._id}`)}
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredAccommodations.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🏨</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No accommodations found</h3>
                        <p className="text-slate-500">
                            No accommodations match your current filters.
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm('');
                            }}
                        >
                            Clear Search
                        </Button>
                    </div>
                )}
                </>
                )}
            </div>
            <TravelerFooter />
        </div>
    );
};

export default Accommodations;