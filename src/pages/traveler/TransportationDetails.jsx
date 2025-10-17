import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
    Car,
    Languages,
    Camera,
    Shield,
    Calendar
} from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import PaymentModal from '../../components/PaymentModal';
import { useTripPlanning } from '../../hooks/useTripPlanning';

const TransportationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToTripPlanning } = useTripPlanning();
    
    const [currentImage, setCurrentImage] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        days: 1,
        passengers: 1,
        pickupLocation: '',
        dropoffLocation: ''
    });

    // Mock transportation data
    const mockTransportation = [
        {
            id: 7,
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
                'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
                'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800'
            ],
            features: ['A/C', 'English Speaking', 'Fuel Included', 'WiFi', 'Water Bottles'],
            availability: 'Available',
            description: 'Travel in ultimate comfort with our luxury SUV and professional driver. Perfect for families or groups exploring Sri Lanka. Our vehicle features leather seats, climate control, and ample space for luggage. Your experienced driver will not only get you to your destination safely but also share knowledge about local attractions and culture.',
            amenities: ['Air Conditioning', 'English Speaking Driver', 'Fuel Included', 'Insurance Covered', 'Local Knowledge', 'Flexible Itinerary', 'Free WiFi', 'Complimentary Water', 'Phone Charger', 'First Aid Kit'],
            vehicleType: 'SUV',
            brand: 'Toyota Fortuner',
            year: 2022,
            capacity: 7,
            luggage: '4 large bags + 4 small bags',
            driverInfo: {
                name: 'Sunil Perera',
                experience: '8 years',
                rating: 4.8,
                languages: ['English', 'Sinhala', 'Tamil'],
                specialties: ['Cultural Sites', 'Wildlife Tours', 'Beach Destinations']
            },
            policies: [
                'Free cancellation up to 2 hours before pickup',
                'Pick-up from any location in Colombo area',
                'Waiting time up to 30 minutes included',
                'Extra stops can be arranged',
                'Child seats available upon request'
            ],
            routes: [
                { name: 'Colombo to Kandy', duration: '3 hours', distance: '115 km' },
                { name: 'Colombo to Galle', duration: '2 hours', distance: '120 km' },
                { name: 'Kandy to Ella', duration: '3.5 hours', distance: '95 km' },
                { name: 'Colombo Airport Transfer', duration: '45 mins', distance: '35 km' }
            ],
            pricing: {
                halfDay: 50,
                fullDay: 75,
                multiDay: 70,
                airport: 35
            },
            userReviews: [
                {
                    id: 1,
                    name: 'Mike Johnson',
                    rating: 4.9,
                    review: 'Excellent service! Sunil was punctual, professional, and very knowledgeable about local attractions. The vehicle was clean and comfortable. Highly recommend for anyone visiting Sri Lanka.',
                    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
                    date: '2024-01-12',
                    helpful: 25
                },
                {
                    id: 2,
                    name: 'Sarah Wilson',
                    rating: 4.6,
                    review: 'Great value for money! The SUV was spacious for our family of 5. Driver was friendly and flexible with our itinerary changes. Would book again.',
                    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg',
                    date: '2024-01-08',
                    helpful: 18
                },
                {
                    id: 3,
                    name: 'David Chen',
                    rating: 4.8,
                    review: 'Professional service from start to finish. The driver helped us discover hidden gems we would never have found on our own. Vehicle was well-maintained.',
                    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg',
                    date: '2024-01-05',
                    helpful: 22
                }
            ]
        },
        {
            id: 8,
            name: 'Airport Transfer - Private Car',
            provider: 'Swift Transfers',
            location: 'Colombo Airport, Sri Lanka',
            rating: 4.5,
            reviews: 156,
            price: 35,
            priceUnit: 'trip',
            images: [
                'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
                'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'
            ],
            features: ['A/C', 'English Speaking', 'Flight Tracking', 'Meet & Greet'],
            availability: 'Available',
            description: 'Reliable airport transfer service with professional drivers and comfortable vehicles.',
            amenities: ['Air Conditioning', 'English Speaking Driver', 'Flight Tracking', 'Meet & Greet Service', 'Luggage Assistance'],
            vehicleType: 'Sedan',
            brand: 'Toyota Axio',
            year: 2021,
            capacity: 4,
            luggage: '3 large bags',
            driverInfo: {
                name: 'Ravi Fernando',
                experience: '5 years',
                rating: 4.6,
                languages: ['English', 'Sinhala']
            },
            policies: [
                'Free cancellation up to 1 hour before pickup',
                'Flight tracking included',
                'Meet & greet at arrival hall',
                'Waiting time up to 60 minutes included'
            ],
            userReviews: [
                {
                    id: 1,
                    name: 'Emma Davis',
                    rating: 4.7,
                    review: 'Smooth airport transfer. Driver was waiting with a name board and helped with luggage. Good value for the service.',
                    profileImage: 'https://randomuser.me/api/portraits/women/6.jpg',
                    date: '2024-01-10',
                    helpful: 12
                }
            ]
        }
    ];

    const vehicle = mockTransportation.find(v => v.id === parseInt(id)) || mockTransportation[0];

    // Check if user came from trip planning page
    const isFromTripPlanning = location.state?.fromTripPlanning === true;

    const handlePrevImage = () => {
        setCurrentImage(prev => prev === 0 ? vehicle.images.length - 1 : prev - 1);
    };

    const handleNextImage = () => {
        setCurrentImage(prev => prev === vehicle.images.length - 1 ? 0 : prev + 1);
    };

    const handleBookingSubmit = () => {
        if (isFromTripPlanning) {
            // Add to trip planning summary
            const planningBooking = {
                id: `trans_${vehicle.id}_${Date.now()}`,
                serviceId: vehicle.id,
                name: vehicle.name,
                provider: vehicle.provider,
                location: vehicle.location,
                type: 'transportation',
                startDate: bookingData.startDate,
                days: bookingData.days,
                passengers: bookingData.passengers,
                pricePerDay: vehicle.price,
                totalPrice: calculateTotal(),
                image: vehicle.images[0]
            };
            
            addToTripPlanning(planningBooking, 'transportation');
            alert('Added to your trip planning! Continue adding more services or review your summary.');
        } else {
            // Open payment modal for direct booking
            setShowPaymentModal(true);
        }
    };

    const calculateTotal = () => {
        const basePrice = vehicle.price * bookingData.days;
        const serviceFee = 15;
        return basePrice + serviceFee;
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
                            Back to Transportation
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
                            { label: 'Transportation', path: '/user/transportation' },
                            { label: vehicle.name, isActive: true }
                        ]} 
                    />
                </div>
            </div>

            {/* Image Gallery */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={vehicle.images[currentImage]}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Image Navigation */}
                {vehicle.images.length > 1 && (
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
                            {vehicle.images.map((_, index) => (
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
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{vehicle.name}</h1>
                                    <div className="flex items-center text-slate-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{vehicle.location}</span>
                                    </div>
                                    <p className="text-slate-500">by {vehicle.provider}</p>
                                    <div className="flex items-center mt-2 space-x-4">
                                        <div className="flex items-center">
                                            <Car className="w-4 h-4 mr-2 text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700">{vehicle.brand}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700">{vehicle.year}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-slate-800">{vehicle.rating}</span>
                                    <span className="text-slate-500">({vehicle.reviews} reviews)</span>
                                </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ${vehicle.price}
                                <span className="text-lg font-normal text-slate-500">/{vehicle.priceUnit}</span>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">About this vehicle</h2>
                            <p className="text-slate-600 leading-relaxed">{vehicle.description}</p>
                        </Card>

                        {/* Vehicle Specifications */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Vehicle Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Car className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Vehicle: {vehicle.vehicleType}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Capacity: {vehicle.capacity} passengers</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Camera className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Luggage: {vehicle.luggage}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Year: {vehicle.year}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Available 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Driver Information */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Driver</h2>
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-slate-800">{vehicle.driverInfo.name}</h3>
                                    <div className="flex items-center mt-1 mb-3">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-slate-600">{vehicle.driverInfo.rating} • {vehicle.driverInfo.experience} experience</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Languages className="w-4 h-4 text-blue-500" />
                                            <span className="text-slate-700">Languages: {vehicle.driverInfo.languages.join(', ')}</span>
                                        </div>
                                        {vehicle.driverInfo.specialties && (
                                            <div className="flex items-start space-x-2">
                                                <Camera className="w-4 h-4 text-blue-500 mt-0.5" />
                                                <div>
                                                    <span className="text-slate-700">Specialties: </span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {vehicle.driverInfo.specialties.map((specialty, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                            >
                                                                {specialty}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Popular Routes */}
                        {vehicle.routes && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Popular Routes</h2>
                                <div className="space-y-3">
                                    {vehicle.routes.map((route, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-slate-800">{route.name}</p>
                                                    <p className="text-sm text-slate-500">{route.distance}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-600">{route.duration}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Included Services */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">What's Included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {vehicle.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-700">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Policies */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Terms & Policies</h2>
                            <div className="space-y-3">
                                {vehicle.policies.map((policy, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-700">{policy}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Reviews */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Customer Reviews</h2>
                            <div className="space-y-6">
                                {vehicle.userReviews.map((review) => (
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
                                    See all {vehicle.reviews} reviews
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Book this vehicle</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Pickup Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={bookingData.startDate}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, startDate: e.target.value }))}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Duration
                                        </label>
                                        <select 
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={bookingData.days}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, days: parseInt(e.target.value) }))}
                                        >
                                            <option value={1}>1 day</option>
                                            <option value={3}>3 days</option>
                                            <option value={7}>1 week</option>
                                            <option value={14}>2 weeks</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Pickup Location
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter pickup address"
                                            value={bookingData.pickupLocation}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Drop-off Location (Optional)
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Enter drop-off address"
                                            value={bookingData.dropoffLocation}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, dropoffLocation: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Passengers</span>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    passengers: Math.max(1, prev.passengers - 1) 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-semibold w-8 text-center">{bookingData.passengers}</span>
                                            <button
                                                onClick={() => setBookingData(prev => ({ 
                                                    ...prev, 
                                                    passengers: Math.min(vehicle.capacity, prev.passengers + 1) 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">Maximum {vehicle.capacity} passengers</p>
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-slate-200 pt-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">
                                                ${vehicle.price} x {bookingData.days} day(s)
                                            </span>
                                            <span className="text-slate-800">
                                                ${vehicle.price * bookingData.days}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Service fee</span>
                                            <span className="text-slate-800">$15</span>
                                        </div>
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
                                    disabled={!bookingData.startDate || !bookingData.pickupLocation}
                                >
                                    {isFromTripPlanning ? 'Add to Trip' : 'Book Now'}
                                </Button>
                                
                                <p className="text-xs text-slate-500 text-center">
                                    {isFromTripPlanning 
                                        ? 'Add to your trip planning summary' 
                                        : 'Driver will contact you 30 minutes before pickup'
                                    }
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <TravelerFooter />

            {/* Payment Modal */}
            <PaymentModal 
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                bookingData={vehicle}
                totalAmount={calculateTotal()}
            />
        </div>
    );
};

export default TransportationDetails;