import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Users, Car, Fuel, Shield, Clock, Loader2 } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import { transportationAPI } from '../../services/api';

const Transportation = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicleType, setVehicleType] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [transportation, setTransportation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransportation();
    }, []);

    const fetchTransportation = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await transportationAPI.getAll();
            console.log('Transportation API Response:', response);
            setTransportation(response || []);
        } catch (err) {
            setError('Failed to load transportation data. Please try again.');
            console.error('Error fetching transportation:', err);
        } finally {
            setLoading(false);
        }
    };

    const vehicleTypes = useMemo(() => [
        { key: 'all', label: 'All Vehicles' },
        { key: 'car', label: 'Cars' },
        { key: 'van', label: 'Vans' },
        { key: 'bus', label: 'Buses' }
    ], []);

    const priceRanges = useMemo(() => [
        { key: 'all', label: 'All Prices' },
        { key: 'budget', label: 'Under $30', min: 0, max: 30 },
        { key: 'mid', label: '$30 - $70', min: 30, max: 70 },
        { key: 'premium', label: 'Over $70', min: 70, max: 1000 }
    ], []);

    const filteredTransportation = useMemo(() => {
        let filtered = transportation;
        
        if (searchTerm) {
            filtered = filtered.filter(transport =>
                transport.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transport.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transport.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transport.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (vehicleType !== 'all') {
            filtered = filtered.filter(transport => transport.vehicleType === vehicleType);
        }

        if (priceFilter !== 'all') {
            const range = priceRanges.find(r => r.key === priceFilter);
            if (range) {
                filtered = filtered.filter(transport => transport.price >= range.min && transport.price <= range.max);
            }
        }
        
        return filtered;
    }, [transportation, searchTerm, vehicleType, priceFilter, priceRanges]);

    const getAvailabilityColor = (availability) => {
        switch (availability.toLowerCase()) {
            case 'available': return 'bg-green-100 text-green-700';
            case 'limited': return 'bg-yellow-100 text-yellow-700';
            case 'unavailable': return 'bg-red-100 text-red-700';
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
                            { label: 'Services'},
                            { label: 'Transportation', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Transportation</h1>
                    <p className="text-lg text-slate-600">Comfortable and reliable transportation options across Sri Lanka</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-slate-600">Loading transportation options...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="text-red-800 font-medium mb-2">Error Loading Transportation</div>
                        <div className="text-red-600 mb-4">{error}</div>
                        <Button 
                            onClick={fetchTransportation}
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
                            placeholder="Search vehicles, locations, providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            icon={Search}
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {/* Vehicle Type Filter */}
                        <div className="flex flex-wrap gap-2">
                            {vehicleTypes.map((type) => (
                                <Button
                                    key={type.key}
                                    onClick={() => setVehicleType(type.key)}
                                    variant={vehicleType === type.key ? 'primary' : 'outline'}
                                    size="sm"
                                    className="flex items-center"
                                >
                                    <Car className="w-3 h-3 mr-1" />
                                    {type.label}
                                </Button>
                            ))}
                        </div>

                        {/* Price Filter */}
                        <div className="flex flex-wrap gap-2">
                            {priceRanges.map((range) => (
                                <Button
                                    key={range.key}
                                    onClick={() => setPriceFilter(range.key)}
                                    variant={priceFilter === range.key ? 'primary' : 'outline'}
                                    size="sm"
                                >
                                    {range.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transportation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTransportation.map((transport) => (
                        <Card
                            key={transport._id || transport.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            hover={true}
                            padding="none"
                        >
                            <div className="relative">
                                <img
                                    src={transport.image}
                                    alt={transport.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(transport.availability)}`}>
                                        {transport.availability}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
                                    <span className="text-sm font-medium text-slate-700">
                                        {transport.brand} {transport.model}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {transport.vehicleType.charAt(0).toUpperCase() + transport.vehicleType.slice(1)} - {transport.year}
                                </h3>
                                <p className="text-sm text-slate-600 mb-3">License: {transport.licensePlate}</p>
                                
                                <div className="flex items-center text-slate-600 mb-3">
                                    <Car className="w-4 h-4 mr-2" />
                                    <span className="text-sm capitalize">{transport.vehicleType}</span>
                                    <span className="mx-2">•</span>
                                    <Fuel className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{transport.fuelType}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-slate-600">
                                        <Users className="w-4 h-4 mr-1" />
                                        <span className="text-sm">{transport.seats} seats</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 text-slate-600 mr-1" />
                                        <span className="text-sm font-medium text-slate-700">
                                            {transport.availability}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Price per km:</span>
                                        <span className="text-sm font-semibold text-slate-800">
                                            LKR {transport.pricingPerKm.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {transport.ac && (
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                Air Conditioned
                                            </span>
                                        )}
                                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                                            {transport.fuelType}
                                        </span>
                                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full capitalize">
                                            {transport.vehicleType}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div>
                                        <span className="text-2xl font-bold text-slate-800">
                                            ${transport.price}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            /{transport.priceUnit}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate(`/user/transportation/${transport._id || transport.id}`)}
                                        >
                                            Details
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            disabled={transport.availability === 'Unavailable'}
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredTransportation.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No transportation found</h3>
                        <p className="text-slate-500">
                            No transportation options match your current filters.
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm('');
                                setVehicleType('all');
                                setPriceFilter('all');
                            }}
                        >
                            Clear Filters
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

export default Transportation;