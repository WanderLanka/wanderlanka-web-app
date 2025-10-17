import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft,
    Trash2,
    Calendar,
    MapPin,
    Users,
    CreditCard,
    CheckCircle
} from 'lucide-react';
import { Button, Card } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';
import PaymentModal from '../../components/PaymentModal';
import { useTripPlanning } from '../../hooks/useTripPlanning';

const TripPlanSummary = () => {
    const navigate = useNavigate();
    const { 
        planningBookings, 
        removeFromTripPlanning, 
        clearTripPlanning, 
        getTotalAmount,
        getTotalItemsCount 
    } = useTripPlanning();
    
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const renderServiceCard = (booking, type) => {
        const icons = {
            accommodations: '🏨',
            transportation: '🚗',
            guides: '👨‍🏫'
        };

        return (
            <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <div className="text-2xl">{icons[type]}</div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{booking.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{booking.provider || booking.location}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                                {type === 'accommodations' && (
                                    <>
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Check-in: {formatDate(booking.checkIn)}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Check-out: {formatDate(booking.checkOut)}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-3 h-3 mr-1" />
                                            {booking.adults + booking.children} guests, {booking.rooms} rooms
                                        </div>
                                        <div>
                                            {booking.nights} nights × ${booking.pricePerNight}/night
                                        </div>
                                    </>
                                )}
                                
                                {type === 'transportation' && (
                                    <>
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Start: {formatDate(booking.startDate)}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-3 h-3 mr-1" />
                                            {booking.passengers} passengers
                                        </div>
                                        <div>
                                            {booking.days} days × ${booking.pricePerDay}/day
                                        </div>
                                    </>
                                )}
                                
                                {type === 'guides' && (
                                    <>
                                        <div className="flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Date: {formatDate(booking.tourDate)}
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="w-3 h-3 mr-1" />
                                            {booking.groupSize} people
                                        </div>
                                        <div>
                                            {booking.duration} hours × ${booking.pricePerHour}/hour
                                        </div>
                                    </>
                                )}
                                
                                <div className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {booking.location}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="font-semibold text-green-600">
                                ${booking.totalPrice}
                            </div>
                        </div>
                        <button
                            onClick={() => removeFromTripPlanning(booking.id, type)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Card>
        );
    };

    const handleProceedToPayment = () => {
        if (getTotalItemsCount() === 0) {
            alert('Please add some services to your trip before proceeding to payment.');
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        // Clear trip planning after successful payment
        clearTripPlanning();
        alert('Payment successful! Your trip has been booked. You will receive confirmation emails shortly.');
        navigate('/user/dashboard');
    };

    if (getTotalItemsCount() === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="flex items-center mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        
                        <h1 className="text-3xl font-bold text-slate-800 mb-4">Trip Planning Summary</h1>
                    </div>

                    {/* Empty State */}
                    <Card className="p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-2xl font-semibold text-slate-700 mb-2">No services added yet</h2>
                        <p className="text-slate-500 mb-6">
                            Start planning your trip by adding accommodations, transportation, and guides.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/user/trip-planning')}
                        >
                            Start Planning
                        </Button>
                    </Card>
                </div>
                
                <TravelerFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                        className="flex items-center mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">Trip Planning Summary</h1>
                            <p className="text-slate-600">Review your selected services before booking</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearTripPlanning}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                            Clear All
                        </Button>
                    </div>
                </div>

                {/* Services Sections */}
                <div className="space-y-8">
                    {/* Accommodations */}
                    {planningBookings.accommodations.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                                🏨 Accommodations ({planningBookings.accommodations.length})
                            </h2>
                            <div className="space-y-3">
                                {planningBookings.accommodations.map(booking => 
                                    renderServiceCard(booking, 'accommodations')
                                )}
                            </div>
                        </div>
                    )}

                    {/* Transportation */}
                    {planningBookings.transportation.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                                🚗 Transportation ({planningBookings.transportation.length})
                            </h2>
                            <div className="space-y-3">
                                {planningBookings.transportation.map(booking => 
                                    renderServiceCard(booking, 'transportation')
                                )}
                            </div>
                        </div>
                    )}

                    {/* Guides */}
                    {planningBookings.guides.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                                👨‍🏫 Tour Guides ({planningBookings.guides.length})
                            </h2>
                            <div className="space-y-3">
                                {planningBookings.guides.map(booking => 
                                    renderServiceCard(booking, 'guides')
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Total and Checkout */}
                <Card className="p-6 mt-8 bg-slate-50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Trip Total</h3>
                            <p className="text-sm text-slate-600">
                                {getTotalItemsCount()} services selected
                            </p>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                            ${getTotalAmount()}
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/user/trip-planning')}
                            className="flex-1"
                        >
                            Add More Services
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleProceedToPayment}
                            className="flex-1 flex items-center justify-center"
                        >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Proceed to Payment
                        </Button>
                    </div>
                </Card>
            </div>

            <TravelerFooter />

            {/* Payment Modal */}
            <PaymentModal 
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                bookingData={{ 
                    name: 'Trip Planning Package',
                    provider: 'Wanderlanka',
                    location: 'Sri Lanka'
                }}
                totalAmount={getTotalAmount()}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default TripPlanSummary;