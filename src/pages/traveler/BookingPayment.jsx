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
import { itineraryAPI } from '../../services/api';

const BookingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planningBookings, getTotalAmount, clearTripPlanning } = useTripPlanning();
  
  // Get trip data from navigation state, localStorage, or direct booking
  const getTripData = () => {
    try {
      // First check for direct booking data
      const directBooking = localStorage.getItem('directBookingData');
      if (directBooking) {
        return { directBooking: JSON.parse(directBooking) };
      }
      
      // Then check for trip summary data (from TripSummaryModal)
      const tripSummaryData = localStorage.getItem('tripSummaryData');
      if (tripSummaryData) {
        return JSON.parse(tripSummaryData);
      }
      
      // Finally check for current trip data
      const stored = localStorage.getItem('currentTripData');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Error parsing booking data from localStorage:', error);
      return {};
    }
  };
  
  const tripData = location.state?.tripData || getTripData();
  const isDirectBooking = tripData.directBooking ? true : false;
  
  // Extract the actual trip data if it's nested
  const actualTripData = tripData.tripData || tripData;
  
  // Get user data from navigation state or localStorage
  const dayPlaces = location.state?.dayPlaces || tripData.dayPlaces || {};
  const dayNotes = location.state?.dayNotes || tripData.dayNotes || {};
  const dayChecklists = location.state?.dayChecklists || tripData.dayChecklists || {};
  
  
  
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

  // Calculate total amount for both direct booking and trip planning
  const getCalculatedTotalAmount = () => {
    if (isDirectBooking && tripData.directBooking) {
      return tripData.directBooking.reduce((total, booking) => total + booking.totalPrice, 0);
    }
    return getTotalAmount();
  };

  // Get bookings data for display
  const getBookingsData = () => {
    if (isDirectBooking && tripData.directBooking) {
      return tripData.directBooking;
    }
    // Use planningBookings from tripData if available (from TripSummaryModal), otherwise use hook
    return tripData.planningBookings || planningBookings;
  };

  // Calculate trip days for summary
  const tripDays = [];
  if (actualTripData?.startDate && actualTripData?.endDate) {
    const start = new Date(actualTripData.startDate);
    const end = new Date(actualTripData.endDate);
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
  const bookingsToProcess = getBookingsData();
  Object.entries(bookingsToProcess).forEach(([type, bookings]) => {
    if (Array.isArray(bookings)) {
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
    }
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prepare trip data for itinerary service
      const tripDataForItinerary = {
        tripData: actualTripData,
        planningBookings: getBookingsData(),
        dayPlaces: dayPlaces,
        dayNotes: dayNotes,
        dayChecklists: dayChecklists,
        totalAmount: getCalculatedTotalAmount(),
        paymentData: paymentData
      };

      console.log('Sending trip data to itinerary service:', tripDataForItinerary);

      // Store trip data in itinerary service
      const itineraryResponse = await itineraryAPI.storeCompletedTrip(tripDataForItinerary);
      
      console.log('Itinerary service response:', itineraryResponse);
      
      if (itineraryResponse.success) {
        console.log('✅ Trip data successfully stored in itinerary database');
        console.log('📊 Itinerary ID:', itineraryResponse.data.itineraryId);
        console.log('💰 Total Cost:', itineraryResponse.data.totalCost);
        console.log('📅 Day Plans:', itineraryResponse.data.dayPlans);
      }
      
      // Clear trip planning data after successful payment and storage
      clearTripPlanning();
      
      setPaymentSuccess(true);
      
      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        navigate('/user/mybookings', { 
          state: { 
            bookingConfirmed: true,
            tripData: tripData,
            totalAmount: getCalculatedTotalAmount(),
            itineraryData: itineraryResponse.data
          } 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Payment/Storage error:', error);
      
      // Check if it's an itinerary service error
      if (error.response?.data?.message?.includes('itinerary')) {
        alert('Payment successful, but failed to store trip data. Please contact support.');
      } else {
        alert('Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const hasBookings = isDirectBooking 
    ? (tripData.directBooking && tripData.directBooking.length > 0)
    : Object.values(getBookingsData()).some(bookings => Array.isArray(bookings) && bookings.length > 0) ||
      (dayPlaces && Object.keys(dayPlaces).length > 0) ||
      (dayNotes && Object.keys(dayNotes).length > 0) ||
      (dayChecklists && Object.keys(dayChecklists).length > 0);

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
              <div className="text-2xl font-bold text-white">{formatCurrency(getCalculatedTotalAmount())}</div>
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
                    <span className="text-sm text-gray-700">{actualTripData?.destination || 'Sri Lanka'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">
                      {actualTripData?.startDate && actualTripData?.endDate
                        ? `${formatDate(actualTripData.startDate)} - ${formatDate(actualTripData.endDate)}`
                        : 'Dates not selected'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">{actualTripData?.travelers || 2} travelers</span>
                  </div>
                </div>
              </div>

              {/* Daily Bookings */}
              <div className="space-y-4">
                {(() => {
                  // Get all day numbers that have any data (bookings or user data)
                  const allDayNumbers = new Set([
                    ...Object.keys(dailyBookings).map(Number),
                    ...(dayPlaces ? Object.keys(dayPlaces).map(Number) : []),
                    ...(dayNotes ? Object.keys(dayNotes).map(Number) : []),
                    ...(dayChecklists ? Object.keys(dayChecklists).map(Number) : [])
                  ]);
                  

                  // Create entries for days that have user data but no bookings
                  allDayNumbers.forEach(dayNum => {
                    if (!dailyBookings[dayNum]) {
                      dailyBookings[dayNum] = {
                        date: tripDays[dayNum - 1] || new Date(),
                        destinations: [],
                        accommodations: [],
                        transportation: [],
                        guides: []
                      };
                    }
                  });

                  return Object.entries(dailyBookings);
                })().map(([dayNum, dayData]) => {
                  const hasActivities = dayData.destinations.length > 0 || 
                                      dayData.accommodations.length > 0 || 
                                      dayData.transportation.length > 0 || 
                                      dayData.guides.length > 0 ||
                                      (dayPlaces && dayPlaces[dayNum] && dayPlaces[dayNum].length > 0) ||
                                      (dayNotes && dayNotes[dayNum] && dayNotes[dayNum].length > 0) ||
                                      (dayChecklists && dayChecklists[dayNum] && dayChecklists[dayNum].length > 0);

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
                            {(() => {
                              const bookingCount = dayData.destinations.length + dayData.accommodations.length + dayData.transportation.length + dayData.guides.length;
                              const placesCount = (dayPlaces && dayPlaces[dayNum] ? dayPlaces[dayNum].length : 0);
                              const notesCount = (dayNotes && dayNotes[dayNum] ? dayNotes[dayNum].length : 0);
                              const checklistsCount = (dayChecklists && dayChecklists[dayNum] ? dayChecklists[dayNum].length : 0);
                              return bookingCount + placesCount + notesCount + checklistsCount;
                            })()} items
                          </span>
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className="p-4 space-y-3">
                        {/* Bookings (Accommodations, Transportation, Guides, Destinations) */}
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

                        {/* Day Places */}
                        {dayPlaces && dayPlaces[dayNum] && dayPlaces[dayNum].length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-gray-700 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                              Places to Visit
                            </h5>
                            {dayPlaces[dayNum].map((place, index) => (
                              <div key={index} className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h6 className="text-sm font-semibold text-gray-800">{place.name}</h6>
                                    <p className="text-xs text-gray-600">{place.address}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs text-gray-500">
                                      {place.duration || '2-3 hours'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Day Notes */}
                        {dayNotes && dayNotes[dayNum] && dayNotes[dayNum].length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-gray-700 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Notes
                            </h5>
                            {dayNotes[dayNum].map((note, index) => (
                              <div key={index} className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-500">
                                <p className="text-sm text-gray-800">{note.content}</p>
                                {note.timestamp && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(note.timestamp).toLocaleTimeString()}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Day Checklists */}
                        {dayChecklists && dayChecklists[dayNum] && dayChecklists[dayNum].length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-gray-700 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              Checklists
                            </h5>
                            {dayChecklists[dayNum].map((checklist, index) => {
                              const completedCount = checklist.items.filter(item => item.completed).length;
                              const totalCount = checklist.items.length;
                              
                              return (
                                <div key={index} className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                                  <div className="flex items-center justify-between mb-2">
                                    <h6 className="text-sm font-semibold text-gray-800">{checklist.title}</h6>
                                    <span className="text-xs text-gray-500">{completedCount}/{totalCount} completed</span>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    {checklist.items.slice(0, 3).map((item) => (
                                      <div key={item.id} className="flex items-center">
                                        <div className={`w-4 h-4 mr-2 ${item.completed ? 'text-green-500' : 'text-gray-400'}`}>
                                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                        </div>
                                        <span className={`text-xs ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                          {item.title}
                                        </span>
                                      </div>
                                    ))}
                                    {checklist.items.length > 3 && (
                                      <div className="text-xs text-gray-500 ml-6">
                                        +{checklist.items.length - 3} more items
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="border-t pt-4 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-emerald-600">{formatCurrency(getCalculatedTotalAmount())}</span>
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
                      `Pay ${formatCurrency(getCalculatedTotalAmount())}`
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