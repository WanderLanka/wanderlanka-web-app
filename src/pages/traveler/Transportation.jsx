import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Users, Car, Fuel, Shield, Clock } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const Transportation = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicleType, setVehicleType] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');

    // Mock data for transportation
    const mockTransportation = useMemo(() => [
        {
            id: 6,
            name: 'Private Car with Driver',
            provider: 'Island Tours',
            location: 'Colombo, Sri Lanka',
            rating: 4.6,
            reviews: 156,
            price: 45,
            priceUnit: 'day',
            image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800',
            features: ['A/C', 'English Speaking', 'Fuel Included', 'Insurance'],
            availability: 'Available',
            description: 'Comfortable private transportation with experienced driver',
            vehicleType: 'Car',
            capacity: 4
        },
        {
            id: 7,
            name: 'Luxury SUV Service',
            provider: 'Premium Transport',
            location: 'Kandy, Sri Lanka',
            rating: 4.8,
            reviews: 89,
            price: 75,
            priceUnit: 'day',
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
            features: ['Luxury Interior', 'WiFi', 'Refreshments', 'Professional Driver'],
            availability: 'Available',
            description: 'Premium SUV service for comfortable long-distance travel',
            vehicleType: 'SUV',
            capacity: 6
        },
        {
            id: 8,
            name: 'Airport Transfer Service',
            provider: 'Quick Transfer',
            location: 'Colombo Airport, Sri Lanka',
            rating: 4.4,
            reviews: 234,
            price: 25,
            priceUnit: 'trip',
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
            features: ['24/7 Service', 'Flight Tracking', 'Meet & Greet', 'Fixed Price'],
            availability: 'Available',
            description: 'Reliable airport transfer service with flight monitoring',
            vehicleType: 'Sedan',
            capacity: 3
        },
        {
            id: 9,
            name: 'Mini Bus for Groups',
            provider: 'Group Travel Co',
            location: 'Galle, Sri Lanka',
            rating: 4.5,
            reviews: 67,
            price: 120,
            priceUnit: 'day',
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
            features: ['Large Capacity', 'A/C', 'Tour Guide Available', 'Comfortable Seats'],
            availability: 'Limited',
            description: 'Perfect for group travel and sightseeing tours',
            vehicleType: 'Bus',
            capacity: 15
        },
        {
            id: 10,
            name: 'Motorcycle Rental',
            provider: 'Bike Adventures',
            location: 'Ella, Sri Lanka',
            rating: 4.3,
            reviews: 145,
            price: 15,
            priceUnit: 'day',
            image: 'https://images.unsplash.com/photo-1558618047-fcd1c85cd64c?w=800',
            features: ['Helmet Included', 'GPS Navigation', 'Roadside Assistance', 'Insurance'],
            availability: 'Available',
            description: 'Explore Sri Lanka on two wheels with our well-maintained bikes',
            vehicleType: 'Motorcycle',
            capacity: 2
        },
        {
            id: 11,
            name: 'Tuk-Tuk City Tours',
            provider: 'Local Adventures',
            location: 'Colombo, Sri Lanka',
            rating: 4.7,
            reviews: 198,
            price: 20,
            priceUnit: 'hour',
            image: 'https://images.unsplash.com/photo-1605649487212-47bdaf2ad291?w=800',
            features: ['Local Driver', 'City Tour Guide', 'Photo Stops', 'Cultural Experience'],
            availability: 'Available',
            description: 'Authentic Sri Lankan experience with tuk-tuk city tours',
            vehicleType: 'Tuk-Tuk',
            capacity: 3
        }
    ], []);

    const vehicleTypes = useMemo(() => [
        { key: 'all', label: 'All Vehicles' },
        { key: 'Car', label: 'Cars' },
        { key: 'SUV', label: 'SUVs' },
        { key: 'Bus', label: 'Buses' },
        { key: 'Motorcycle', label: 'Motorcycles' },
        { key: 'Tuk-Tuk', label: 'Tuk-Tuks' }
    ], []);

    const priceRanges = useMemo(() => [
        { key: 'all', label: 'All Prices' },
        { key: 'budget', label: 'Under $30', min: 0, max: 30 },
        { key: 'mid', label: '$30 - $70', min: 30, max: 70 },
        { key: 'premium', label: 'Over $70', min: 70, max: 1000 }
    ], []);

    const filteredTransportation = useMemo(() => {
        let filtered = mockTransportation;
        
        if (searchTerm) {
            filtered = filtered.filter(transport =>
                transport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transport.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transport.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transport.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
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
    }, [mockTransportation, searchTerm, vehicleType, priceFilter, priceRanges]);

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
                            key={transport.id}
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
                                        {transport.vehicleType}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{transport.name}</h3>
                                <p className="text-sm text-slate-600 mb-3">{transport.provider}</p>
                                
                                <div className="flex items-center text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{transport.location}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-sm font-medium text-slate-700">
                                            {transport.rating}
                                        </span>
                                        <span className="text-sm text-slate-500 ml-1">
                                            ({transport.reviews} reviews)
                                        </span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <Users className="w-4 h-4 mr-1" />
                                        <span className="text-sm">{transport.capacity} seats</span>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {transport.description}
                                </p>

                                {/* Features */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {transport.features.slice(0, 3).map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {transport.features.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                                +{transport.features.length - 3} more
                                            </span>
                                        )}
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
                                            onClick={() => navigate(`/user/transportation/${transport.id}`)}
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
            </div>
            <TravelerFooter />
        </div>
    );
};

export default Transportation;