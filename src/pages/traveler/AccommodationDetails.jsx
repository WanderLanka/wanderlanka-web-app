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
    Wifi,
    Coffee,
    Home,
    Car
} from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const AccommodationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        rooms: 1
    });

    // Mock accommodation data
    const mockAccommodations = [
        {
            id: 1,
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
                'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800',
                'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'
            ],
            features: ['Pool', 'Spa', 'Beach Access', 'WiFi', 'Restaurant', 'Fitness Center'],
            availability: 'Available',
            description: 'Experience the ultimate in relaxation and luxury at our beachfront resort. Located on the pristine shores of Mirissa, this resort offers spacious rooms with stunning ocean views, world-class amenities including a large swimming pool, full-service spa, and gourmet dining options. Perfect for families, couples, and solo travelers seeking an unforgettable getaway in one of Sri Lanka\'s most beautiful coastal destinations.',
            amenities: ['Free WiFi', 'Swimming Pool', 'Breakfast Included', 'Spa & Wellness Center', 'Direct Beach Access', 'Fitness Center', '24/7 Room Service', 'Laundry Service', 'Concierge Service', 'Airport Transfer', 'Parking', 'Restaurant & Bar'],
            type: 'Beach Resort',
            checkIn: '3:00 PM',
            checkOut: '11:00 AM',
            roomTypes: [
                { name: 'Deluxe Ocean View', price: 150, size: '35 sqm', occupancy: 2 },
                { name: 'Junior Suite', price: 220, size: '50 sqm', occupancy: 3 },
                { name: 'Presidential Suite', price: 450, size: '85 sqm', occupancy: 4 }
            ],
            policies: [
                'Free cancellation up to 24 hours before check-in',
                'Pet-friendly accommodation available',
                'Non-smoking rooms available',
                'Children under 12 stay free with parents',
                'Late check-out available (subject to availability)'
            ],
            nearbyAttractions: [
                { name: 'Mirissa Beach', distance: '0.1 km', type: 'Beach' },
                { name: 'Whale Watching Point', distance: '0.5 km', type: 'Activity' },
                { name: 'Coconut Tree Hill', distance: '2 km', type: 'Viewpoint' },
                { name: 'Parrot Rock', distance: '1.5 km', type: 'Natural Site' }
            ],
            userReviews: [
                {
                    id: 1,
                    name: 'John Doe',
                    rating: 4.8,
                    review: 'Amazing stay! The beach access was incredible and the staff was extremely friendly. The spa services were world-class and the ocean view from our room was breathtaking.',
                    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
                    date: '2024-01-15',
                    helpful: 23
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    rating: 4.7,
                    review: 'Beautiful location with excellent facilities. The breakfast was amazing with great variety. Highly recommend for couples looking for a romantic getaway.',
                    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
                    date: '2024-01-10',
                    helpful: 18
                },
                {
                    id: 3,
                    name: 'Mike Johnson',
                    rating: 4.9,
                    review: 'Perfect family vacation spot! Kids loved the pool and beach. Staff went above and beyond to make our stay memorable.',
                    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
                    date: '2024-01-08',
                    helpful: 31
                }
            ]
        },
        {
            id: 2,
            name: 'Mountain View Hotel',
            provider: 'Hill Country Hotels',
            location: 'Ella, Sri Lanka',
            rating: 4.6,
            reviews: 198,
            price: 85,
            priceUnit: 'night',
            images: [
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
                'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
            ],
            features: ['Mountain View', 'Restaurant', 'WiFi', 'Hiking Trails', 'Garden'],
            availability: 'Available',
            description: 'Nestled in the heart of Sri Lanka\'s hill country, this charming hotel offers stunning mountain views and easy access to hiking trails.',
            amenities: ['Free WiFi', 'Restaurant', 'Mountain Views', 'Hiking Access', 'Garden', 'Room Service', 'Laundry', 'Tour Desk'],
            type: 'Mountain Hotel',
            checkIn: '2:00 PM',
            checkOut: '11:00 AM',
            roomTypes: [
                { name: 'Standard Room', price: 85, size: '25 sqm', occupancy: 2 },
                { name: 'Deluxe Mountain View', price: 120, size: '30 sqm', occupancy: 2 }
            ],
            policies: [
                'Free cancellation up to 48 hours',
                'No pets allowed',
                'Non-smoking property',
                'Early check-in subject to availability'
            ],
            nearbyAttractions: [
                { name: 'Little Adam\'s Peak', distance: '2 km', type: 'Hiking' },
                { name: 'Nine Arch Bridge', distance: '5 km', type: 'Landmark' },
                { name: 'Ella Rock', distance: '3 km', type: 'Hiking' }
            ],
            userReviews: [
                {
                    id: 1,
                    name: 'Sarah Wilson',
                    rating: 4.7,
                    review: 'Breathtaking mountain views and excellent location for hiking. The breakfast was delicious with local specialties.',
                    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
                    date: '2024-01-12',
                    helpful: 15
                }
            ]
        }
    ];

    const accommodation = mockAccommodations.find(acc => acc.id === parseInt(id)) || mockAccommodations[0];

    const handlePrevImage = () => {
        setCurrentImage(prev => prev === 0 ? accommodation.images.length - 1 : prev - 1);
    };

    const handleNextImage = () => {
        setCurrentImage(prev => prev === accommodation.images.length - 1 ? 0 : prev + 1);
    };

    const handleBookingSubmit = () => {
        console.log('Booking submitted:', bookingData);
        alert('Booking confirmed! You will receive a confirmation email shortly.');
    };

    const calculateTotal = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0;
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return nights > 0 ? (accommodation.price * nights * bookingData.rooms) + 25 : 0;
    };

    const getNights = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0;
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
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
                            Back to Accommodations
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
                    <Breadcrumb 
                        items={[
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'Services'},
                            { label: 'Accommodations', path: '/user/accommodations' },
                            { label: accommodation.name, isActive: true }
                        ]} 
                    />
                </div>
            </div>

            {/* Image Gallery */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={accommodation.images[currentImage]}
                    alt={accommodation.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Image Navigation */}
                {accommodation.images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-2 transition-all"
                        >
                            <ArrowLeft className="w-6 h-6 rotate-180" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {accommodation.images.map((_, index) => (
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

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{accommodation.name}</h1>
                                    <div className="flex items-center text-slate-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{accommodation.location}</span>
                                    </div>
                                    <p className="text-slate-500">by {accommodation.provider}</p>
                                    <div className="flex items-center mt-2">
                                        <Home className="w-4 h-4 mr-2 text-blue-500" />
                                        <span className="text-sm font-medium text-slate-700">{accommodation.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-slate-800">{accommodation.rating}</span>
                                    <span className="text-slate-500">({accommodation.reviews} reviews)</span>
                                </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ${accommodation.price}
                                <span className="text-lg font-normal text-slate-500">/night</span>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">About this property</h2>
                            <p className="text-slate-600 leading-relaxed">{accommodation.description}</p>
                        </Card>

                        {/* Room Types */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Room Types</h2>
                            <div className="space-y-4">
                                {accommodation.roomTypes.map((room, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800">{room.name}</h3>
                                            <p className="text-sm text-slate-600">{room.size} • Up to {room.occupancy} guests</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-600">${room.price}/night</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Amenities */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Amenities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {accommodation.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-200">
                                <div className="text-center">
                                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Check-in</p>
                                    <p className="text-sm text-slate-500">{accommodation.checkIn}</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Check-out</p>
                                    <p className="text-sm text-slate-500">{accommodation.checkOut}</p>
                                </div>
                                <div className="text-center">
                                    <Home className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Property Type</p>
                                    <p className="text-sm text-slate-500">{accommodation.type}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Nearby Attractions */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Nearby Attractions</h2>
                            <div className="space-y-3">
                                {accommodation.nearbyAttractions.map((attraction, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            <div>
                                                <p className="font-medium text-slate-800">{attraction.name}</p>
                                                <p className="text-sm text-slate-500">{attraction.type}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{attraction.distance}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Policies */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Policies</h2>
                            <div className="space-y-3">
                                {accommodation.policies.map((policy, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-700">{policy}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Reviews */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Guest Reviews</h2>
                            <div className="space-y-6">
                                {accommodation.userReviews.map((review) => (
                                    <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0">
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
                                                <p className="text-slate-600 mb-3">{review.review}</p>
                                                <div className="flex items-center justify-between text-sm text-slate-400">
                                                    <span>{review.date}</span>
                                                    <span>{review.helpful} people found this helpful</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="mt-4">
                                    See all {accommodation.reviews} reviews
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Book this accommodation</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Check-in Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={bookingData.checkIn}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Check-out Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={bookingData.checkOut}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                                        />
                                    </div>
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
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-slate-200 pt-4">
                                    <div className="space-y-2">
                                        {getNights() > 0 && (
                                            <>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">
                                                        ${accommodation.price} x {getNights()} nights x {bookingData.rooms} room(s)
                                                    </span>
                                                    <span className="text-slate-800">
                                                        ${accommodation.price * getNights() * bookingData.rooms}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Service fee</span>
                                                    <span className="text-slate-800">$25</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200">
                                        <span>Total</span>
                                        <span className="text-blue-600">${calculateTotal()}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleBookingSubmit}
                                    disabled={!bookingData.checkIn || !bookingData.checkOut || getNights() <= 0}
                                >
                                    Reserve Now
                                </Button>
                                
                                <p className="text-xs text-slate-500 text-center">
                                    You won't be charged yet
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <TravelerFooter />
        </div>
    );
};

export default AccommodationDetails;