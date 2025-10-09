import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const Accommodations = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [ratingFilter, setRatingFilter] = useState('all');

    // Mock data for accommodations
    const mockAccommodations = useMemo(() => [
        {
            id: 1,
            name: 'Luxury Beach Resort',
            provider: 'Paradise Hotels',
            location: 'Mirissa, Sri Lanka',
            rating: 4.8,
            reviews: 324,
            price: 150,
            priceUnit: 'night',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
            features: ['Pool', 'Spa', 'Beach Access', 'WiFi', 'Restaurant'],
            availability: 'Available',
            description: 'Stunning beachfront resort with world-class amenities',
            type: 'Resort'
        },
        {
            id: 2,
            name: 'Mountain View Hotel',
            provider: 'Hill Country Hotels',
            location: 'Kandy, Sri Lanka',
            rating: 4.6,
            reviews: 198,
            price: 80,
            priceUnit: 'night',
            image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800',
            features: ['Mountain View', 'Restaurant', 'WiFi', 'Garden'],
            availability: 'Available',
            description: 'Peaceful hotel with breathtaking mountain views',
            type: 'Hotel'
        },
        {
            id: 3,
            name: 'Eco Lodge Retreat',
            provider: 'Green Stay',
            location: 'Ella, Sri Lanka',
            rating: 4.5,
            reviews: 156,
            price: 60,
            priceUnit: 'night',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800',
            features: ['Eco-friendly', 'Organic Meals', 'Hiking', 'WiFi'],
            availability: 'Available',
            description: 'Sustainable accommodation in the hill country',
            type: 'Lodge'
        },
        {
            id: 4,
            name: 'City Center Inn',
            provider: 'Urban Hotels',
            location: 'Colombo, Sri Lanka',
            rating: 4.2,
            reviews: 89,
            price: 45,
            priceUnit: 'night',
            image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
            features: ['Central Location', 'Business Center', 'WiFi', 'Parking'],
            availability: 'Limited',
            description: 'Modern hotel in the heart of Colombo',
            type: 'Hotel'
        },
        {
            id: 5,
            name: 'Safari Camp',
            provider: 'Wildlife Lodges',
            location: 'Yala, Sri Lanka',
            rating: 4.7,
            reviews: 234,
            price: 120,
            priceUnit: 'night',
            image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c11a?w=800',
            features: ['Safari Access', 'Wildlife Views', 'Restaurant', 'Guide Service'],
            availability: 'Available',
            description: 'Unique safari experience with wildlife viewing',
            type: 'Camp'
        }
    ], []);

    const priceRanges = useMemo(() => [
        { key: 'all', label: 'All Prices' },
        { key: 'budget', label: 'Under $50', min: 0, max: 50 },
        { key: 'mid', label: '$50 - $100', min: 50, max: 100 },
        { key: 'luxury', label: 'Over $100', min: 100, max: 1000 }
    ], []);

    const filteredAccommodations = useMemo(() => {
        let filtered = mockAccommodations;
        
        if (searchTerm) {
            filtered = filtered.filter(acc =>
                acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                acc.provider.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (priceFilter !== 'all') {
            const range = priceRanges.find(r => r.key === priceFilter);
            if (range) {
                filtered = filtered.filter(acc => acc.price >= range.min && acc.price <= range.max);
            }
        }

        if (ratingFilter !== 'all') {
            const minRating = parseFloat(ratingFilter);
            filtered = filtered.filter(acc => acc.rating >= minRating);
        }
        
        return filtered;
    }, [mockAccommodations, searchTerm, priceFilter, ratingFilter, priceRanges]);

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
                            { label: 'Accommodations', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Accommodations</h1>
                    <p className="text-lg text-slate-600">Find the perfect hotels, resorts, and stays for your Sri Lankan adventure</p>
                </div>

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

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-4">
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

                        {/* Rating Filter */}
                        <div className="flex flex-wrap gap-2">
                            {['all', '4.0', '4.5'].map((rating) => (
                                <Button
                                    key={rating}
                                    onClick={() => setRatingFilter(rating)}
                                    variant={ratingFilter === rating ? 'primary' : 'outline'}
                                    size="sm"
                                    className="flex items-center"
                                >
                                    <Star className="w-3 h-3 mr-1" />
                                    {rating === 'all' ? 'All Ratings' : `${rating}+`}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Accommodations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAccommodations.map((accommodation) => (
                        <Card
                            key={accommodation.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            hover={true}
                            padding="none"
                        >
                            <div className="relative">
                                <img
                                    src={accommodation.image}
                                    alt={accommodation.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(accommodation.availability)}`}>
                                        {accommodation.availability}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
                                    <span className="text-sm font-medium text-slate-700">
                                        {accommodation.type}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{accommodation.name}</h3>
                                <p className="text-sm text-slate-600 mb-3">{accommodation.provider}</p>
                                
                                <div className="flex items-center text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{accommodation.location}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-sm font-medium text-slate-700">
                                            {accommodation.rating}
                                        </span>
                                        <span className="text-sm text-slate-500 ml-1">
                                            ({accommodation.reviews} reviews)
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {accommodation.description}
                                </p>

                                {/* Features */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {accommodation.features.slice(0, 3).map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {accommodation.features.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                                +{accommodation.features.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div>
                                        <span className="text-2xl font-bold text-slate-800">
                                            ${accommodation.price}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            /{accommodation.priceUnit}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate(`/user/accommodations/${accommodation.id}`)}
                                        >
                                            Details
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            disabled={accommodation.availability === 'Unavailable'}
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
                                setPriceFilter('all');
                                setRatingFilter('all');
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

export default Accommodations;