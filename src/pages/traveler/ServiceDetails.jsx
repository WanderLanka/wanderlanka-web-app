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
    Share2
} from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
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

    // Mock service data - in real app, this would come from API
    const mockServices = [
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
            description: 'Experience the ultimate in relaxation and luxury at our beachfront resort. Enjoy spacious rooms, stunning ocean views, and world-class amenities including a pool, spa, and gourmet dining. Perfect for families, couples, and solo travelers seeking a memorable getaway.',
            amenities: ['Free WiFi', 'Swimming Pool', 'Breakfast Included', 'Spa', 'Beach Access', 'Fitness Center', '24/7 Room Service', 'Laundry Service'],
            userReviews: [
                {
                    id: 1,
                    name: 'John Doe',
                    rating: 4.8,
                    review: 'Amazing stay! Highly recommended. The beach access was incredible.',
                    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
                    date: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    rating: 4.7,
                    review: 'Beautiful location and friendly staff. The spa was fantastic.',
                    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
                    date: '2024-01-10'
                }
            ]
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
            images: [
                'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800',
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
            ],
            features: ['A/C', 'English Speaking', 'Fuel Included'],
            availability: 'Available',
            description: 'Comfortable private transportation with experienced driver. Explore Sri Lanka at your own pace with our reliable and professional drivers.',
            amenities: ['Air Conditioning', 'English Speaking Driver', 'Fuel Included', 'Insurance Covered', 'Local Knowledge', 'Flexible Itinerary'],
            userReviews: [
                {
                    id: 1,
                    name: 'Mike Johnson',
                    rating: 4.9,
                    review: 'Excellent service! The driver was very knowledgeable about local attractions.',
                    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
                    date: '2024-01-12'
                }
            ]
        }
    ];

    const service = mockServices.find(s => s.id === parseInt(id)) || mockServices[0];

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

                        {/* Amenities */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">What's Included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {service.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-700">{amenity}</span>
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
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-600">
                                            ${service.price} x {bookingData.adults + bookingData.children} {service.priceUnit}s
                                        </span>
                                        <span className="font-semibold">
                                            ${service.price * (bookingData.adults + bookingData.children)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total</span>
                                        <span>${service.price * (bookingData.adults + bookingData.children)}</span>
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
