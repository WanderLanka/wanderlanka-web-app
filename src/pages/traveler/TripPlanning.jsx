import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Hotel, 
  Car, 
  Camera,
  Star,
  Heart,
  ArrowLeft,
  Plus,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/common';
import { useTripPlanning } from '../../hooks/useTripPlanning';
import NavigationWarningModal from '../../components/NavigationWarningModal';
import Toast from '../../components/Toast';
import TripSummaryModal from '../../components/TripSummaryModal';

const TripPlanning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItemsCount, addToTripPlanning, planningBookings, removeFromTripPlanning } = useTripPlanning();
  
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [showAccommodationCards, setShowAccommodationCards] = useState(false);
  const [showTransportCards, setShowTransportCards] = useState(false);
  const [showGuideCards, setShowGuideCards] = useState(false);

  // Mock data for available activities
  const mockPlaces = [
    {
      id: 1,
      name: "Sigiriya Rock Fortress",
      location: "Sigiriya",
      type: "Historical Site",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1580910527739-556eb89f9d65?q=80&w=1074&auto=format&fit=crop",
      price: "LKR 2,500",
      duration: "2-3 hours",
      description: "Ancient rock fortress and palace ruins with stunning views from the top of the rock."
    },
    {
      id: 2,
      name: "Temple of the Tooth",
      location: "Kandy",
      type: "Religious Site",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1642498041677-d26b9dfc5e61?q=80&w=688&auto=format&fit=crop",
      price: "LKR 1,500",
      duration: "1-2 hours",
      description: "Sacred Buddhist temple housing the tooth relic of Buddha, a UNESCO World Heritage site."
    },
    {
      id: 3,
      name: "Ella Nine Arch Bridge",
      location: "Ella",
      type: "Scenic Spot",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?q=80&w=1172&auto=format&fit=crop",
      price: "Free",
      duration: "1 hour",
      description: "Iconic railway bridge in the hill country offering spectacular views."
    }
  ];

  const mockAccommodations = [
    {
      id: 1,
      name: "Heritance Kandalama",
      location: "Dambulla",
      type: "Luxury Resort",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?q=80&w=1170&auto=format&fit=crop",
      price: "LKR 35,000 / night",
      amenities: ["Pool", "Spa", "Restaurant", "WiFi"],
      description: "Eco-luxury resort designed by Geoffrey Bawa, blending with nature."
    },
    {
      id: 2,
      name: "Cinnamon Lodge Habarana",
      location: "Habarana",
      type: "Nature Resort",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1525849306000-cc26ceb5c1d7?q=80&w=735&auto=format&fit=crop",
      price: "LKR 28,000 / night",
      amenities: ["Pool", "Restaurant", "Wildlife Tours", "WiFi"],
      description: "Rustic luxury in the heart of nature with wildlife experiences."
    }
  ];

  const mockTransport = [
    {
      id: 1,
      name: "Air-Conditioned Car",
      type: "Private Vehicle",
      capacity: "4 passengers",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1170&auto=format&fit=crop",
      price: "LKR 8,000 / day",
      features: ["AC", "Driver", "Fuel Included"],
      description: "Comfortable private car with experienced driver for sightseeing."
    },
    {
      id: 2,
      name: "Tuk Tuk Adventure",
      type: "Three Wheeler",
      capacity: "3 passengers",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1170&auto=format&fit=crop",
      price: "LKR 3,500 / day",
      features: ["Local Experience", "Driver", "Flexible Route"],
      description: "Authentic local transport experience with friendly drivers."
    }
  ];

  const mockGuides = [
    {
      id: 1,
      name: "Rohan Silva",
      specialization: "Cultural Guide",
      experience: "8 years",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop",
      price: "LKR 12,000 / day",
      languages: ["English", "Sinhala", "Tamil"],
      description: "Expert in cultural sites, traditional crafts, and local history."
    },
    {
      id: 2,
      name: "Anura Perera",
      specialization: "Wildlife Guide",
      experience: "10 years",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1170&auto=format&fit=crop",
      price: "LKR 15,000 / day",
      languages: ["English", "Sinhala"],
      description: "Specialist in wildlife photography and safari tours."
    }
  ];

  // Helper function to render activity cards
  const renderActivityCard = (item, type) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-24">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1 right-1">
          <div className="bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center">
            <Star className="h-2.5 w-2.5 text-yellow-500 mr-0.5" />
            <span className="text-xs font-medium">{item.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-2">
        <h5 className="font-medium text-gray-900 text-xs mb-1 line-clamp-1">{item.name}</h5>
        
        {/* Only show name for places, show other details for other types */}
        {type !== 'places' && (
          <>
            <p className="text-xs text-gray-600 mb-1.5 line-clamp-1">
              {type === 'accommodations' && item.location}
              {type === 'transport' && item.type}
              {type === 'guides' && item.specialization}
            </p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-600 truncate">{item.price}</span>
              {type === 'transport' && (
                <span className="text-xs text-gray-500 ml-1">{item.capacity}</span>
              )}
              {type === 'guides' && (
                <span className="text-xs text-gray-500 ml-1">{item.experience}</span>
              )}
            </div>
          </>
        )}
        
        {/* Different button layout based on type */}
        {type === 'places' ? (
          // Places: + button to add to itinerary
          <Button 
            size="xs" 
            variant="primary" 
            className="w-full text-xs py-1 px-2 h-7 bg-slate-800 hover:bg-slate-900 text-white border-slate-800 font-medium shadow-sm"
            onClick={() => handleAddToDay(item)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        ) : (
          // Other types: Two buttons - Add to Summary and View Details
          <div className="flex gap-1">
            <Button 
              size="xs" 
              variant="primary" 
              className="flex-1 text-xs py-1 px-2 h-7 bg-slate-800 hover:bg-slate-900 text-white border-slate-800 font-medium shadow-sm transition-all duration-200 hover:scale-105"
              onClick={() => {
                switch (type) {
                  case 'accommodations':
                    handleAddAccommodation(item);
                    break;
                  case 'transport':
                    handleAddTransport(item);
                    break;
                  case 'guides':
                    handleAddGuide(item);
                    break;
                  default:
                    break;
                }
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
            <Button 
              size="xs" 
              variant="outline" 
              className="flex-1 text-xs py-1 px-2 h-7 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              onClick={() => handleNavigateToDetails(item, type)}
            >
              Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // Handler functions
  const handleNavigateToDetails = (item, type) => {
    // Navigate to specific details pages based on type
    switch (type) {
      case 'accommodations':
        navigate(`/user/accommodations/${item.id}`, { 
          state: { 
            selectedItem: item,
            returnTo: '/user/trip-planning',
            tripData: tripData,
            selectedDate: selectedDateIndex,
            fromTripPlanning: true,
            showAddToItinerary: true,
            source: 'trip-planning'
          } 
        });
        break;
      case 'transport':
        navigate(`/user/transportation/${item.id}`, { 
          state: { 
            selectedItem: item,
            returnTo: '/user/trip-planning',
            tripData: tripData,
            selectedDate: selectedDateIndex,
            fromTripPlanning: true,
            showAddToItinerary: true,
            source: 'trip-planning'
          } 
        });
        break;
      case 'guides':
        navigate(`/user/tour-guides/${item.id}`, { 
          state: { 
            selectedItem: item,
            returnTo: '/user/trip-planning',
            tripData: tripData,
            selectedDate: selectedDateIndex,
            fromTripPlanning: true,
            showAddToItinerary: true,
            source: 'trip-planning'
          } 
        });
        break;
      default:
        // Fallback to modal for other types
        setSelectedDetailItem({ ...item, type });
        setShowDetailModal(true);
    }
  };

  const handleAddToDay = (item) => {
    const placeData = {
      ...item,
      type: 'place',
      selectedDay: selectedDateIndex + 1,
      addedAt: new Date().toISOString()
    };
    
    addToTripPlanning(placeData, 'destinations');
    setToastMessage(`${item.name} added to Day ${selectedDateIndex + 1}`);
    setShowToast(true);
    setHasUnsavedProgress(true);
  };

  // Service handlers for adding to trip planning summary
  const handleAddAccommodation = (accommodation) => {
    const accommodationData = {
      ...accommodation,
      type: 'accommodation',
      selectedDay: selectedDateIndex + 1,
      quantity: 1,
      totalPrice: parseFloat(accommodation.price?.replace(/[^\d]/g, '') || 0),
      addedAt: new Date().toISOString()
    };
    
    addToTripPlanning(accommodationData, 'accommodations');
    setToastMessage(`${accommodation.name} added to trip summary`);
    setShowToast(true);
    setShowAccommodationCards(false);
  };

  const handleAddTransport = (transport) => {
    const transportData = {
      ...transport,
      type: 'transport',
      selectedDay: selectedDateIndex + 1,
      quantity: 1,
      totalPrice: parseFloat(transport.price?.replace(/[^\d]/g, '') || 0),
      addedAt: new Date().toISOString()
    };
    
    addToTripPlanning(transportData, 'transportation');
    setToastMessage(`${transport.name} added to trip summary`);
    setShowToast(true);
    setShowTransportCards(false);
  };

  const handleAddGuide = (guide) => {
    const guideData = {
      ...guide,
      type: 'guide',
      selectedDay: selectedDateIndex + 1,
      quantity: 1,
      totalPrice: parseFloat(guide.price?.replace(/[^\d]/g, '') || 0),
      addedAt: new Date().toISOString()
    };
    
    addToTripPlanning(guideData, 'guides');
    setToastMessage(`${guide.name} added to trip summary`);
    setShowToast(true);
    setShowGuideCards(false);
  };

  // Function to render selected services as cards
  const renderSelectedServiceCard = (service, serviceType) => {
    const getServiceIcon = (type) => {
      switch (type) {
        case 'accommodations': return Hotel;
        case 'transportation': return Car;
        case 'guides': return Users;
        default: return Hotel;
      }
    };

    const getServiceStyles = (type) => {
      switch (type) {
        case 'accommodations': 
          return {
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
          };
        case 'transportation': 
          return {
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
          };
        case 'guides': 
          return {
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600'
          };
        default: 
          return {
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
          };
      }
    };

    const Icon = getServiceIcon(serviceType);
    const styles = getServiceStyles(serviceType);

    return (
      <div key={`${serviceType}-${service.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`p-2 ${styles.iconBg} rounded-lg`}>
              <Icon className={`h-4 w-4 ${styles.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-gray-900 text-sm mb-1 truncate">{service.name}</h5>
              {service.location && (
                <p className="text-xs text-gray-600 mb-1">{service.location}</p>
              )}
              {service.type && serviceType === 'transportation' && (
                <p className="text-xs text-gray-600 mb-1">{service.type}</p>
              )}
              {service.specialization && serviceType === 'guides' && (
                <p className="text-xs text-gray-600 mb-1">{service.specialization}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600">
                  {service.price || `LKR ${service.totalPrice || 0}`}
                </span>
                <span className="text-xs text-gray-500">Day {service.selectedDay}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => removeFromTripPlanning(service.id, serviceType)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
            title="Remove from trip"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Function to get selected services for current day and type
  const getSelectedServicesForDay = (serviceType) => {
    const currentDay = selectedDateIndex + 1;
    return planningBookings[serviceType]?.filter(service => service.selectedDay === currentDay) || [];
  };

  // Get trip data from navigation state or default values
  const defaultDates = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 3);
    
    return {
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: dayAfter.toISOString().split('T')[0]
    };
  }, []);
  
  const tripData = useMemo(() => {
    return location.state || {
      destination: 'Sri Lanka',
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      travelers: 2
    };
  }, [location.state, defaultDates]);

  // Check if user accessed this page directly without proper form submission
  useEffect(() => {
    if (!location.state) {
      // Show a warning toast that they're using default values
      setToastMessage('Using default trip settings. Go back to dashboard to customize your trip.');
      setShowToast(true);
    }
  }, [location.state]);

  // Calculate trip days with memoization to prevent infinite re-renders
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



  // Track user activity to detect unsaved progress
  useEffect(() => {
    const handleUserActivity = () => {
      setHasUnsavedProgress(true);
    };

    // Add event listeners for user activity
    const activityEvents = ['click', 'keydown', 'change'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, { once: true });
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  // Navigation guard - prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedProgress) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedProgress]);

  const handleSafeNavigation = (navigationFn) => {
    if (hasUnsavedProgress) {
      setPendingNavigation(() => navigationFn);
      setShowNavigationWarning(true);
    } else {
      navigationFn();
    }
  };

  const handleConfirmNavigation = () => {
    setShowNavigationWarning(false);
    setHasUnsavedProgress(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  };



  const hideToast = () => {
    setShowToast(false);
    setToastMessage('');
  };







  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Trip Planning */}
      <div className={`bg-white shadow-lg overflow-y-auto transition-all duration-300 ${
        isPanelExpanded ? 'w-full' : 'w-1/2'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => handleSafeNavigation(() => navigate(-1))}
              className="flex items-center text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            
            {/* Panel Toggle Button */}
            <button
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              className="flex items-center text-white/90 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              title={isPanelExpanded ? 'Show Map' : 'Hide Map'}
            >
              {isPanelExpanded ? (
                <>
                  <Minimize2 className="w-5 h-5 mr-2" />
                  Show Map
                </>
              ) : (
                <>
                  <Maximize2 className="w-5 h-5 mr-2" />
                  Expand Panel
                </>
              )}
            </button>
          </div>
          
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-4">Plan Your Trip</h1>

            {/* Trip Overview with Date Selector */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-medium text-white/90 mb-3">Select Date to Plan</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {tripDays.map((day, dayIndex) => {
                  const dayNumber = dayIndex + 1;
                  const dayDate = day.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                  });

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => setSelectedDateIndex(dayIndex)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 text-xs ${
                        selectedDateIndex === dayIndex
                          ? 'border-white bg-white text-emerald-700 font-semibold'
                          : 'border-white/30 bg-white/10 text-white/90 hover:border-white/50 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">Day {dayNumber}</div>
                        <div>{dayDate}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              
              
              {/* Trip Duration Info */}
              {tripDays.length > 0 && (
                <div className="mt-2 text-xs text-white/70">
                  Trip Duration: {tripDays.length} day{tripDays.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - Trip Days */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Trip Itinerary</h2>

          {/* Selected Day Planning */}
          {tripDays.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Day {selectedDateIndex + 1} - {tripDays[selectedDateIndex]?.toLocaleDateString('en-US', { weekday: 'long' })}
                    </h3>
                    <p className="text-emerald-100 text-sm">
                      {tripDays[selectedDateIndex]?.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: tripDays[selectedDateIndex]?.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-emerald-200" />
                </div>
              </div>

              {/* Day Content */}
              <div className="p-4 space-y-6">
                {/* Places Section - Horizontal Scroll */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-emerald-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Places to Visit</h4>
                    </div>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                    {mockPlaces.map(place => (
                      <div key={place.id} className="flex-shrink-0 w-32">
                        {renderActivityCard(place, 'places')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accommodation Section */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Hotel className="h-4 w-4 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Accommodation</h4>
                    </div>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      className="text-xs bg-slate-800 hover:bg-slate-900 text-white border-slate-800 font-medium shadow-sm px-3 py-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={() => setShowAccommodationCards(!showAccommodationCards)}
                    >
                      {showAccommodationCards ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                      {showAccommodationCards ? 'Close' : 'Add'}
                    </Button>
                  </div>
                  
                  {/* Show selected accommodations for current day */}
                  {getSelectedServicesForDay('accommodations').length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Selected for Day {selectedDateIndex + 1}</h5>
                      <div className="grid grid-cols-1 gap-3">
                        {getSelectedServicesForDay('accommodations').map(service => 
                          renderSelectedServiceCard(service, 'accommodations')
                        )}
                      </div>
                    </div>
                  )}

                  {showAccommodationCards && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {mockAccommodations.map(accommodation => renderActivityCard(accommodation, 'accommodations'))}
                    </div>
                  )}
                </div>

                {/* Transport Section */}
                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Car className="h-4 w-4 text-purple-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Transportation</h4>
                    </div>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      className="text-xs bg-slate-800 hover:bg-slate-900 text-white border-slate-800 font-medium shadow-sm px-3 py-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={() => setShowTransportCards(!showTransportCards)}
                    >
                      {showTransportCards ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                      {showTransportCards ? 'Close' : 'Add'}
                    </Button>
                  </div>
                  
                  {/* Show selected transportation for current day */}
                  {getSelectedServicesForDay('transportation').length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Selected for Day {selectedDateIndex + 1}</h5>
                      <div className="grid grid-cols-1 gap-3">
                        {getSelectedServicesForDay('transportation').map(service => 
                          renderSelectedServiceCard(service, 'transportation')
                        )}
                      </div>
                    </div>
                  )}

                  {showTransportCards && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {mockTransport.map(transport => renderActivityCard(transport, 'transport'))}
                    </div>
                  )}
                </div>

                {/* Guide Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-orange-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Tour Guide</h4>
                    </div>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      className="text-xs bg-slate-800 hover:bg-slate-900 text-white border-slate-800 font-medium shadow-sm px-3 py-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      onClick={() => setShowGuideCards(!showGuideCards)}
                    >
                      {showGuideCards ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                      {showGuideCards ? 'Close' : 'Add'}
                    </Button>
                  </div>
                  
                  {/* Show selected guides for current day */}
                  {getSelectedServicesForDay('guides').length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Selected for Day {selectedDateIndex + 1}</h5>
                      <div className="grid grid-cols-1 gap-3">
                        {getSelectedServicesForDay('guides').map(service => 
                          renderSelectedServiceCard(service, 'guides')
                        )}
                      </div>
                    </div>
                  )}

                  {showGuideCards && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {mockGuides.map(guide => renderActivityCard(guide, 'guides'))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Map */}
      {!isPanelExpanded && (
        <div className="w-1/2 relative">
          {/* Google Maps Embedded Frame */}
          <div className="h-full w-full fixed right-0 top-0" style={{ width: '50%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2024842.5462878644!2d79.6956!3d7.8731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593cf65a1e9d%3A0xe13da4b400e2d38c!2sSri%20Lanka!5e0!3m2!1sen!2sus!4v1697461234567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sri Lanka Map"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      )}

      {/* Floating Trip Summary Button */}
      {getTotalItemsCount() > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowSummaryModal(true)}
            className="shadow-lg hover:shadow-xl transition-all duration-300 flex items-center bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 font-semibold hover:scale-105"
          >
            <span className="bg-white text-emerald-600 rounded-full px-2 py-1 text-sm font-bold mr-2 animate-pulse">
              {getTotalItemsCount()}
            </span>
            View Summary
          </Button>
        </div>
      )}

      {/* Floating Map Toggle Button (when panel is expanded) */}
      {isPanelExpanded && (
        <div className="fixed bottom-6 left-6 z-40">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setIsPanelExpanded(false)}
            className="shadow-lg hover:shadow-xl transition-shadow flex items-center bg-white text-gray-700 border border-gray-300"
          >
            <Minimize2 className="w-5 h-5 mr-2" />
            Show Map
          </Button>
        </div>
      )}

      {/* Navigation Warning Modal */}
      <NavigationWarningModal
        isOpen={showNavigationWarning}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />

      {/* Success Toast */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={hideToast}
      />

      {/* Trip Summary Modal */}
      <TripSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        tripData={tripData}
      />

      {/* Activity Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedDetailItem?.name}
        size="lg"
      >
        {selectedDetailItem && (
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Image */}
            <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
              <img 
                src={selectedDetailItem.image} 
                alt={selectedDetailItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{selectedDetailItem.rating}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedDetailItem.name}</h3>
                <p className="text-gray-600">{selectedDetailItem.description}</p>
              </div>

              {/* Details based on type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedDetailItem.type === 'places' && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p className="text-gray-900">{selectedDetailItem.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Type:</span>
                      <p className="text-gray-900">{selectedDetailItem.type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Duration:</span>
                      <p className="text-gray-900">{selectedDetailItem.duration}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Entry Fee:</span>
                      <p className="text-gray-900">{selectedDetailItem.price}</p>
                    </div>
                  </>
                )}

                {selectedDetailItem.type === 'accommodations' && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p className="text-gray-900">{selectedDetailItem.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Type:</span>
                      <p className="text-gray-900">{selectedDetailItem.type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price:</span>
                      <p className="text-gray-900">{selectedDetailItem.price}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Amenities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedDetailItem.amenities?.map((amenity, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedDetailItem.type === 'transport' && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Type:</span>
                      <p className="text-gray-900">{selectedDetailItem.type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Capacity:</span>
                      <p className="text-gray-900">{selectedDetailItem.capacity}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price:</span>
                      <p className="text-gray-900">{selectedDetailItem.price}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedDetailItem.features?.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedDetailItem.type === 'guides' && (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Specialization:</span>
                      <p className="text-gray-900">{selectedDetailItem.specialization}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Experience:</span>
                      <p className="text-gray-900">{selectedDetailItem.experience}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price:</span>
                      <p className="text-gray-900">{selectedDetailItem.price}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Languages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedDetailItem.languages?.map((language, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    handleAddToDay(selectedDetailItem);
                    setShowDetailModal(false);
                  }}
                >
                  Add to Day {selectedDateIndex + 1}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TripPlanning;