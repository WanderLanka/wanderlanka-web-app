import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, Calendar, Users, Plane, Hotel, Car, UserCheck, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './common';
import { useTripPlanning } from '../hooks/useTripPlanning';

const TripSummaryModal = ({ isOpen, onClose, tripData }) => {
  const navigate = useNavigate();
  const { planningBookings, removeFromTripPlanning, getTotalAmount, clearTripPlanning } = useTripPlanning();
  const [collapsedDays, setCollapsedDays] = useState(new Set());

  if (!isOpen) return null;

  const toggleDayCollapse = (dayNum) => {
    const newCollapsed = new Set(collapsedDays);
    if (newCollapsed.has(dayNum)) {
      newCollapsed.delete(dayNum);
    } else {
      newCollapsed.add(dayNum);
    }
    setCollapsedDays(newCollapsed);
  };

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

  const renderBookingItem = (booking, type, icon) => {
    const Icon = icon;
    return (
      <div key={`${type}-${booking.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 rounded-full">
            <Icon className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{booking.name || booking.title}</h4>
            <p className="text-sm text-gray-600">
              {booking.location && `${booking.location} • `}
              {formatCurrency(booking.totalPrice || booking.price || booking.cost || 0)}
            </p>
          </div>
        </div>
        <button
          onClick={() => removeFromTripPlanning(booking.id, type)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Remove from trip"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const hasBookings = Object.values(planningBookings).some(bookings => bookings.length > 0);

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-full">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Trip Summary</h2>
              <p className="text-sm text-gray-200">Review your selected items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trip Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasBookings ? (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items selected</h3>
              <p className="text-gray-600">Start browsing and adding items to your trip to see them here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                // Calculate trip days
                const tripDays = [];
                if (tripData?.startDate && tripData?.endDate) {
                  const start = new Date(tripData.startDate);
                  const end = new Date(tripData.endDate);
                  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    tripDays.push(new Date(d));
                  }
                }

                // Organize bookings by day
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
                    // Find the matching day based on selectedDate
                    let matchingDayNum = 1; // default to day 1
                    
                    if (booking.selectedDate) {
                      try {
                        // Find which day this booking belongs to by comparing dates
                        const bookingDate = new Date(booking.selectedDate).toISOString().split('T')[0];
                        tripDays.forEach((tripDay, index) => {
                          const tripDayStr = tripDay.toISOString().split('T')[0];
                          if (bookingDate === tripDayStr) {
                            matchingDayNum = index + 1;
                          }
                        });
                      } catch (error) {
                        console.warn('Error parsing booking date:', booking.selectedDate, error);
                        // Keep default matchingDayNum = 1
                      }
                    }
                    
                    // Add booking to the appropriate day and type
                    if (dailyBookings[matchingDayNum]) {
                      const targetArray = dailyBookings[matchingDayNum][type] || dailyBookings[matchingDayNum]['destinations'];
                      if (targetArray) {
                        targetArray.push(booking);
                      }
                    }
                  });
                });

                return Object.entries(dailyBookings).map(([dayNum, dayData]) => {
                  const hasActivities = dayData.destinations.length > 0 || 
                                      dayData.accommodations.length > 0 || 
                                      dayData.transportation.length > 0 || 
                                      dayData.guides.length > 0;

                  if (!hasActivities) return null;

                  const isCollapsed = collapsedDays.has(parseInt(dayNum));
                  
                  return (
                    <div key={dayNum} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Day Header */}
                      <div 
                        className={`bg-green-50 hover:bg-green-100 p-4 ${!isCollapsed ? 'border-b border-gray-200' : ''} cursor-pointer transition-all duration-200`}
                        onClick={() => toggleDayCollapse(parseInt(dayNum))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                              {dayNum}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-900">Day {dayNum}</h3>
                                {isCollapsed && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                      {dayData.destinations.length + dayData.accommodations.length + dayData.transportation.length + dayData.guides.length} items
                                    </span>
                                    {dayData.destinations.length > 0 && (
                                      <div className="flex gap-1 max-w-[200px] overflow-hidden">
                                        {dayData.destinations.slice(0, 2).map(place => (
                                          <span key={place.id} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full truncate">
                                            {place.name}
                                          </span>
                                        ))}
                                        {dayData.destinations.length > 2 && (
                                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                                            +{dayData.destinations.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {dayData.date.toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {/* Activity count badges */}
                            <div className="flex items-center space-x-2">
                              {dayData.destinations.length > 0 && (
                                <div className="flex items-center bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {dayData.destinations.length}
                                </div>
                              )}
                              {dayData.accommodations.length > 0 && (
                                <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  <Hotel className="w-3 h-3 mr-1" />
                                  {dayData.accommodations.length}
                                </div>
                              )}
                              {dayData.transportation.length > 0 && (
                                <div className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                  <Car className="w-3 h-3 mr-1" />
                                  {dayData.transportation.length}
                                </div>
                              )}
                              {dayData.guides.length > 0 && (
                                <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  {dayData.guides.length}
                                </div>
                              )}
                            </div>

                            {/* Collapse toggle button */}
                            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                              {isCollapsed ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronUp className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Day Content */}
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
                        <div className="p-4 space-y-4">
                        {/* Destinations for this day */}
                        {dayData.destinations.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 text-emerald-600 mr-1" />
                              Places to Visit
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {dayData.destinations.map(booking => (
                                <div 
                                  key={`destination-${booking.id}`}
                                  className="flex items-center bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium group hover:bg-emerald-200 transition-colors"
                                >
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{booking.name || booking.title}</span>
                                  <button
                                    onClick={() => removeFromTripPlanning(booking.id, 'destinations')}
                                    className="ml-1 text-emerald-600 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove from trip"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Accommodations for this day */}
                        {dayData.accommodations.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                              <Hotel className="w-4 h-4 text-blue-600 mr-1" />
                              Accommodation
                            </h4>
                            <div className="space-y-2">
                              {dayData.accommodations.map(booking => 
                                renderBookingItem(booking, 'accommodations', Hotel)
                              )}
                            </div>
                          </div>
                        )}

                        {/* Transportation for this day */}
                        {dayData.transportation.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                              <Car className="w-4 h-4 text-purple-600 mr-1" />
                              Transportation
                            </h4>
                            <div className="space-y-2">
                              {dayData.transportation.map(booking => 
                                renderBookingItem(booking, 'transportation', Car)
                              )}
                            </div>
                          </div>
                        )}

                        {/* Guides for this day */}
                        {dayData.guides.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                              <UserCheck className="w-4 h-4 text-orange-600 mr-1" />
                              Tour Guide
                            </h4>
                            <div className="space-y-2">
                              {dayData.guides.map(booking => 
                                renderBookingItem(booking, 'guides', UserCheck)
                              )}
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </div>
                  );
                }).filter(Boolean);
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasBookings && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Total Estimated Cost: {formatCurrency(getTotalAmount())}
                </p>
                <p className="text-sm text-gray-600">
                  {Object.values(planningBookings).reduce((total, bookings) => total + bookings.length, 0)} items selected
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all items from your trip planning?')) {
                    clearTripPlanning();
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Clear All
              </button>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Continue Planning
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  // Navigate to booking payment page
                  localStorage.setItem('currentTripData', JSON.stringify(tripData));
                  navigate('/user/booking-payment', { 
                    state: { 
                      tripData: tripData,
                      planningBookings: planningBookings 
                    } 
                  });
                  onClose();
                }}
              >
                Proceed to Booking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripSummaryModal;
