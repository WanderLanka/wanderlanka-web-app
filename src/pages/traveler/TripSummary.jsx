import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Download, 
  Edit3, 
  Hotel, 
  Car, 
  UserCheck, 
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  CheckCircle,
  Share2
} from 'lucide-react';
import { Button, Card } from '../../components/common';
import { useTripPlanning } from '../../hooks/useTripPlanning';

const TripSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planningBookings, getTotalAmount } = useTripPlanning();
  
  const [collapsedDays, setCollapsedDays] = useState(new Set());
  
  // Get trip data from navigation state or default values
  const tripData = useMemo(() => {
    return location.state?.tripData || {
      destination: 'Sri Lanka',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      travelers: 2,
      tripName: 'My Sri Lanka Adventure'
    };
  }, [location.state]);

  // Calculate trip days
  const tripDays = useMemo(() => {
    if (!tripData.startDate || !tripData.endDate) return [];
    
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const days = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  }, [tripData.startDate, tripData.endDate]);

  // Organize bookings by day
  const dailyItinerary = useMemo(() => {
    const itinerary = {};
    
    tripDays.forEach((day, index) => {
      const dayNum = index + 1;
      itinerary[dayNum] = {
        date: day,
        destinations: [],
        accommodations: [],
        transportation: [],
        guides: []
      };
    });

    // Distribute bookings across days
    Object.entries(planningBookings).forEach(([type, bookings]) => {
      bookings.forEach(booking => {
        const day = booking.selectedDay || 1;
        if (itinerary[day]) {
          if (type === 'destinations') {
            itinerary[day].destinations.push(booking);
          } else if (type === 'accommodations') {
            itinerary[day].accommodations.push(booking);
          } else if (type === 'transportation') {
            itinerary[day].transportation.push(booking);
          } else if (type === 'guides') {
            itinerary[day].guides.push(booking);
          }
        }
      });
    });

    return itinerary;
  }, [tripDays, planningBookings]);

  // Calculate summary statistics
  const tripStats = useMemo(() => {
    const totalNights = tripDays.length - 1;
    const totalDestinations = planningBookings.destinations.length;
    const totalAccommodations = planningBookings.accommodations.length;
    const totalTransportation = planningBookings.transportation.length;
    const totalGuides = planningBookings.guides.length;
    const totalCost = getTotalAmount();

    return {
      nights: totalNights,
      destinations: totalDestinations,
      accommodations: totalAccommodations,
      transportation: totalTransportation,
      guides: totalGuides,
      totalCost
    };
  }, [tripDays, planningBookings, getTotalAmount]);

  const toggleDayCollapse = (dayNum) => {
    const newCollapsed = new Set(collapsedDays);
    if (newCollapsed.has(dayNum)) {
      newCollapsed.delete(dayNum);
    } else {
      newCollapsed.add(dayNum);
    }
    setCollapsedDays(newCollapsed);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
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

  const handleEditTrip = () => {
    navigate('/user/trip-planning', { 
      state: tripData 
    });
  };

  const handleDownloadItinerary = () => {
    // TODO: Implement PDF download functionality
    console.log('Download itinerary');
  };

  const handleConfirmTrip = () => {
    // TODO: Implement trip confirmation functionality
    console.log('Confirm trip');
  };

  const renderBookingItem = (item, type, isLast = false) => {
    const getIcon = () => {
      switch (type) {
        case 'destinations': return <MapPin className="w-4 h-4 text-emerald-600" />;
        case 'accommodations': return <Hotel className="w-4 h-4 text-blue-600" />;
        case 'transportation': return <Car className="w-4 h-4 text-purple-600" />;
        case 'guides': return <UserCheck className="w-4 h-4 text-orange-600" />;
        default: return <MapPin className="w-4 h-4 text-gray-600" />;
      }
    };

    const getBgColor = () => {
      switch (type) {
        case 'destinations': return 'bg-emerald-50 border-emerald-200';
        case 'accommodations': return 'bg-blue-50 border-blue-200';
        case 'transportation': return 'bg-purple-50 border-purple-200';
        case 'guides': return 'bg-orange-50 border-orange-200';
        default: return 'bg-gray-50 border-gray-200';
      }
    };

    return (
      <div key={`${type}-${item.id}`} className={`flex items-center p-3 rounded-lg border ${getBgColor()} ${!isLast ? 'mb-2' : ''}`}>
        <div className="flex items-center flex-1">
          <div className="p-2 bg-white rounded-full mr-3">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{item.name || item.title}</h4>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              {item.location && (
                <>
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="mr-3">{item.location}</span>
                </>
              )}
              {item.duration && (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{item.duration}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {formatCurrency(item.totalPrice || item.price || 0)}
          </p>
          {item.tripDate && (
            <p className="text-xs text-gray-500">{item.tripDate}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{tripData.tripName}</h1>
                <div className="flex items-center mt-2 text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="mr-6">
                    {formatDate(new Date(tripData.startDate))} - {formatDate(new Date(tripData.endDate))}
                  </span>
                  <Users className="w-4 h-4 mr-2" />
                  <span>{tripData.travelers} travelers</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleEditTrip}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Trip
              </Button>
              <Button variant="outline" onClick={handleDownloadItinerary}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Main Content - Daily Itinerary */}
          <div className="lg:col-span-3 space-y-6">
            {Object.entries(dailyItinerary).map(([dayNum, dayData]) => {
              const isCollapsed = collapsedDays.has(parseInt(dayNum));
              const hasActivities = dayData.destinations.length > 0 || 
                                  dayData.accommodations.length > 0 || 
                                  dayData.transportation.length > 0 || 
                                  dayData.guides.length > 0;

              return (
                <Card key={dayNum} className="overflow-hidden">
                  {/* Day Header */}
                  <div 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-blue-50 cursor-pointer lg:cursor-default"
                    onClick={() => window.innerWidth < 1024 && toggleDayCollapse(parseInt(dayNum))}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                        {dayNum}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Day {dayNum}</h2>
                        <p className="text-gray-600">{formatDate(dayData.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {hasActivities && (
                        <div className="flex items-center space-x-4 mr-4">
                          {dayData.destinations.length > 0 && (
                            <div className="flex items-center text-emerald-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{dayData.destinations.length}</span>
                            </div>
                          )}
                          {dayData.accommodations.length > 0 && (
                            <div className="flex items-center text-blue-600">
                              <Hotel className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{dayData.accommodations.length}</span>
                            </div>
                          )}
                          {dayData.transportation.length > 0 && (
                            <div className="flex items-center text-purple-600">
                              <Car className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{dayData.transportation.length}</span>
                            </div>
                          )}
                          {dayData.guides.length > 0 && (
                            <div className="flex items-center text-orange-600">
                              <UserCheck className="w-4 h-4 mr-1" />
                              <span className="text-sm font-medium">{dayData.guides.length}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Mobile collapse toggle */}
                      <button className="lg:hidden">
                        {isCollapsed ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Day Content */}
                  <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
                    {hasActivities ? (
                      <div className="p-6 space-y-6">
                        {/* Destinations */}
                        {dayData.destinations.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                              <MapPin className="w-5 h-5 text-emerald-600 mr-2" />
                              Places to Visit
                            </h3>
                            <div>
                              {dayData.destinations.map((item, index) => 
                                renderBookingItem(item, 'destinations', index === dayData.destinations.length - 1)
                              )}
                            </div>
                          </div>
                        )}

                        {/* Accommodations */}
                        {dayData.accommodations.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                              <Hotel className="w-5 h-5 text-blue-600 mr-2" />
                              Accommodation
                            </h3>
                            <div>
                              {dayData.accommodations.map((item, index) => 
                                renderBookingItem(item, 'accommodations', index === dayData.accommodations.length - 1)
                              )}
                            </div>
                          </div>
                        )}

                        {/* Transportation */}
                        {dayData.transportation.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                              <Car className="w-5 h-5 text-purple-600 mr-2" />
                              Transportation
                            </h3>
                            <div>
                              {dayData.transportation.map((item, index) => 
                                renderBookingItem(item, 'transportation', index === dayData.transportation.length - 1)
                              )}
                            </div>
                          </div>
                        )}

                        {/* Guides */}
                        {dayData.guides.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                              <UserCheck className="w-5 h-5 text-orange-600 mr-2" />
                              Tour Guide
                            </h3>
                            <div>
                              {dayData.guides.map((item, index) => 
                                renderBookingItem(item, 'guides', index === dayData.guides.length - 1)
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center py-12">
                        <div className="text-gray-400 mb-3">
                          <Calendar className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities planned</h3>
                        <p className="text-gray-600 mb-4">Add some destinations, accommodations, or activities for this day.</p>
                        <Button variant="outline" size="sm" onClick={handleEditTrip}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activities
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Sidebar - Trip Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="sticky top-6 space-y-6">
              {/* Trip Overview */}
              <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-600">Total Nights</span>
                    </div>
                    <span className="font-semibold text-gray-900">{tripStats.nights}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-emerald-600 mr-2" />
                      <span className="text-sm text-gray-600">Destinations</span>
                    </div>
                    <span className="font-semibold text-gray-900">{tripStats.destinations}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Hotel className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Accommodations</span>
                    </div>
                    <span className="font-semibold text-gray-900">{tripStats.accommodations}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="text-sm text-gray-600">Transportation</span>
                    </div>
                    <span className="font-semibold text-gray-900">{tripStats.transportation}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 text-orange-600 mr-2" />
                      <span className="text-sm text-gray-600">Tour Guides</span>
                    </div>
                    <span className="font-semibold text-gray-900">{tripStats.guides}</span>
                  </div>

                  <div className="border-t pt-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Total Cost</span>
                      </div>
                      <span className="font-bold text-green-600 text-lg">{formatCurrency(tripStats.totalCost)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={handleConfirmTrip}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Trip
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleEditTrip}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Day
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleEditTrip}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Modify Itinerary
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;