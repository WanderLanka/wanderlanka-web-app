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
    Car,
    Languages,
    Camera,
    Shield,
    Calendar,
    Phone
} from 'lucide-react';

import Breadcrumb from '../../components/common/Breadcrumb';
import { Button, Card, Input } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import PaymentModal from '../../components/PaymentModal';
import { useTripPlanning } from '../../hooks/useTripPlanning';
import { transportationAPI, bookingsAPI } from '../../services/api';

function TransportationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToTripPlanning } = useTripPlanning();
    
    const [currentImage, setCurrentImage] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        days: 1,
        passengers: 1,
        pickupLocation: '',
        dropoffLocation: '',
        estimatedDistance: 0 // in kilometers
    });

    // Fetch vehicle data by ID
    useEffect(() => {
        const fetchVehicle = async () => {
            console.log('TransportationDetails: ID from params:', id);
            
            if (!id) {
                console.error('No vehicle ID provided');
                setError('No vehicle ID specified. Please navigate from the transportation list.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('Fetching vehicle with ID:', id);
                const response = await transportationAPI.getById(id);
                console.log('API Response received:', response);
                
                // Extract vehicle data from nested response structure
                const vehicleData = response?.data || response;
                console.log('Vehicle data extracted:', vehicleData);
                console.log('Vehicle userId:', vehicleData?.userId);
                console.log('Vehicle _id:', vehicleData?._id);
                console.log('Vehicle id:', vehicleData?.id);
                
                setVehicle(vehicleData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch vehicle:', err);
                setError('Failed to load vehicle details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    // Check if user came from trip planning page
    const isFromTripPlanning = location.state?.fromTripPlanning === true;

    // Set default dates when coming from trip planning
    useEffect(() => {
        if (isFromTripPlanning && location.state?.selectedDateValue) {
            const selectedDate = location.state.selectedDateValue; // This is the specific date user clicked
            
            setBookingData(prev => ({
                ...prev,
                startDate: selectedDate
            }));
        }
    }, [isFromTripPlanning, location.state]);

    const handlePrevImage = () => {
        if (!vehicle || !vehicle.images || vehicle.images.length === 0) return;
        setCurrentImage(prev => prev === 0 ? vehicle.images.length - 1 : prev - 1);
    };

    const handleNextImage = () => {
        if (!vehicle || !vehicle.images || vehicle.images.length === 0) return;
        setCurrentImage(prev => prev === vehicle.images.length - 1 ? 0 : prev + 1);
    };

    const handleBookingSubmit = async () => {
        if (!vehicle) {
            alert('Transportation data not available. Please try refreshing the page.');
            return;
        }
        
        if (isFromTripPlanning) {
            // Add to trip planning summary
            const planningBooking = {
                id: `trans_${vehicle._id || vehicle.id}_${Date.now()}`,
                serviceId: vehicle._id || vehicle.id,
                id: `trans_${vehicle._id || vehicle.id}_${Date.now()}`,
                serviceId: vehicle._id || vehicle.id,
                name: vehicle?.brand && vehicle?.model ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle',
                provider: vehicle?.userId || 'Vehicle Owner',
                provider: vehicle?.userId || 'Vehicle Owner',
                location: vehicle?.location || 'Location not specified',
                type: 'transportation',
                startDate: bookingData.startDate,
                days: bookingData.days,
                passengers: bookingData.passengers,
                pickupLocation: bookingData.pickupLocation,
                dropoffLocation: bookingData.dropoffLocation,
                estimatedDistance: bookingData.estimatedDistance,
                pricePerKm: vehicle.pricingPerKm || 0,
                pickupLocation: bookingData.pickupLocation,
                dropoffLocation: bookingData.dropoffLocation,
                estimatedDistance: bookingData.estimatedDistance,
                pricePerKm: vehicle.pricingPerKm || 0,
                totalPrice: calculateTotal(),
                image: vehicle.images?.[0] || '/placeholder-transport.jpg',
                selectedDate: location.state?.selectedDateValue || bookingData.startDate // Store the specific selected date
            };
            
            addToTripPlanning(planningBooking, 'transportation');
            
            // Store updated trip data in localStorage for persistence
            const currentTripData = localStorage.getItem('tripSummaryData');
            if (currentTripData) {
              try {
                const parsedData = JSON.parse(currentTripData);
                parsedData.planningBookings = {
                  ...parsedData.planningBookings,
                  transportation: [...(parsedData.planningBookings.transportation || []), planningBooking]
                };
                parsedData.timestamp = new Date().toISOString();
                localStorage.setItem('tripSummaryData', JSON.stringify(parsedData));
                console.log('Updated trip data stored:', parsedData);
              } catch (error) {
                console.error('Error updating trip data:', error);
              }
            }
            
            alert('Added to your trip planning! Continue adding more services or review your summary.');
        } else {
            try {
                console.log('Vehicle data for booking:', {
                    vehicleId: vehicle._id || vehicle.id,
                    userId: vehicle.userId,
                    vehicleType: vehicle.vehicleType,
                    pricingPerKm: vehicle.pricingPerKm
                });
                
                const payload = {
                    serviceType: 'transportation',
                    transportId: vehicle._id || vehicle.id,
                    transportProviderId: vehicle.userId, // Include transport provider ID
                    startDate: bookingData.startDate,
                    days: bookingData.days,
                    passengers: bookingData.passengers,
                    pickupLocation: bookingData.pickupLocation,
                    dropoffLocation: bookingData.dropoffLocation,
                    estimatedDistance: bookingData.estimatedDistance,
                    pricingPerKm: vehicle.pricingPerKm || 0,
                    vehicleType: vehicle.vehicleType,
                };
                console.log('Transport booking payload:', payload);
                console.log('Transport provider ID being sent:', vehicle.userId);
                console.log('Vehicle object at booking time:', vehicle);
                const res = await bookingsAPI.createCheckoutSession(payload);
                if (res?.url) {
                    window.location.href = res.url;
                } else {
                    alert('Failed to start payment session.');
                }
            } catch (e) {
                console.error('Failed to create transport checkout session:', e);
                alert('Could not start payment. Please try again.');
            }
        }
    };

    const calculateTotal = () => {
        if (!vehicle || !bookingData.estimatedDistance) return 0;
        const distancePrice = (vehicle.pricingPerKm || 0) * bookingData.estimatedDistance * bookingData.days;
        const serviceFee = 500; // LKR 500 service fee
        return distancePrice + serviceFee;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <span className="text-slate-600">Loading transportation details...</span>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="text-red-800 font-medium mb-2">Error Loading Transportation</div>
                        <div className="text-red-600 mb-4">{error}</div>
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            )}

            {/* No Data State */}
            {!loading && !error && !vehicle && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="text-yellow-800 font-medium mb-2">Transportation Not Found</div>
                        <div className="text-yellow-600 mb-4">The requested transportation service could not be found.</div>
                        <Button 
                            onClick={() => navigate('/user/transportation')}
                            variant="outline"
                            size="sm"
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        >
                            Browse All Transportation
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Content - only show when not loading and no error and vehicle exists */}
            {!loading && !error && vehicle && (
                <>
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
                            {isFromTripPlanning ? 'Back to Planning' : 'Back to Transportation'}
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
                            { label: vehicle.name, isActive: true }
                        ] : [
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
                    src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[currentImage] : '/placeholder-vehicle.jpg'}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                {/* Image Navigation */}
                {vehicle.images && vehicle.images.length > 1 && (
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
                            {(vehicle.images || []).map((_, index) => (
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
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                        {vehicle?.brand && vehicle?.model ? `${vehicle.brand} ${vehicle.model}` : 'Vehicle Details'}
                                        {vehicle?.year && <span className="text-xl text-slate-600 ml-2">({vehicle.year})</span>}
                                    </h1>
                                    <div className="flex items-center text-slate-600 mb-2">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{vehicle?.location || 'Location not specified'}</span>
                                    </div>
                                    <p className="text-slate-500">Driver: {vehicle?.driverName || 'Professional Driver'}</p>
                                    {vehicle?.driverPhone && (
                                        <p className="text-slate-500">Contact: {vehicle.driverPhone}</p>
                                    )}
                                    
                                    <div className="flex items-center mt-3 space-x-4 flex-wrap gap-2">
                                        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                            <Car className="w-4 h-4 mr-2 text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700 capitalize">{vehicle?.vehicleType || 'Vehicle'}</span>
                                        </div>
                                        <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                                            <Users className="w-4 h-4 mr-2 text-green-500" />
                                            <span className="text-sm font-medium text-slate-700">{vehicle?.seats} Seats</span>
                                        </div>
                                        <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                                            <span className="text-sm font-medium text-slate-700">{vehicle?.fuelType}</span>
                                        </div>
                                        {vehicle?.ac && (
                                            <div className="flex items-center bg-cyan-50 px-3 py-1 rounded-full">
                                                <span className="text-sm font-medium text-slate-700">AC</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center mt-3 space-x-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            vehicle?.availability === 'available' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {vehicle?.availability === 'available' ? 'Available' : 'Not Available'}
                                        </span>
                                        <span className="text-sm text-slate-600">License: {vehicle?.licensePlate}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold text-slate-800">4.0</span>
                                    <span className="text-slate-500">(0 reviews)</span>
                                </div>
                            </div>
                            
                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                LKR {vehicle?.pricingPerKm || '0'}
                                <span className="text-lg font-normal text-slate-500">/km</span>
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
                                        <span className="text-slate-700">Vehicle: {vehicle?.brand} {vehicle?.model}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Capacity: {vehicle?.seats} passengers</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Year: {vehicle?.year}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">License: {vehicle?.licensePlate}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="w-5 h-5 text-blue-500">⛽</span>
                                        <span className="text-slate-700">Fuel: {vehicle?.fuelType}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Status: {vehicle?.availability === 'available' ? 'Available' : 'Not Available'}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Shield className="w-5 h-5 text-blue-500" />
                                        <span className="text-slate-700">Insurance: {vehicle?.insuranceNumber}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="w-5 h-5 text-blue-500">🆔</span>
                                        <span className="text-slate-700">License: {vehicle?.driverLicense}</span>
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
                                    <h3 className="text-xl font-semibold text-slate-800">{vehicle?.driverName || 'Professional Driver'}</h3>
                                    <div className="flex items-center mt-1 mb-3">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        <span className="text-slate-600">4.8 • 5 years experience</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-blue-500" />
                                            <span className="text-slate-700">Phone: {vehicle?.driverPhone || 'Contact via booking'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield className="w-4 h-4 text-blue-500" />
                                            <span className="text-slate-700">License: {vehicle?.driverLicense || 'Valid License'}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Languages className="w-4 h-4 text-blue-500" />
                                            <span className="text-slate-700">Languages: English, Sinhala</span>
                                        </div>
                                        {vehicle?.driverInfo?.specialties && (
                                            <div className="flex items-start space-x-2">
                                                <Camera className="w-4 h-4 text-blue-500 mt-0.5" />
                                                <div>
                                                    <span className="text-slate-700">Specialties: </span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {(vehicle?.driverInfo?.specialties || []).map((specialty, index) => (
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
                                    {(vehicle?.routes || [
                                        { name: 'Airport Transfer', distance: '35 km', duration: '45 min' },
                                        { name: 'City Tour', distance: '50 km', duration: '3 hours' },
                                        { name: 'Beach Route', distance: '25 km', duration: '30 min' }
                                    ]).map((route, index) => (
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
                                {(vehicle?.features || ['Air Conditioning', 'GPS Navigation', 'Insurance Coverage', 'Clean Vehicle']).map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Policies */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Terms & Policies</h2>
                            <div className="space-y-3">
                                {(vehicle.policies || ['Full insurance coverage included', 'Free cancellation up to 24 hours', 'Valid driving license required', 'Fuel policy: Return with same level']).map((policy, index) => (
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
                                {(vehicle.userReviews || [
                                    {
                                        id: 1,
                                        name: "John Doe",
                                        profileImage: "/api/placeholder/48/48",
                                        rating: 5,
                                        review: "Excellent vehicle! Clean, comfortable, and reliable. The driver was professional and punctual.",
                                        date: "2 weeks ago",
                                        helpful: 12
                                    },
                                    {
                                        id: 2,
                                        name: "Sarah Johnson",
                                        profileImage: "/api/placeholder/48/48",
                                        rating: 4,
                                        review: "Great transportation service. The vehicle was well-maintained and the journey was smooth.",
                                        date: "1 month ago",
                                        helpful: 8
                                    }
                                ]).map((review) => (
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

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Estimated Distance (km)
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Enter estimated distance"
                                            value={bookingData.estimatedDistance}
                                            onChange={(e) => setBookingData(prev => ({ ...prev, estimatedDistance: parseInt(e.target.value) || 0 }))}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            This helps calculate the total fare based on LKR {vehicle?.pricingPerKm || 0}/km
                                        </p>
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
                                                    passengers: Math.min(vehicle.seats, prev.passengers + 1) 
                                                    passengers: Math.min(vehicle.seats, prev.passengers + 1) 
                                                }))}
                                                className="p-1 rounded-full border border-slate-300 hover:bg-slate-50"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">Maximum {vehicle.seats} passengers</p>
                                    <p className="text-xs text-slate-500">Maximum {vehicle.seats} passengers</p>
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
                                    {isFromTripPlanning ? 'Add to Itinerary' : 'Proceed to Payment'}
                                </Button>
                                
                                <p className="text-xs text-slate-500 text-center">
                                    {isFromTripPlanning 
                                        ? 'Add transportation to your trip itinerary' 
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
                bookingData={vehicle}
                totalAmount={calculateTotal()}
            />
                </>
            )}
        </div>
    );
};

export default TransportationDetails;