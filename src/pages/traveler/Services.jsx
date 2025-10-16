import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MapPin, Star, Users, Clock, Camera, Car, Home, Compass } from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const Services = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Get category from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam && ['accommodation', 'transport', 'guide'].includes(categoryParam)) {
            setActiveCategory(categoryParam);
        }
    }, [location.search]);

    // Mock data for services
    const mockServices = useMemo(() => [
        {
            id: 1,
            category: 'accommodation',
            name: 'Luxury Beach Resort',
            provider: 'Paradise Hotels',
            location: 'Mirissa, Sri Lanka',
            rating: 4.8,
            reviews: 324,
            price: 150,
            priceUnit: 'night',
            image: '/api/placeholder/300/200',
            features: ['Pool', 'Spa', 'Beach Access', 'WiFi'],
            availability: 'Available',
            description: 'Stunning beachfront resort with world-class amenities'
        },
        {
            id: 2,
            category: 'transport',
            name: 'Private Car with Driver',
            provider: 'Island Tours',
            location: 'Colombo, Sri Lanka',
            rating: 4.6,
            reviews: 156,
            price: 45,
            priceUnit: 'day',
            image: '/api/placeholder/300/200',
            features: ['A/C', 'English Speaking', 'Fuel Included'],
            availability: 'Available',
            description: 'Comfortable private transportation with experienced driver'
        },
        {
            id: 3,
            category: 'experience',
            name: 'Wildlife Safari Adventure',
            provider: 'Safari Experts',
            location: 'Yala National Park',
            rating: 4.9,
            reviews: 89,
            price: 75,
            priceUnit: 'person',
            image: '/api/placeholder/300/200',
            features: ['4WD Vehicle', 'Professional Guide', 'Lunch Included'],
            availability: 'Limited',
            description: 'Experience Sri Lankan wildlife in their natural habitat'
        },
        {
            id: 4,
            category: 'guide',
            name: 'Cultural Heritage Tour Guide',
            provider: 'Heritage Walks',
            location: 'Kandy, Sri Lanka',
            rating: 4.7,
            reviews: 203,
            price: 35,
            priceUnit: 'hour',
            image: '/api/placeholder/300/200',
            features: ['Multi-lingual', 'Licensed', 'Historical Expert'],
            availability: 'Available',
            description: 'Expert guide for cultural sites and historical landmarks'
        },
        {
            id: 5,
            category: 'accommodation',
            name: 'Eco Lodge Retreat',
            provider: 'Green Stay',
            location: 'Ella, Sri Lanka',
            rating: 4.5,
            reviews: 78,
            price: 80,
            priceUnit: 'night',
            image: '/api/placeholder/300/200',
            features: ['Eco-friendly', 'Mountain Views', 'Organic Meals'],
            availability: 'Available',
            description: 'Sustainable accommodation in the hill country'
        },
        {
            id: 6,
            category: 'experience',
            name: 'Tea Plantation Tour',
            provider: 'Ceylon Tea Tours',
            location: 'Nuwara Eliya, Sri Lanka',
            rating: 4.4,
            reviews: 145,
            price: 25,
            priceUnit: 'person',
            image: '/api/placeholder/300/200',
            features: ['Factory Visit', 'Tea Tasting', 'Local Guide'],
            availability: 'Available',
            description: 'Discover the art of Ceylon tea making'
        }
    ], []);

    const categories = [
        { key: 'all', label: 'All Services', icon: Compass },
        { key: 'accommodation', label: 'Hotels', icon: Home },
        { key: 'transport', label: 'Transport', icon: Car },
        { key: 'experience', label: 'Experiences', icon: Camera },
        { key: 'guide', label: 'Tour Guides', icon: Users }
    ];

    const filteredServices = useMemo(() => {
        let filtered = mockServices;
        
        if (activeCategory !== 'all') {
            filtered = filtered.filter(service => service.category === activeCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.provider.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [mockServices, activeCategory, searchTerm]);

    const getCategoryInfo = () => {
        switch (activeCategory) {
            case 'accommodation':
                return {
                    title: 'Accommodation Services',
                    description: 'Find the perfect hotels, resorts, and stays for your Sri Lankan adventure'
                };
            case 'transport':
                return {
                    title: 'Transportation Services', 
                    description: 'Comfortable and reliable transportation options across Sri Lanka'
                };
            case 'guide':
                return {
                    title: 'Tour Guide Services',
                    description: 'Expert local guides to enhance your travel experience'
                };
            default:
                return {
                    title: 'Services',
                    description: 'Discover amazing travel services and experiences'
                };
        }
    };

    const categoryInfo = getCategoryInfo();

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
                            { label: 'Services', isActive: true }
                        ]} 
                    />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{categoryInfo.title}</h1>
                    <p className="text-lg text-slate-600">{categoryInfo.description}</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="max-w-md">
                        <Input
                            type="text"
                            placeholder="Search services, locations, or providers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                            icon={Search}
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Button
                                key={category.key}
                                onClick={() => {
                                    setActiveCategory(category.key);
                                    // Update URL without page reload
                                    if (category.key === 'all') {
                                        navigate('/user/services', { replace: true });
                                    } else {
                                        navigate(`/user/services?category=${category.key}`, { replace: true });
                                    }
                                }}
                                variant={activeCategory === category.key ? 'primary' : 'outline'}
                                size="md"
                                className="flex items-center"
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {category.label}
                                <span className="ml-2 text-sm">
                                    ({category.key === 'all' 
                                        ? mockServices.length 
                                        : mockServices.filter(s => s.category === category.key).length})
                                </span>
                            </Button>
                        );
                    })}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <Card
                            key={service.id}
                            className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            hover={true}
                            padding="none"
                        >
                            <div className="relative">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(service.availability)}`}>
                                        {service.availability}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-1">
                                    <span className="text-sm font-medium text-slate-700 capitalize">
                                        {service.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.name}</h3>
                                <p className="text-sm text-slate-600 mb-3">{service.provider}</p>
                                
                                <div className="flex items-center text-slate-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span className="text-sm">{service.location}</span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-sm font-medium text-slate-700">
                                            {service.rating}
                                        </span>
                                        <span className="text-sm text-slate-500 ml-1">
                                            ({service.reviews} reviews)
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {service.description}
                                </p>

                                {/* Features */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {service.features.slice(0, 3).map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                        {service.features.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                                                +{service.features.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                    <div>
                                        <span className="text-2xl font-bold text-slate-800">
                                            ${service.price}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            /{service.priceUnit}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate(`/user/services/${service.id}`)}
                                        >
                                            Details
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            disabled={service.availability === 'Unavailable'}
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No services found</h3>
                        <p className="text-slate-500">
                            {searchTerm 
                                ? `No services match "${searchTerm}" in the ${activeCategory === 'all' ? 'selected' : activeCategory} category.`
                                : `No services available in the ${activeCategory} category.`
                            }
                        </p>
                        <Button
                            variant="primary"
                            size="md"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm('');
                                setActiveCategory('all');
                                navigate('/user/services', { replace: true });
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

export default Services;