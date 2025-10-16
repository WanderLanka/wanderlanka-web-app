import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Star, 
    MapPin, 
    CheckCircle,
    Plus,
    Minus,
    Heart,
    Share2,
    Users,
    Clock,
    Calendar,
    Car,
    Home,
    Award,
    Languages,
    Globe,
    Wifi,
    Coffee,
    Camera
} from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [bookingData, setBookingData] = useState({
        date: '',
        endDate: '',
        adults: 1,
        children: 0,
        rooms: 1
    });

    // Enhanced mock service data combining all three service types
    const mockServices = [
        // Accommodations
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
            images: [
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
                'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800'
            ],
            features: ['Pool', 'Spa', 'Beach Access', 'WiFi', 'Restaurant', 'Fitness Center'],
            availability: 'Available',
            description: 'Experience the ultimate in relaxation and luxury at our beachfront resort. Enjoy spacious rooms, stunning ocean views, and world-class amenities.',
            amenities: ['Free WiFi', 'Swimming Pool', 'Breakfast Included', 'Spa', 'Beach Access', 'Fitness Center', '24/7 Room Service', 'Laundry Service'],
            type: 'Resort',
            checkIn: '3:00 PM',
            checkOut: '11:00 AM',
            roomTypes: ['Deluxe Ocean View', 'Junior Suite', 'Presidential Suite'],
            policies: ['Free cancellation up to 24 hours', 'Pet-friendly', 'Non-smoking rooms available'],
            userReviews: [
                {
                    id: 1,
                    name: 'John Doe',
                    rating: 4.8,
                    review: 'Amazing stay! The beach access was incredible and staff was very friendly.',
                    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
                    date: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    rating: 4.7,
                    review: 'Beautiful location and excellent spa services. Highly recommended!',
                    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
                    date: '2024-01-10'
                }
            ]
        },
        // Transportation
        {
            id: 7,
            category: 'transport',
            name: 'Luxury SUV with Driver',
            provider: 'Elite Transport',
            location: 'Colombo, Sri Lanka',
            rating: 4.7,
            reviews: 189,
            price: 75,
            priceUnit: 'day',
            images: [
                'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800',
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
                'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'
            ],
            features: ['A/C', 'English Speaking', 'Fuel Included', 'WiFi', 'Water Bottles'],
            availability: 'Available',
            description: 'Travel in comfort with our luxury SUV and professional driver. Perfect for families or groups exploring Sri Lanka.',
            amenities: ['Air Conditioning', 'English Speaking Driver', 'Fuel Included', 'Insurance Covered', 'Local Knowledge', 'Flexible Itinerary', 'Free WiFi', 'Complimentary Water'],
            vehicleType: 'SUV',
            capacity: 7,
            luggage: '3 large bags',
            driverExperience: '8 years',
            languages: ['English', 'Sinhala', 'Tamil'],
            policies: ['Free cancellation up to 2 hours', 'Pick-up from any location', 'Waiting time included'],
            userReviews: [
                {
                    id: 1,
                    name: 'Mike Johnson',
                    rating: 4.9,
                    review: 'Excellent service! Driver was punctual and very knowledgeable about local attractions.',
                    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
                    date: '2024-01-12'
                },
                {
                    id: 2,
                    name: 'Sarah Wilson',
                    rating: 4.6,
                    review: 'Comfortable ride and great value for money. Highly recommend for families.',
                    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
                    date: '2024-01-08'
                }
            ]
        },
        // Tour Guides
        {
            id: 12,
            category: 'guide',
            name: 'Cultural Heritage Tour Guide',
            provider: 'Heritage Walks',
            guideName: 'Pradeep Silva',
            location: 'Kandy, Sri Lanka',
            rating: 4.7,
            reviews: 203,
            price: 35,
            priceUnit: 'hour',
            images: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800'
            ],
            features: ['Multi-lingual', 'Licensed', 'Historical Expert', 'Cultural Stories'],
            availability: 'Available',
            description: 'Expert guide for cultural sites and historical landmarks. Discover the rich heritage of Sri Lanka with personalized tours.',
            amenities: ['Licensed Guide', 'Historical Knowledge', 'Cultural Expertise', 'Flexible Timing', 'Group Discounts', 'Photography Tips'],
            specialty: 'Cultural Heritage',
            languages: ['English', 'Sinhala', 'Tamil'],
            experience: '8 years',
            certifications: ['Licensed Tour Guide', 'Cultural Heritage Specialist', 'First Aid Certified'],
            tourTypes: ['Temple Tours', 'Historical Sites', 'Cultural Experiences', 'Photography Tours'],
            policies: ['Free consultation', 'Customizable itineraries', 'Group rates available'],
            userReviews: [
                {
                    id: 1,
                    name: 'David Brown',
                    rating: 4.8,
                    review: 'Pradeep was fantastic! Very knowledgeable about Sri Lankan history and culture.',
                    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
                    date: '2024-01-14'
                },
                {
                    id: 2,
                    name: 'Emma Davis',
                    rating: 4.6,
                    review: 'Great guide with excellent English. Made our temple visits truly memorable.',
                    profileImage: 'https://randomuser.me/api/portraits/women/6.jpg',
                    date: '2024-01-09'
                }
            ]
        }
    ];

    const service = mockServices.find(s => s.id === parseInt(id)) || mockServices[0];

    // Get breadcrumb items based on service category
    const getBreadcrumbItems = () => {
        const categoryMap = {
            'accommodation': { label: 'Accommodations', path: '/user/accommodations' },
            'transport': { label: 'Transportation', path: '/user/transportation' },
            'guide': { label: 'Tour Guides', path: '/user/tour-guides' }
        };

        const category = categoryMap[service.category] || { label: 'Services', path: '/user/services' };
        
        return [
            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
            { label: 'Services', path: '/user/services' },
            { label: category.label, path: category.path },
            { label: service.name, isActive: true }
        ];
    };

    const handlePrevImage = () => {
        setCurrentImage(prev => prev === 0 ? service.images.length - 1 : prev - 1);
    };

    const handleNextImage = () => {
        setCurrentImage(prev => prev === service.images.length - 1 ? 0 : prev + 1);
    };

    const handleBookingSubmit = () => {
        console.log('Booking submitted:', bookingData);
        // Handle booking logic here
        alert('Booking confirmed! You will receive a confirmation email shortly.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header with back button */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex items-center">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <Breadcrumb items={getBreadcrumbItems()} />
                </div>
            </div>

            {/* Image Gallery */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={service.images[currentImage]}
                    alt={service.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Image Navigation */}
                {service.images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all rotate-180"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {service.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImage(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${
                                        currentImage === index 
                                            ? 'bg-white' 
                                            : 'bg-white bg-opacity-50'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Service Details */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{service.name}</h1>
                                    <div className="flex items-center text-slate-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{service.location}</span>
                                    </div>
                                    <p className="text-slate-500">by {service.provider}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-slate-800">{service.rating}</span>
                                    <span className="text-slate-500">({service.userReviews.length} reviews)</span>
                                </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ${service.price}
                                <span className="text-lg font-normal text-slate-500">/{service.priceUnit}</span>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Description</h2>
                            <p className="text-slate-600 leading-relaxed">{service.description}</p>
                        </Card>

                        {/* Service-Specific Details */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                {service.category === 'accommodation' && 'What\'s Included'}
                                {service.category === 'transport' && 'Vehicle Details'}
                                {service.category === 'guide' && 'Guide Information'}
                            </h2>
                            
                            {service.category === 'accommodation' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {service.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <span className="text-slate-700">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                                        <div className="text-center">
                                            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-slate-700">Check-in</p>
                                            <p className="text-sm text-slate-500">{service.checkIn}</p>
                                        </div>
                                        <div className="text-center">
                                            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-slate-700">Check-out</p>
                                            <p className="text-sm text-slate-500">{service.checkOut}</p>
                                        </div>
                                        <div className="text-center">
                                            <Home className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                            <p className="text-sm font-medium text-slate-700">Type</p>
                                            <p className="text-sm text-slate-500">{service.type}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {service.category === 'transport' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <Car className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Vehicle: {service.vehicleType}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Users className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Capacity: {service.capacity} passengers</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Driver Experience: {service.driverExperience}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <Camera className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Luggage: {service.luggage}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Languages className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Languages: {service.languages.join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200">
                                        <h4 className="font-semibold text-slate-800 mb-3">Included Services</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {service.amenities.map((amenity, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <span className="text-slate-700">{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {service.category === 'guide' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <Users className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Guide: {service.guideName}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Award className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Experience: {service.experience}</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Camera className="w-5 h-5 text-blue-500" />
                                                <span className="text-slate-700">Specialty: {service.specialty}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Languages className="w-5 h-5 text-blue-500" />
                                                    <span className="font-medium text-slate-700">Languages:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 ml-7">
                                                    {service.languages.map((language, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                                                        >
                                                            {language}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="pt-4 border-t border-slate-200">
                                            <h4 className="font-semibold text-slate-800 mb-3">Certifications</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {service.certifications.map((cert, index) => (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <span className="text-slate-700">{cert}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="pt-4 border-t border-slate-200">
                                            <h4 className="font-semibold text-slate-800 mb-3">Tour Types</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {service.tourTypes.map((type, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                                                    >
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Policies */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Policies & Terms</h2>
                            <div className="space-y-3">
                                {service.policies.map((policy, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-700">{policy}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Location */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Location</h2>
                            <div className="w-full h-64 bg-slate-200 rounded-lg flex items-center justify-center">
                                <p className="text-slate-500">Map will be displayed here</p>
                            </div>
                        </Card>

                        {/* Reviews */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Reviews</h2>
                            <div className="space-y-4">
                                {service.userReviews.map((review) => (
                                    <div key={review.id} className="border-b border-slate-200 pb-4 last:border-b-0">
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={review.profileImage}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-slate-800">{review.name}</h4>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-sm text-slate-600">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600">{review.review}</p>
                                                <p className="text-sm text-slate-400 mt-2">{review.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="mt-4">
                                    See all reviews
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Book this {service.category}</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {service.category === 'accommodation' ? 'Check-in Date' : 'Start Date'}
                                        </label>
                                        <Input
                                            type="date"
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                                        />
                                    </div>
                                    
                                    {service.category === 'accommodation' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Check-out Date
                                            </label>
                                            <Input
                                                type="date"
                                                value={bookingData.endDate}
                                                onChange={(e) => setBookingData(prev => ({ ...prev, endDate: e.target.value }))}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Adults</span>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    adults: Math.max(1, prev.adults - 1) 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-semibold w-8 text-center">{bookingData.adults}</span>
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    adults: prev.adults + 1 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Children</span>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    children: Math.max(0, prev.children - 1) 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-semibold w-8 text-center">{bookingData.children}</span>
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    children: prev.children + 1 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {service.category === 'accommodation' && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700">Rooms</span>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => setBookingData(prev => ({ 
                                                        ...prev, 
                                                        rooms: Math.max(1, prev.rooms - 1) 
                                                    }))}
                                                    className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-semibold w-8 text-center">{bookingData.rooms}</span>
                                                <button
                                                    onClick={() => setBookingData(prev => ({ 
                                                        ...prev, 
                                                        rooms: prev.rooms + 1 
                                                    }))}
                                                    className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                ${service.price} x {
                                                    service.category === 'accommodation' ? 
                                                        `${bookingData.rooms} room(s)` :
                                                    service.category === 'transport' ? 
                                                        `${bookingData.days || 1} day(s)` :
                                                        `${bookingData.duration || 4} hour(s)`
                                                }
                                            </span>
                                            <span className="text-slate-800">
                                                ${service.price * (
                                                    service.category === 'accommodation' ? bookingData.rooms :
                                                    service.category === 'transport' ? (bookingData.days || 1) :
                                                    (bookingData.duration || 4)
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Service fee</span>
                                            <span className="text-slate-800">$10</span>
                                        </div>
                                        {bookingData.adults > 1 && service.category === 'guide' && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Group discount (10%)</span>
                                                <span className="text-green-600">-${Math.round(service.price * (bookingData.duration || 4) * 0.1)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                                        <span>Total</span>
                                        <span className="text-blue-600">
                                            ${(() => {
                                                let basePrice = service.price * (
                                                    service.category === 'accommodation' ? bookingData.rooms :
                                                    service.category === 'transport' ? (bookingData.days || 1) :
                                                    (bookingData.duration || 4)
                                                );
                                                let serviceFee = 10;
                                                let discount = (bookingData.adults > 1 && service.category === 'guide') ? 
                                                    Math.round(basePrice * 0.1) : 0;
                                                return basePrice + serviceFee - discount;
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleBookingSubmit}
                                    disabled={!bookingData.date}
                                >
                                    Book Now
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <TravelerFooter />
        </div>
    );
};

export default ServiceDetails;
