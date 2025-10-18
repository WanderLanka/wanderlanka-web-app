import React, { useState } from 'react';
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
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button, Card } from '../../components/common';
import { useTripPlanning } from '../../hooks/useTripPlanning';
import { TravelerFooter } from '../../components/traveler';

const BookingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planningBookings, getTotalAmount, clearTripPlanning } = useTripPlanning();
  
  // Get trip data from navigation state or localStorage
  const getTripData = () => {
    try {
      const stored = localStorage.getItem('currentTripData');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Error parsing trip data from localStorage:', error);
      return {};
    }
  };
  
  const tripData = location.state?.tripData || getTripData();
  
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

  // Calculate trip days for summary
  const tripDays = [];
  if (tripData?.startDate && tripData?.endDate) {
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      tripDays.push(new Date(d));
    }
  }

  // Organize bookings by day (same logic as TripSummaryModal)
  const dailyBookings = {};
  tripDays.forEach((day, index) => {
    const dayNum = index + 1;
    dailyBookings[dayNum] = {
      date: day,
      destinations: [],
      accommodations: [],
      transportation: [],
      guides: []
    };
  });

  // Distribute bookings to their respective days
  Object.entries(planningBookings).forEach(([type, bookings]) => {
    bookings.forEach(booking => {
      let matchingDayNum = 1;
      if (booking.selectedDate) {
        try {
          const bookingDate = new Date(booking.selectedDate).toISOString().split('T')[0];
          tripDays.forEach((tripDay, index) => {
            const tripDayStr = tripDay.toISOString().split('T')[0];
            if (bookingDate === tripDayStr) {
              matchingDayNum = index + 1;
            }
          });
        } catch (error) {
          console.warn('Error parsing booking date:', booking.selectedDate, error);
        }
      }
      
      if (dailyBookings[matchingDayNum]) {
        const targetArray = dailyBookings[matchingDayNum][type] || dailyBookings[matchingDayNum]['destinations'];
        if (targetArray) {
          targetArray.push(booking);
        }
      }
    });
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'accommodations': return Hotel;
      case 'transportation': return Car;
      case 'guides': return UserCheck;
      case 'destinations': return Camera;
      default: return MapPin;
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setPaymentData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = () => {
    const required = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
    const billingRequired = ['street', 'city', 'zipCode'];
    const contactRequired = ['email', 'phone'];
    
    for (let field of required) {
      if (!paymentData[field].trim()) return false;
    }
    
    for (let field of billingRequired) {
      if (!paymentData.billingAddress[field].trim()) return false;
    }
    
    for (let field of contactRequired) {
      if (!paymentData.contactInfo[field].trim()) return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear trip planning data after successful payment
      clearTripPlanning();
      
      setPaymentSuccess(true);
      
      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        navigate('/user/mybookings', { 
          state: { 
            bookingConfirmed: true,
            tripData: tripData,
            totalAmount: getTotalAmount()
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const hasBookings = Object.values(planningBookings).some(bookings => bookings.length > 0);

  if (!hasBookings) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Items to Book</h2>
            <p className="text-gray-600 mb-4">Your trip planning is empty. Add some items first.</p>
            <Button onClick={() => navigate('/user/trip-planning')}>
              Go to Trip Planning
            </Button>
          </div>
        </div>
        <TravelerFooter />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your booking has been confirmed. Redirecting to your bookings...</p>
          </div>
        </div>
        <TravelerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Summary
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Complete Your Booking</h1>
                <p className="text-gray-300">Review and pay for your trip</p>
              </div>
            </div>
            <div className="text-right bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-sm text-gray-300">Total Amount</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(getTotalAmount())}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Booking Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              {/* Trip Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">{tripData?.destination || 'Sri Lanka'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">
                      {tripData?.startDate && tripData?.endDate
                        ? `${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}`
                        : 'Dates not selected'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">{tripData?.travelers || 2} travelers</span>
                  </div>
                </div>
              </div>

              {/* Daily Bookings */}
              <div className="space-y-4">
                {Object.entries(dailyBookings).map(([dayNum, dayData]) => {
                  const hasActivities = dayData.destinations.length > 0 || 
                                      dayData.accommodations.length > 0 || 
                                      dayData.transportation.length > 0 || 
                                      dayData.guides.length > 0;

                  if (!hasActivities) return null;

                  return (
                    <div key={dayNum} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Day Header */}
                      <div className="bg-emerald-50 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">Day {dayNum}</h3>
                            <p className="text-sm text-gray-600">
                              {dayData.date.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {dayData.destinations.length + dayData.accommodations.length + dayData.transportation.length + dayData.guides.length} items
                          </span>
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className="p-4 space-y-3">
                        {Object.entries(dayData).map(([type, items]) => {
                          if (type === 'date' || items.length === 0) return null;
                          
                          const Icon = getServiceIcon(type);
                          
                          return items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-emerald-100 rounded-full">
                                  <Icon className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {item.location && `${item.location}`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(item.totalPrice || item.price || item.cost || 0)}
                                </span>
                              </div>
                            </div>
                          ));
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-600">{formatCurrency(getTotalAmount())}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Payment Form */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-6">
                {/* Card Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Card Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Billing Address</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.billingAddress.street}
                      onChange={(e) => handleInputChange('street', e.target.value, 'billingAddress')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="Colombo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={paymentData.billingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value, 'billingAddress')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        placeholder="00100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={paymentData.billingAddress.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value, 'billingAddress')}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Contact Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.contactInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value, 'contactInfo')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+94 77 123 4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.contactInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value, 'contactInfo')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+94 77 987 6543"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={paymentData.contactInfo.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value, 'contactInfo')}
                    />
                  </div>
                </div>

                {/* Payment Button */}
                <div className="pt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing Payment...</span>
                      </div>
                    ) : (
                      `Pay ${formatCurrency(getTotalAmount())}`
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-2">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>

      <TravelerFooter />
    </div>
  );
};

export default BookingPayment;