import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  Lock,
  Hotel,
  Car,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { Button, Card } from '../../components/common';
import { TravelerFooter } from '../../components/traveler';

const IndividualBookingPayment = () => {
  const navigate = useNavigate();
//   const location = useLocation();
  
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Sri Lanka'
    },
    contactInfo: {
      email: '',
      phone: '',
      emergencyContact: ''
    }
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Load booking data from localStorage or navigation state
  useEffect(() => {
    try {
      const directBooking = localStorage.getItem('directBookingData');
      if (directBooking) {
        const parsedData = JSON.parse(directBooking);
        if (parsedData && parsedData.length > 0) {
          setBookingData(parsedData[0]); // Single item booking
        }
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPaymentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'accommodation': return <Hotel className="w-5 h-5" />;
      case 'transportation': return <Car className="w-5 h-5" />;
      case 'guide': return <UserCheck className="w-5 h-5" />;
      default: return <Hotel className="w-5 h-5" />;
    }
  };

  const formatDateRange = (booking) => {
    if (booking.type === 'accommodation') {
      return `${booking.checkIn} to ${booking.checkOut} (${booking.nights} nights)`;
    } else if (booking.type === 'transportation') {
      return `${booking.startDate} (${booking.days} days)`;
    } else if (booking.type === 'guide') {
      return `${booking.tourDate} (${booking.duration} hours)`;
    }
    return 'Date not specified';
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the booking data after successful payment
      localStorage.removeItem('directBookingData');
      
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate('/user/mybookings', { 
          state: { 
            paymentSuccess: true,
            bookingId: bookingData.id
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Booking Found</h2>
          <p className="text-gray-600 mb-4">Please select a service to book first.</p>
          <Button onClick={() => navigate('/user/services')}>
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting to your bookings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 mb-3"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Details
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{bookingData.name}</h1>
                <p className="text-gray-300">Complete your booking</p>
              </div>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-gray-300">Total Amount</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(bookingData.totalPrice)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Booking Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                {getServiceIcon(bookingData.type)}
                <span className="ml-2">Booking Summary</span>
              </h2>
              
              <div className="space-y-4">
                {/* Service Details */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={bookingData.image}
                      alt={bookingData.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{bookingData.name}</h3>
                      <p className="text-sm text-gray-600">by {bookingData.provider}</p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {bookingData.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 font-medium">{formatDateRange(bookingData)}</span>
                  </div>
                  
                  {bookingData.type === 'accommodation' && (
                    <>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Guests:</span>
                        <span className="ml-2 font-medium">{bookingData.adults} adults, {bookingData.children} children</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Hotel className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Rooms:</span>
                        <span className="ml-2 font-medium">{bookingData.rooms}</span>
                      </div>
                    </>
                  )}
                  
                  {bookingData.type === 'transportation' && (
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Passengers:</span>
                      <span className="ml-2 font-medium">{bookingData.passengers}</span>
                    </div>
                  )}
                  
                  {bookingData.type === 'guide' && (
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Group Size:</span>
                      <span className="ml-2 font-medium">{bookingData.groupSize} people</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  {bookingData.type === 'accommodation' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>${bookingData.pricePerNight}/night × {bookingData.nights} nights × {bookingData.rooms} rooms</span>
                        <span>${(bookingData.pricePerNight * bookingData.nights * bookingData.rooms).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>$25.00</span>
                      </div>
                    </>
                  )}
                  
                  {bookingData.type === 'transportation' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>${bookingData.pricePerDay}/day × {bookingData.days} days</span>
                        <span>${(bookingData.pricePerDay * bookingData.days).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>$15.00</span>
                      </div>
                    </>
                  )}
                  
                  {bookingData.type === 'guide' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>${bookingData.pricePerHour}/hour × {bookingData.duration} hours</span>
                        <span>${(bookingData.pricePerHour * bookingData.duration).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>$12.00</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-emerald-600">{formatCurrency(bookingData.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Payment Form */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </h2>
              
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Payment Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Card Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Contact Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.contactInfo.email}
                      onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+94 70 123 4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.contactInfo.phone}
                      onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full py-3 text-lg"
                  disabled={isProcessing}
                  variant="primary"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="w-5 h-5 mr-2" />
                      Pay {formatCurrency(bookingData.totalPrice)}
                    </div>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <TravelerFooter />
    </div>
  );
};

export default IndividualBookingPayment;