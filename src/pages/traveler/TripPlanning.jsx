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
  X,
  UserCheck,
  Home
} from 'lucide-react';
import { Button, Card, Modal } from '../../components/common';
import { useTripPlanning } from '../../hooks/useTripPlanning';
import NavigationWarningModal from '../../components/NavigationWarningModal';
import Toast from '../../components/Toast';
import TripSummaryModal from '../../components/TripSummaryModal';
import { accommodationAPI, transportationAPI, tourGuideAPI } from '../../services/api';

const TripPlanning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItemsCount } = useTripPlanning();
  
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

  // Helper function to render activity cards
  const renderActivityCard = (item, type) => (
    <div key={item.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
      <div className="relative h-32">
        <img 
          src={item.image} 
          alt={item.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <div className="flex items-center px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm">
            <Star className="w-3 h-3 mr-1 text-yellow-500" />
            <span className="text-xs font-medium">{item.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h5 className="mb-1 text-sm font-medium text-gray-900">{item.name}</h5>
        <p className="mb-2 text-xs text-gray-600">
          {type === 'places' && item.location}
          {type === 'accommodations' && item.location}
          {type === 'transport' && item.type}
          {type === 'guides' && item.specialization}
        </p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-emerald-600">{item.price}</span>
          {type === 'places' && (
            <span className="text-xs text-gray-500">{item.duration}</span>
          )}
          {type === 'transport' && (
            <span className="text-xs text-gray-500">{item.capacity}</span>
          )}
          {type === 'guides' && (
            <span className="text-xs text-gray-500">{item.experience}</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="xs" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => handleViewDetails(item, type)}
          >
            View Details
          </Button>
          <Button 
            size="xs" 
            variant="primary" 
            className="flex-1 text-xs"
            onClick={() => handleAddToDay(item)}
          >
            Add to Day
          </Button>
        </div>
      </div>
    </div>
  );

  // Handler functions
  const handleViewDetails = (item, type) => {
    setSelectedDetailItem({ ...item, type });
    setShowDetailModal(true);
  };

  const handleAddToDay = (item) => {
    // TODO: Implement add to day functionality
    setToastMessage(`${item.name} added to Day ${selectedDateIndex + 1}`);
    setShowToast(true);
    setHasUnsavedProgress(true);
  };
  
  // New state for tab structure
  const [activeTab, setActiveTab] = useState('places');
  const [accommodations, setAccommodations] = useState([]);
  const [transportation, setTransportation] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [loadingAccommodations, setLoadingAccommodations] = useState(false);
  const [loadingTransportation, setLoadingTransportation] = useState(false);
  const [loadingTourGuides, setLoadingTourGuides] = useState(false);
  const [errorAccommodations, setErrorAccommodations] = useState(null);
  const [errorTransportation, setErrorTransportation] = useState(null);
  const [errorTourGuides, setErrorTourGuides] = useState(null);

  // Tab configuration
  const _tabs = [
    { id: 'places', label: 'Places', icon: MapPin, color: 'emerald' },
    { id: 'accommodations', label: 'Accommodations', icon: Hotel, color: 'blue' },
    { id: 'guides', label: 'Tour Guides', icon: UserCheck, color: 'orange' },
    { id: 'transportation', label: 'Transportation', icon: Car, color: 'purple' }
  ];

  // Load initial data when component mounts
  useEffect(() => {
    // Places will use Google Maps API, so no initial fetch needed
  }, []);

  // API fetch functions
  const fetchAccommodations = async () => {
    if (accommodations.length > 0) return; // Only fetch if not already loaded
    
    try {
      setLoadingAccommodations(true);
      setErrorAccommodations(null);
      const response = await accommodationAPI.getAll();
      setAccommodations(response || []);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      setErrorAccommodations('Failed to load accommodations. Please try again.');
      setAccommodations([]);
    } finally {
      setLoadingAccommodations(false);
    }
  };

  const fetchTransportation = async () => {
    if (transportation.length > 0) return; // Only fetch if not already loaded
    
    try {
      setLoadingTransportation(true);
      setErrorTransportation(null);
      const response = await transportationAPI.getAll();
      setTransportation(response || []);
    } catch (error) {
      console.error('Error fetching transportation:', error);
      setErrorTransportation('Failed to load transportation. Please try again.');
      setTransportation([]);
    } finally {
      setLoadingTransportation(false);
    }
  };

  const fetchTourGuides = async () => {
    if (tourGuides.length > 0) return; // Only fetch if not already loaded
    
    try {
      setLoadingTourGuides(true);
      setErrorTourGuides(null);
      const response = await tourGuideAPI.getAll();
      setTourGuides(response || []);
    } catch (error) {
      console.error('Error fetching tour guides:', error);
      setErrorTourGuides('Failed to load tour guides. Please try again.');
      setTourGuides([]);
    } finally {
      setLoadingTourGuides(false);
    }
  };

  // Handle tab change and fetch data
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    switch (tabId) {
      case 'places':
        // Places will use Google Maps API, no fetch needed
        break;
      case 'accommodations':
        fetchAccommodations();
        break;
      case 'transportation':
        fetchTransportation();
        break;
      case 'guides':
        fetchTourGuides();
        break;
      default:
        break;
    }
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Panel - Trip Planning */}
      <div className={`bg-white shadow-lg overflow-y-auto transition-all duration-300 ${
        isPanelExpanded ? 'w-full' : 'w-1/2'
      }`}>
        {/* Header */}
        <div className="p-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-green-900">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => handleSafeNavigation(() => navigate(-1))}
              className="flex items-center transition-colors text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            
            {/* Panel Toggle Button */}
            <button
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              className="flex items-center p-2 transition-colors rounded-lg text-white/90 hover:text-white hover:bg-white/10"
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
            <h1 className="mb-4 text-2xl font-bold">Plan Your Trip</h1>
            {/* Date Chips */}
            {tripDays.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-white/90">Select Date to Plan</h3>
                <div className="flex flex-wrap gap-2">
                  {tripDays.map((day, dayIndex) => {
                    const dayNumber = dayIndex + 1;
                    const dayDate = day.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      weekday: 'short'
                    });

                    return (
                      <button
                        key={dayIndex}
                        onClick={() => setSelectedDateIndex(dayIndex)}
                        className={`px-3 py-2 rounded-full backdrop-blur-sm border text-xs transition-all duration-200 hover:scale-105 ${
                          selectedDateIndex === dayIndex
                            ? 'bg-white text-emerald-700 border-white shadow-lg font-semibold'
                            : 'bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-semibold">Day {dayNumber}</div>
                          <div className={selectedDateIndex === dayIndex ? 'text-emerald-600' : 'text-white/80'}>
                            {dayDate}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Selected Date Info */}
                <div className="mt-3 text-xs text-white/70">
                  Planning for Day {selectedDateIndex + 1} - {tripDays[selectedDateIndex]?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            )}

            {/* Service Selection Tabs */}
            <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <h3 className="mb-3 text-sm font-medium text-white/90">Add Services to Your Trip</h3>
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleTabChange('places')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'places'
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Places
                </button>
                
                <button
                  onClick={() => handleTabChange('accommodations')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'accommodations'
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Home className="inline w-4 h-4 mr-2" />
                  Accommodations
                  {loadingAccommodations && <div className="inline-block w-3 h-3 ml-2 border border-white rounded-full border-t-transparent animate-spin"></div>}
                </button>
                
                <button
                  onClick={() => handleTabChange('transportation')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'transportation'
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Car className="inline w-4 h-4 mr-2" />
                  Transportation
                  {loadingTransportation && <div className="inline-block w-3 h-3 ml-2 border border-white rounded-full border-t-transparent animate-spin"></div>}
                </button>
                
                <button
                  onClick={() => handleTabChange('guides')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'guides'
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <UserCheck className="inline w-4 h-4 mr-2" />
                  Tour Guides
                  {loadingTourGuides && <div className="inline-block w-3 h-3 ml-2 border border-white rounded-full border-t-transparent animate-spin"></div>}
                </button>
              </div>

            </div>
          </div>
        </div>
        {/* Content Area - Service Selection */}
        <div className="p-6">
          {/* Service Content Based on Active Tab */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              {/* Tab Content */}
              {activeTab === 'places' && (
                <div>
                  <div className="flex items-center mb-6">
                    <MapPin className="w-6 h-6 mr-3 text-emerald-600" />
                    <h2 className="text-xl font-bold text-gray-900">Places to Visit</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {mockPlaces.map(place => (
                      <div key={place.id}>
                        {renderActivityCard(place, 'places')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'accommodations' && (
                <div>
                  <div className="flex items-center mb-6">
                    <Home className="w-6 h-6 mr-3 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Accommodations</h2>
                  </div>
                  {loadingAccommodations ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading accommodations...</span>
                    </div>
                  ) : errorAccommodations ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 text-red-500">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="mb-4 text-center text-gray-600">{errorAccommodations}</p>
                      <button 
                        onClick={() => {
                          setAccommodations([]);
                          fetchAccommodations();
                        }}
                        className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : accommodations.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {accommodations.map(accommodation => (
                        <div key={accommodation.id || accommodation._id}>
                          {renderActivityCard(accommodation, 'accommodations')}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-gray-500">No accommodations available.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transportation' && (
                <div>
                  <div className="flex items-center mb-6">
                    <Car className="w-6 h-6 mr-3 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">Transportation</h2>
                  </div>
                  {loadingTransportation ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading transportation...</span>
                    </div>
                  ) : errorTransportation ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 text-red-500">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="mb-4 text-center text-gray-600">{errorTransportation}</p>
                      <button 
                        onClick={() => {
                          setTransportation([]);
                          fetchTransportation();
                        }}
                        className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : transportation.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {transportation.map(transport => (
                        <div key={transport.id || transport._id}>
                          {renderActivityCard(transport, 'transport')}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-gray-500">No transportation options available.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'guides' && (
                <div>
                  <div className="flex items-center mb-6">
                    <UserCheck className="w-6 h-6 mr-3 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-900">Tour Guides</h2>
                  </div>
                  {loadingTourGuides ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading tour guides...</span>
                    </div>
                  ) : errorTourGuides ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="mb-4 text-red-500">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="mb-4 text-center text-gray-600">{errorTourGuides}</p>
                      <button 
                        onClick={() => {
                          setTourGuides([]);
                          fetchTourGuides();
                        }}
                        className="px-4 py-2 text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : tourGuides.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {tourGuides.map(guide => (
                        <div key={guide.id || guide._id}>
                          {renderActivityCard(guide, 'guides')}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-gray-500">No tour guides available.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      {!isPanelExpanded && (
        <div className="relative w-1/2">
          {/* Google Maps Embedded Frame */}
          <div className="fixed top-0 right-0 w-full h-full" style={{ width: '50%' }}>
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
        <div className="fixed z-40 bottom-6 right-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowSummaryModal(true)}
            className="flex items-center font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:scale-105"
          >
            <span className="px-2 py-1 mr-2 text-sm font-bold bg-white rounded-full text-emerald-600 animate-pulse">
              {getTotalItemsCount()}
            </span>
            View Summary
          </Button>
        </div>
      )}

      {/* Floating Map Toggle Button (when panel is expanded) */}
      {isPanelExpanded && (
        <div className="fixed z-40 bottom-6 left-6">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setIsPanelExpanded(false)}
            className="flex items-center text-gray-700 transition-shadow bg-white border border-gray-300 shadow-lg hover:shadow-xl"
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
            <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
              <img 
                src={selectedDetailItem.image} 
                alt={selectedDetailItem.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-4 right-4">
                <div className="flex items-center px-3 py-2 rounded-full bg-white/90 backdrop-blur-sm">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span className="text-sm font-medium">{selectedDetailItem.rating}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{selectedDetailItem.name}</h3>
                <p className="text-gray-600">{selectedDetailItem.description}</p>
              </div>

              {/* Details based on type */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          <span key={index} className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
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
                          <span key={index} className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">
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
                          <span key={index} className="px-2 py-1 text-xs text-orange-700 bg-orange-100 rounded-full">
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
