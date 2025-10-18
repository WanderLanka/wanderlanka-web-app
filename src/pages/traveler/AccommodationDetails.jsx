import { useState, useEffect } from 'react';
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
    Calendar,
    Wifi,
    Coffee,
    Home,
    Car
} from 'lucide-react';
import { Button, Card, Input, Breadcrumb } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import PaymentModal from '../../components/PaymentModal';
import { useTripPlanning } from '../../hooks/useTripPlanning';
import { accommodationAPI } from '../../services/api';

const AccommodationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToTripPlanning } = useTripPlanning();
    
    const [currentImage, setCurrentImage] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [accommodation, setAccommodation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState({
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        rooms: 1
    });

    // Check if user came from trip planning page
    const isFromTripPlanning = location.state?.fromTripPlanning === true;

    // Set default dates when coming from trip planning
    useEffect(() => {
        if (isFromTripPlanning && location.state?.selectedDateValue) {
            const selectedDate = location.state.selectedDateValue; // This is the specific date user clicked
            // Calculate check-out date (next day for single day booking)
            const checkInDate = new Date(selectedDate);
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + 1);
            
            setBookingData(prev => ({
                ...prev,
                checkIn: selectedDate,
                checkOut: checkOutDate.toISOString().split('T')[0]
            }));
        }
    }, [isFromTripPlanning, location.state]);

    // Fetch accommodation data
    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                setLoading(true);
                const data = await accommodationAPI.getById(id);
                setAccommodation(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch accommodation:', err);
                setError('Failed to load accommodation details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAccommodation();
        }
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading accommodation details...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <Button 
                        variant="primary" 
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    // No accommodation found
    if (!accommodation) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-gray-600 text-xl">Accommodation not found</p>
                    <Button 
                        variant="primary" 
                        onClick={() => navigate('/user/accommodations')}
                        className="mt-4"
                    >
                        Back to Accommodations
                    </Button>
                </div>
            </div>
        );
    }

    const handlePrevImage = () => {
        if (accommodation?.images?.length) {
            setCurrentImage(prev => prev === 0 ? accommodation.images.length - 1 : prev - 1);
        }
    };

    const handleNextImage = () => {
        if (accommodation?.images?.length) {
            setCurrentImage(prev => prev === accommodation.images.length - 1 ? 0 : prev + 1);
        }
    };

    const handleBookingSubmit = () => {
        if (isFromTripPlanning) {
            // Add to trip planning summary
            const planningBooking = {
                id: `acc_${accommodation._id || accommodation.id}_${Date.now()}`,
                serviceId: accommodation._id || accommodation.id,
                name: accommodation.name,
                provider: accommodation.userId || 'Property Owner',
                location: accommodation.location,
                type: 'accommodation',
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                adults: bookingData.adults,
                children: bookingData.children,
                rooms: bookingData.rooms,
                nights: getNights(),
                pricePerNight: accommodation?.price || 0,
                totalPrice: calculateTotal(),
                image: accommodation?.images?.[0] || '/placeholder-hotel.jpg',
                selectedDate: location.state?.selectedDateValue || bookingData.checkIn // Store the specific selected date
            };
            
            addToTripPlanning(planningBooking, 'accommodations');
            alert('Added to your trip planning! Continue adding more services or review your summary.');
        } else {
            // Open payment modal for direct booking
            setShowPaymentModal(true);
        }
    };

    const calculateTotal = () => {
        if (!bookingData.checkIn || !bookingData.checkOut) return 0;
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return nights > 0 ? ((accommodation?.price || 0) * nights * bookingData.rooms) + 25 : 0;
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
                            {isFromTripPlanning ? 'Back to Planning' : 'Back to Accommodations'}
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
                        items={isFromTripPlanning ? [
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'Trip Planning', path: '/user/trip-planning' },
                            { label: accommodation?.name || 'Accommodation Details', isActive: true }
                        ] : [
                            { label: 'Dashboard', path: '/user/dashboard', isHome: true },
                            { label: 'Services'},
                            { label: 'Accommodations', path: '/user/accommodations' },
                            { label: accommodation?.name || 'Accommodation Details', isActive: true }
                        ]} 
                    />
                </div>
            </div>

            {/* Image Gallery */}
            <div className="relative h-96 overflow-hidden">
                <img
                    src={accommodation?.images?.[currentImage] || '/placeholder-hotel.jpg'}
                    alt={accommodation?.name || 'Accommodation'}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Image Navigation */}
                {accommodation?.images && accommodation.images.length > 1 && (
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
                            {(accommodation?.images || []).map((_, index) => (
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
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{accommodation?.name || 'Accommodation Details'}</h1>
                                    <div className="flex items-center text-slate-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{accommodation?.location || 'Location not specified'}</span>
                                    </div>
                                    <p className="text-slate-500">by {accommodation?.userId || 'Property Owner'}</p>
                                    <div className="flex items-center mt-2">
                                        <Home className="w-4 h-4 mr-2 text-blue-500" />
                                        <span className="text-sm font-medium text-slate-700">{accommodation?.accommodationType || 'Hotel'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-slate-800">{accommodation?.rating || '4.0'}</span>
                                    <span className="text-slate-500">({accommodation?.reviews || '0'} reviews)</span>
                                </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ${accommodation?.price || '0'}
                                <span className="text-lg font-normal text-slate-500">/night</span>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">About this property</h2>
                            <p className="text-slate-600 leading-relaxed">{accommodation?.description || 'No description available for this accommodation.'}</p>
                        </Card>

                        {/* Room Types */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Room Types</h2>
                            <div className="space-y-4">
                                {(accommodation?.roomTypes || []).map((room, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800">{room?.name || 'Standard Room'}</h3>
                                            <p className="text-sm text-slate-600">{room?.size || 'Medium'} • Up to {room?.occupancy || '2'} guests</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-600">${room?.price || accommodation?.price || '0'}/night</p>
                                        </div>
                                    </div>
                                ))}
                                {(!accommodation?.roomTypes || accommodation.roomTypes.length === 0) && (
                                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-800">Standard Room</h3>
                                            <p className="text-sm text-slate-600">Comfortable accommodation • Up to 2 guests</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-blue-600">${accommodation?.price || '0'}/night</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Amenities */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Amenities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(accommodation?.amenities || ['WiFi', 'Air Conditioning', 'Room Service', 'Free Parking']).map((amenity, index) => (
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
                                    <p className="text-sm text-slate-500">{accommodation?.checkInTime || '14:00'}</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Check-out</p>
                                    <p className="text-sm text-slate-500">{accommodation?.checkOutTime || '11:00'}</p>
                                </div>
                                <div className="text-center">
                                    <Home className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Property Type</p>
                                    <p className="text-sm text-slate-500">{accommodation?.accommodationType || 'Hotel'}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Nearby Attractions */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Nearby Attractions</h2>
                            <div className="space-y-3">
                                {(accommodation?.nearbyAttractions || [
                                    { name: 'Local Beach', type: 'Beach', distance: '2.5 km' },
                                    { name: 'City Center', type: 'Shopping', distance: '5.0 km' },
                                    { name: 'National Park', type: 'Nature', distance: '8.2 km' }
                                ]).map((attraction, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                            <div>
                                                <p className="font-medium text-slate-800">{attraction?.name || 'Local Attraction'}</p>
                                                <p className="text-sm text-slate-500">{attraction?.type || 'Point of Interest'}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">{attraction?.distance || 'Unknown'}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Policies */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Policies</h2>
                            <div className="space-y-3">
                                {(accommodation?.policies || [
                                    'Check-in: 2:00 PM - 11:00 PM',
                                    'Check-out: Before 11:00 AM',
                                    'No smoking in rooms',
                                    'Pets allowed with additional fee',
                                    'Free cancellation up to 24 hours before arrival'
                                ]).map((policy, index) => (
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
                                {(accommodation?.userReviews || [
                                    {
                                        id: 1,
                                        name: 'Sarah Johnson',
                                        profileImage: '/api/placeholder/48/48',
                                        rating: 5,
                                        review: 'Amazing stay! The staff was incredibly helpful and the location was perfect.',
                                        date: 'March 2024',
                                        helpful: 12
                                    },
                                    {
                                        id: 2,
                                        name: 'Michael Chen',
                                        profileImage: '/api/placeholder/48/48',
                                        rating: 4,
                                        review: 'Great accommodation with excellent amenities. Would definitely stay again.',
                                        date: 'February 2024',
                                        helpful: 8
                                    }
                                ]).map((review) => (
                                    <div key={review?.id || Math.random()} className="border-b border-slate-200 pb-6 last:border-b-0">
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={review?.profileImage || '/api/placeholder/48/48'}
                                                alt={review?.name || 'Guest'}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-slate-800">{review?.name || 'Anonymous Guest'}</h4>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                        <span className="text-sm text-slate-600">{review?.rating || 5}</span>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 mb-3">{review?.review || 'Great accommodation!'}</p>
                                                <div className="flex items-center justify-between text-sm text-slate-400">
                                                    <span>{review?.date || 'Recent'}</span>
                                                    <span>{review?.helpful || 0} people found this helpful</span>
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
                                    {isFromTripPlanning ? 'Add to Itinerary' : 'Proceed to Payment'}
                                </Button>
                                
                                <p className="text-xs text-slate-500 text-center">
                                    {isFromTripPlanning 
                                        ? 'Add accommodation to your trip itinerary' 
                                        : 'Complete booking and payment'
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
                bookingData={accommodation}
                totalAmount={calculateTotal()}
            />
        </div>
    );
};

export default AccommodationDetails;