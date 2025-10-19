import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { bookingsAPI } from '../../services/api';

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

      // Load user data from localStorage to prefill form
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setPaymentData(prev => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            email: parsedUserData.email || '',
            phone: parsedUserData.phone || ''
          },
          billingAddress: {
            ...prev.billingAddress,
            street: parsedUserData.address?.street || '',
            city: parsedUserData.address?.city || '',
            state: parsedUserData.address?.state || '',
            zipCode: parsedUserData.address?.zipCode || '',
            country: parsedUserData.address?.country || 'Sri Lanka'
          }
        }));
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

  const formatCurrency = (amount, currency = 'USD') => {
    if (currency === 'LKR') {
      return `LKR ${(amount || 0).toLocaleString()}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
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
      // Prepare booking request according to enhanced booking architecture
      const bookingRequest = {
        serviceType: bookingData.type,
        serviceId: bookingData.serviceId,
        serviceName: bookingData.name,
        serviceProvider: bookingData.provider,
        totalAmount: bookingData.totalPrice,
        
        // Service-specific booking details
        bookingDetails: {
          currency: 'LKR',
          
          // Accommodation specific
          ...(bookingData.type === 'accommodation' && {
            checkInDate: bookingData.checkIn,
            checkOutDate: bookingData.checkOut,
            rooms: bookingData.rooms,
            adults: bookingData.adults,
            children: bookingData.children,
            nights: bookingData.nights
          }),
          
          // Transportation specific
          ...(bookingData.type === 'transportation' && {
            startDate: bookingData.startDate,
            days: bookingData.days,
            passengers: bookingData.passengers,
            pickupLocation: bookingData.pickupLocation,
            dropoffLocation: bookingData.dropoffLocation,
            estimatedDistance: bookingData.estimatedDistance,
            pricingPerKm: bookingData.pricingPerKm
          }),
          
          // Guide service specific
          ...(bookingData.type === 'guide' && {
            tourDate: bookingData.tourDate,
            duration: bookingData.duration,
            groupSize: bookingData.groupSize,
            specialRequests: bookingData.specialRequests
          })
        },
        
        // Payment details for processing
        paymentDetails: {
          cardNumber: paymentData.cardNumber,
          expiryDate: paymentData.expiryDate,
          cvv: paymentData.cvv,
          cardholderName: paymentData.cardholderName,
          billingAddress: paymentData.billingAddress
        },
        
        // Contact information
        contactInfo: paymentData.contactInfo
      };

      console.log('Sending enhanced booking request to API Gateway:', bookingRequest);

      // Send request to API Gateway using bookingsAPI.createEnhanced
      // This goes through API Gateway /api/bookings/enhanced which forwards to booking service
      // The booking service uses the complete enhanced booking architecture:
      // 1. Authentication & request validation
      // 2. Create pending booking in database
      // 3. Check availability via Accommodation Adapter
      // 4. Create temporary reservation
      // 5. Process payment via Payment Adapter
      // 6. Confirm reservation and finalize booking
      // 7. Return complete booking confirmation with timeline
      const result = await bookingsAPI.createEnhanced(bookingRequest);
      console.log('Enhanced booking service response:', result);

      // Check if booking was successful
      if (result && result.success && result.data) {
        // Enhanced Booking Service has completed the full flow:
        // 1. Created pending booking record with validation
        // 2. Checked availability via Accommodation Adapter
        // 3. Created temporary reservation (room hold)
        // 4. Processed payment via Payment Adapter
        // 5. Confirmed reservation and updated booking status
        // 6. Finalized booking with confirmation number
        // 7. Returned complete booking timeline and details

        // Clear the booking data after successful payment
        localStorage.removeItem('directBookingData');
        
        // Extract enhanced booking data from response
        const bookingDetails = result.data;
        
        // Store enhanced booking confirmation for reference
        localStorage.setItem('latestBooking', JSON.stringify({
          bookingId: bookingDetails.bookingId,
          confirmationNumber: bookingDetails.confirmationNumber,
          reservationId: bookingDetails.reservationDetails?.reservationId,
          transactionId: bookingDetails.paymentDetails?.transactionId,
          status: bookingDetails.status,
          serviceDetails: bookingDetails.serviceDetails,
          bookingTimeline: bookingDetails.bookingTimeline,
          timestamp: new Date().toISOString()
        }));
        
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate('/user/mybookings', { 
            state: { 
              paymentSuccess: true,
              bookingId: bookingDetails.bookingId,
              confirmationNumber: bookingDetails.confirmationNumber,
              transactionId: bookingDetails.paymentDetails?.transactionId,
              message: 'Your booking has been confirmed successfully! Reservation details have been sent to your email.'
            }
          });
        }, 2000);
        
      } else {
        throw new Error(result.message || 'Enhanced booking confirmation not received');
      }
      
    } catch (error) {
      console.error('Booking/Payment failed:', error);
      
      // Show appropriate error message based on error type
      let errorMessage = 'Enhanced booking failed. Please try again.';
      if (error.message.includes('log in') || error.message.includes('Authentication')) {
        errorMessage = 'Please log in to continue with your booking.';
        setTimeout(() => navigate('/auth/login'), 2000);
      } else if (error.message.includes('not available') || error.message.includes('availability')) {
        errorMessage = 'Sorry, this service is no longer available for the selected dates. Please try different dates.';
      } else if (error.message.includes('payment') || error.message.includes('Payment')) {
        errorMessage = 'Payment processing failed. Please check your card details and try again.';
      } else if (error.message.includes('service is currently unavailable')) {
        errorMessage = 'One or more booking services are temporarily unavailable. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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
                    <>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">Passengers:</span>
                        <span className="ml-2 font-medium">{bookingData.passengers}</span>
                      </div>
                      {bookingData.pickupLocation && (
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">Pickup:</span>
                          <span className="ml-2 font-medium">{bookingData.pickupLocation}</span>
                        </div>
                      )}
                      {bookingData.dropoffLocation && (
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">Drop-off:</span>
                          <span className="ml-2 font-medium">{bookingData.dropoffLocation}</span>
                        </div>
                      )}
                      {bookingData.estimatedDistance && (
                        <div className="flex items-center text-sm">
                          <Car className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">Distance:</span>
                          <span className="ml-2 font-medium">{bookingData.estimatedDistance} km</span>
                        </div>
                      )}
                    </>
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
                        <span>LKR {bookingData.pricePerKm}/km × {bookingData.estimatedDistance} km × {bookingData.days} day(s)</span>
                        <span>LKR {((bookingData.pricePerKm || 0) * (bookingData.estimatedDistance || 0) * bookingData.days).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Service fee</span>
                        <span>LKR 500</span>
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
                    <span className="text-emerald-600">{formatCurrency(bookingData.totalPrice, bookingData.type === 'transportation' ? 'LKR' : 'USD')}</span>
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