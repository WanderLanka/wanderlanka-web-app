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
import { accommodationAPI, bookingsAPI } from '../../services/api';
import { authUtils } from '../../utils/authUtils';
import api from '../../services/axiosConfig';

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
        selectedRooms: [], // Array of {type, quantity, pricePerNight}
        guestDetails: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialRequests: ''
        }
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

    // (Reverted) No dynamic availability fetch; rely on roomType.availableRooms from backend

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

    // Room management functions
    const addRoomType = (roomType) => {
        setBookingData(prev => {
            const existingRoom = prev.selectedRooms.find(room => room.type === roomType.type);
            if (existingRoom) {
                if (roomType.availableRooms <= existingRoom.quantity) return prev;
                return {
                    ...prev,
                    selectedRooms: prev.selectedRooms.map(room =>
                        room.type === roomType.type
                            ? { ...room, quantity: room.quantity + 1 }
                            : room
                    )
                };
            } else {
                if ((roomType.availableRooms || 0) <= 0) return prev;
                return {
                    ...prev,
                    selectedRooms: [...prev.selectedRooms, { type: roomType.type, quantity: 1, pricePerNight: roomType.pricePerNight }]
                };
            }
        });
    };

    const removeRoomType = (roomType) => {
        setBookingData(prev => {
            const existingRoom = prev.selectedRooms.find(room => room.type === roomType.type);
            if (existingRoom && existingRoom.quantity > 1) {
                return {
                    ...prev,
                    selectedRooms: prev.selectedRooms.map(room =>
                        room.type === roomType.type
                            ? { ...room, quantity: room.quantity - 1 }
                            : room
                    )
                };
            } else {
                return {
                    ...prev,
                    selectedRooms: prev.selectedRooms.filter(room => room.type !== roomType.type)
                };
            }
        });
    };

    const getTotalRooms = () => {
        return bookingData.selectedRooms.reduce((total, room) => total + room.quantity, 0);
    };

    const handleBookingSubmit = async () => {
        // Validate booking data
        if (!bookingData.checkIn || !bookingData.checkOut || bookingData.selectedRooms.length === 0) {
            alert('Please select check-in/check-out dates and at least one room type.');
            return;
        }

        if (getNights() <= 0) {
            alert('Check-out date must be after check-in date.');
            return;
        }

        // Validate guest details
        if (!bookingData.guestDetails.firstName || !bookingData.guestDetails.lastName || 
            !bookingData.guestDetails.email || !bookingData.guestDetails.phone) {
            alert('Please fill in all guest details.');
            return;
        }

        const bookingDataToSend = {
            accommodationId: accommodation._id || accommodation.id,
            accommodationProviderId: accommodation.userId, // Include accommodation provider ID
            checkInDate: bookingData.checkIn,
            checkOutDate: bookingData.checkOut,
            selectedRooms: bookingData.selectedRooms.map(room => ({
                roomType: room.type,
                quantity: room.quantity,
                pricePerNight: room.pricePerNight
            })),
            guestDetails: bookingData.guestDetails
        };

        try {
            // Check authentication using utility
            const authDebug = authUtils.debugAuth();
            
            if (!authUtils.isAuthenticated()) {
                alert(`Please log in to make a booking.\n\nAvailable localStorage keys: ${authDebug.availableKeys.join(', ')}`);
                return;
            }

            // Initiate Stripe Checkout via backend (session URL redirect)
            const session = await bookingsAPI.createCheckoutSession(bookingDataToSend);
            if (session?.success && session.url) {
                window.location.href = session.url;
                return;
            }
            alert('Failed to initiate payment. Please try again.');
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                alert(`Failed to create booking: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
            } else {
                alert('Failed to create booking. Please try again.');
            }
        }
    };

    const calculateTotal = () => {
        if (!bookingData.checkIn || !bookingData.checkOut || bookingData.selectedRooms.length === 0) return 0;
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nights <= 0) return 0;
        
        const roomCost = bookingData.selectedRooms.reduce((total, room) => {
            return total + (room.pricePerNight * room.quantity * nights);
        }, 0);
        
        return roomCost + 25; // Add service fee
    };

    const calculateSubtotal = () => {
        if (!bookingData.checkIn || !bookingData.checkOut || bookingData.selectedRooms.length === 0) return 0;
        const checkIn = new Date(bookingData.checkIn);
        const checkOut = new Date(bookingData.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nights <= 0) return 0;
        
        return bookingData.selectedRooms.reduce((total, room) => {
            return total + (room.pricePerNight * room.quantity * nights);
        }, 0);
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
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{accommodation?.name}</h1>
                                    <div className="flex items-center text-slate-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{accommodation?.location}</span>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Home className="w-4 h-4 mr-2 text-blue-500" />
                                        <span className="text-sm font-medium text-slate-700 capitalize">{accommodation?.accommodationType}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-slate-800">{accommodation?.rating}</span>
                                    <span className="text-slate-500">({accommodation?.reviews} reviews)</span>
                                </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                ${accommodation?.price}
                                <span className="text-lg font-normal text-slate-500">/night</span>
                            </div>
                        </Card>

                        {/* Description */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">About this property</h2>
                            <p className="text-slate-600 leading-relaxed">{accommodation?.description}</p>
                        </Card>

                        {/* Room Types */}
                        {accommodation?.roomTypes && accommodation.roomTypes.length > 0 && (
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">Room Types</h2>
                                <div className="space-y-4">
                                    {accommodation.roomTypes.map((room, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-slate-800 capitalize">{room.type}</h3>
                                                <p className="text-sm text-slate-600">{room.size} • Up to {room.occupancy} guests</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-blue-600">${room.pricePerNight}/night</p>
                                                <p className="text-sm text-slate-500">{room.availableRooms} of {room.totalRooms} available</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Amenities */}
                        {accommodation?.amenities && accommodation.amenities.length > 0 && (
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
                            </Card>
                        )}

                        {/* Nearby Attractions */}
                        {accommodation?.nearbyAttractions && accommodation.nearbyAttractions.length > 0 && (
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
                        )}

                        {/* Policies */}
                        {accommodation?.policies && accommodation.policies.length > 0 && (
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
                        )}

                        {/* Property Information */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Property Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Check-in</p>
                                    <p className="text-sm text-slate-500">{accommodation?.checkInTime}</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Check-out</p>
                                    <p className="text-sm text-slate-500">{accommodation?.checkOutTime}</p>
                                </div>
                                <div className="text-center">
                                    <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-700">Total Rooms</p>
                                    <p className="text-sm text-slate-500">{accommodation?.totalRooms}</p>
                                </div>
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

                                {/* Room Type Selection */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-slate-800">Select Room Types</h4>
                                    {accommodation?.roomTypes && accommodation.roomTypes.length > 0 ? (
                                        <div className="space-y-3">
                                            {accommodation.roomTypes.map((roomType, index) => (
                                                <div key={index} className="border border-slate-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <h5 className="font-semibold text-slate-800 capitalize">{roomType.type}</h5>
                                                            <p className="text-sm text-slate-600">{roomType.size} • Up to {roomType.occupancy} guests</p>
                                                            <p className="text-sm text-slate-500">{roomType.availableRooms} of {roomType.totalRooms} available</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-blue-600">${roomType.pricePerNight}/night</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-700">Quantity</span>
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => removeRoomType(roomType)}
                                                                disabled={!bookingData.selectedRooms.find(room => room.type === roomType.type)}
                                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="font-semibold w-8 text-center">
                                                                {bookingData.selectedRooms.find(room => room.type === roomType.type)?.quantity || 0}
                                                            </span>
                                                            <button
                                                                onClick={() => addRoomType(roomType)}
                                                                disabled={roomType.availableRooms <= (bookingData.selectedRooms.find(room => room.type === roomType.type)?.quantity || 0)}
                                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border border-slate-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h5 className="font-semibold text-slate-800">Standard Room</h5>
                                                    <p className="text-sm text-slate-600">Comfortable accommodation</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-blue-600">${accommodation?.price || 0}/night</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700">Quantity</span>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => removeRoomType({ type: 'normal', pricePerNight: accommodation?.price || 0 })}
                                                        disabled={!bookingData.selectedRooms.find(room => room.type === 'normal')}
                                                        className="p-1 rounded-full border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-semibold w-8 text-center">
                                                        {bookingData.selectedRooms.find(room => room.type === 'normal')?.quantity || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => addRoomType({ type: 'normal', pricePerNight: accommodation?.price || 0 })}
                                                        className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Guest Details Form */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-slate-800">Guest Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                First Name *
                                            </label>
                                            <Input
                                                type="text"
                                                value={bookingData.guestDetails.firstName}
                                                onChange={(e) => setBookingData(prev => ({
                                                    ...prev,
                                                    guestDetails: { ...prev.guestDetails, firstName: e.target.value }
                                                }))}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Last Name *
                                            </label>
                                            <Input
                                                type="text"
                                                value={bookingData.guestDetails.lastName}
                                                onChange={(e) => setBookingData(prev => ({
                                                    ...prev,
                                                    guestDetails: { ...prev.guestDetails, lastName: e.target.value }
                                                }))}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Email *
                                            </label>
                                            <Input
                                                type="email"
                                                value={bookingData.guestDetails.email}
                                                onChange={(e) => setBookingData(prev => ({
                                                    ...prev,
                                                    guestDetails: { ...prev.guestDetails, email: e.target.value }
                                                }))}
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Phone *
                                            </label>
                                            <Input
                                                type="tel"
                                                value={bookingData.guestDetails.phone}
                                                onChange={(e) => setBookingData(prev => ({
                                                    ...prev,
                                                    guestDetails: { ...prev.guestDetails, phone: e.target.value }
                                                }))}
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Special Requests
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={3}
                                            value={bookingData.guestDetails.specialRequests}
                                            onChange={(e) => setBookingData(prev => ({
                                                ...prev,
                                                guestDetails: { ...prev.guestDetails, specialRequests: e.target.value }
                                            }))}
                                            placeholder="Any special requests or notes..."
                                        />
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t border-slate-200 pt-4">
                                    <div className="space-y-2">
                                        {getNights() > 0 && bookingData.selectedRooms.length > 0 && (
                                            <>
                                                {bookingData.selectedRooms.map((room, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span className="text-slate-600">
                                                            {room.quantity} {room.type} room(s) x {getNights()} nights
                                                        </span>
                                                        <span className="text-slate-800">
                                                            ${room.pricePerNight * room.quantity * getNights()}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Subtotal</span>
                                                    <span className="text-slate-800">${calculateSubtotal()}</span>
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
                                    disabled={
                                        !bookingData.checkIn || 
                                        !bookingData.checkOut || 
                                        getNights() <= 0 || 
                                        bookingData.selectedRooms.length === 0 ||
                                        !bookingData.guestDetails.firstName ||
                                        !bookingData.guestDetails.lastName ||
                                        !bookingData.guestDetails.email ||
                                        !bookingData.guestDetails.phone
                                    }
                                >
                                    {isFromTripPlanning ? 'Add to Itinerary' : 'Proceed to Payment'}
                                </Button>
                                
                                <p className="text-xs text-slate-500 text-center">
                                    {isFromTripPlanning 
                                        ? 'Add accommodation to your trip itinerary' 
                                        : 'Complete booking and payment'
                                    }
                                </p>
                                
                                {/* Debug Authentication Button (remove in production) */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2"
                                    onClick={() => {
                                        const authStatus = authUtils.debugAuth();
                                        alert(`Auth Status:\nToken: ${authStatus.token ? 'Found' : 'Missing'}\nUser: ${authStatus.user ? 'Found' : 'Missing'}\nRole: ${authStatus.role || 'None'}\nAuthenticated: ${authStatus.isAuthenticated ? 'Yes' : 'No'}`);
                                    }}
                                >
                                    🔍 Debug Auth Status
                                </Button>
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