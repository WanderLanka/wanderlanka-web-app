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
      <div className="relative h-32">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 text-yellow-500 mr-1" />
            <span className="text-xs font-medium">{item.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h5 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h5>
        <p className="text-xs text-gray-600 mb-2">
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

  // Tab configuration
  const _tabs = [
    { id: 'places', label: 'Places', icon: MapPin, color: 'emerald' },
    { id: 'accommodations', label: 'Accommodations', icon: Hotel, color: 'blue' },
    { id: 'guides', label: 'Tour Guides', icon: UserCheck, color: 'orange' },
    { id: 'transportation', label: 'Transportation', icon: Car, color: 'purple' }
  ];

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

  // Load initial data when component mounts
  useEffect(() => {
    // Places will use Google Maps API, so no initial fetch needed
  }, []);

  // API fetch functions
  const fetchAccommodations = async () => {
    if (accommodations.length > 0) return; // Only fetch if not already loaded
    
    try {
      setLoadingAccommodations(true);
      const response = await accommodationAPI.getAll();
      setAccommodations(response || []);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      setToastMessage('Failed to load accommodations');
      setShowToast(true);
    } finally {
      setLoadingAccommodations(false);
    }
  };

  const fetchTransportation = async () => {
    if (transportation.length > 0) return; // Only fetch if not already loaded
    
    try {
      setLoadingTransportation(true);
      const response = await transportationAPI.getAll();
      setTransportation(response || []);
    } catch (error) {
      console.error('Error fetching transportation:', error);
      setToastMessage('Failed to load transportation');
      setShowToast(true);
    } finally {
      setLoadingTransportation(false);
    }
  };

  const fetchTourGuides = async () => {
    if (tourGuides.length > 0) return; // Only fetch if not already loaded
    
    try {
      setLoadingTourGuides(true);
      const response = await tourGuideAPI.getAll();
      setTourGuides(response || []);
    } catch (error) {
      console.error('Error fetching tour guides:', error);
      setToastMessage('Failed to load tour guides');
      setShowToast(true);
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
            {/* Date Chips */}
            {tripDays.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white/90 mb-3">Select Date to Plan</h3>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-sm font-medium text-white/90 mb-3">Add Services to Your Trip</h3>
              
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
                  <MapPin className="h-4 w-4 inline mr-2" />
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
                  <Home className="h-4 w-4 inline mr-2" />
                  Accommodations
                  {loadingAccommodations && <div className="inline-block w-3 h-3 ml-2 border border-white border-t-transparent rounded-full animate-spin"></div>}
                </button>
                
                <button
                  onClick={() => handleTabChange('transportation')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'transportation'
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <Car className="h-4 w-4 inline mr-2" />
                  Transportation
                  {loadingTransportation && <div className="inline-block w-3 h-3 ml-2 border border-white border-t-transparent rounded-full animate-spin"></div>}
                </button>
                
                <button
                  onClick={() => handleTabChange('guides')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'guides'
                      ? 'bg-white text-emerald-700 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <UserCheck className="h-4 w-4 inline mr-2" />
                  Tour Guides
                  {loadingTourGuides && <div className="inline-block w-3 h-3 ml-2 border border-white border-t-transparent rounded-full animate-spin"></div>}
                </button>
              </div>

            </div>
          </div>
        </div>
        {/* Content Area - Service Selection */}
        <div className="p-6">
          {/* Service Content Based on Active Tab */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              {/* Tab Content */}
              {activeTab === 'places' && (
                <div>
                  <div className="flex items-center mb-6">
                    <MapPin className="h-6 w-6 text-emerald-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Places to Visit</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    <Home className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Accommodations</h2>
                  </div>
                  {loadingAccommodations ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading accommodations...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(accommodations.length > 0 ? accommodations : mockAccommodations).map(accommodation => (
                        <div key={accommodation.id || accommodation._id}>
                          {renderActivityCard(accommodation, 'accommodations')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transportation' && (
                <div>
                  <div className="flex items-center mb-6">
                    <Car className="h-6 w-6 text-purple-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Transportation</h2>
                  </div>
                  {loadingTransportation ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading transportation...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(transportation.length > 0 ? transportation : mockTransport).map(transport => (
                        <div key={transport.id || transport._id}>
                          {renderActivityCard(transport, 'transport')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'guides' && (
                <div>
                  <div className="flex items-center mb-6">
                    <UserCheck className="h-6 w-6 text-orange-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Tour Guides</h2>
                  </div>
                  {loadingTourGuides ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                      <span className="ml-3 text-gray-600">Loading tour guides...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(tourGuides.length > 0 ? tourGuides : mockGuides).map(guide => (
                        <div key={guide.id || guide._id}>
                          {renderActivityCard(guide, 'guides')}
                        </div>
                      ))}
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