import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const { getTotalItemsCount, addToTripPlanning, planningBookings } = useTripPlanning();
  
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
  
  // Notes and Checklists state
  const [dayNotes, setDayNotes] = useState({});
  const [dayChecklists, setDayChecklists] = useState({});
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [editingNotesDay, setEditingNotesDay] = useState(null);
  const [editingChecklistDay, setEditingChecklistDay] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  
  // Places state
  const [dayPlaces, setDayPlaces] = useState({});
  const [newPlaceName, setNewPlaceName] = useState('');
  

  // Helper function to render activity cards
  const renderActivityCard = (item, type) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {type === 'places' ? (
        // Simplified places card - only name and button
        <>
          <div className="p-4">
            <h5 className="font-medium text-gray-900 text-lg mb-3 text-center">{item.name}</h5>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="primary" 
                className="w-full text-sm py-2"
                onClick={() => handleAddToDay(item)}
              >
                Add
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Full card for other services
        <>
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
              {type === 'accommodations' && item.location}
              {type === 'transport' && item.type}
              {type === 'guides' && item.specialization}
            </p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-emerald-600">{item.price}</span>
              {type === 'transport' && (
                <span className="text-xs text-gray-500">{item.capacity}</span>
              )}
              {type === 'guides' && (
                <span className="text-xs text-gray-500">{item.experience}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full text-sm py-2"
                onClick={() => handleViewDetails(item, type)}
              >
                View Details
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Handler functions
  const handleViewDetails = (item, type) => {
    // Navigate to specific details pages based on type
    switch (type) {
      case 'accommodations':
        navigate(`/user/accommodations/${item.id || item._id}`, { 
          state: { 
            selectedItem: item,
            returnTo: '/user/trip-planning',
            tripData: tripData,
            selectedDate: selectedDateIndex,
            selectedDateValue: tripDays[selectedDateIndex]?.toISOString().split('T')[0], // Actual date string
            fromTripPlanning: true,
            showAddToItinerary: true, // This will change "Go to Payment" to "Add to Itinerary"
            source: 'trip-planning'
          } 
        });
        break;
      case 'transport':
        navigate(`/user/transportation/${item.id || item._id}`, { 
          state: { 
            selectedItem: item,
            returnTo: '/user/trip-planning',
            tripData: tripData,
            selectedDate: selectedDateIndex,
            selectedDateValue: tripDays[selectedDateIndex]?.toISOString().split('T')[0], // Actual date string
            fromTripPlanning: true,
            showAddToItinerary: true,
            source: 'trip-planning'
          } 
        });
        break;
      case 'guides':
        navigate(`/user/tour-guides/${item.id || item._id}`, { 
          state: { 
            selectedItem: item,
            returnTo: '/user/trip-planning',
            tripData: tripData,
            selectedDate: selectedDateIndex,
            selectedDateValue: tripDays[selectedDateIndex]?.toISOString().split('T')[0], // Actual date string
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

  // API fetch functions
  const fetchAccommodations = useCallback(async (forceRefresh = false) => {
    if (accommodations.length > 0 && !forceRefresh) return; // Only fetch if not already loaded
    
    try {
      setLoadingAccommodations(true);
      setErrorAccommodations(null);
      console.log('Fetching accommodations from database...');
      const response = await accommodationAPI.getAll();
      console.log('Accommodations fetched:', response);
      setAccommodations(response || []);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      setErrorAccommodations('Failed to load accommodations. Please try again.');
      setAccommodations([]);
    } finally {
      setLoadingAccommodations(false);
    }
  }, [accommodations.length]);

  // Load initial data when component mounts
  useEffect(() => {
    // Fetch accommodations immediately when component mounts
    fetchAccommodations();
    // Places will use Google Maps API, so no initial fetch needed
    
    // Load saved trip planning data from localStorage
    loadTripPlanningData();
  }, [fetchAccommodations]);

  // Load trip planning data from localStorage
  const loadTripPlanningData = () => {
    try {
      // Load individual data
      const savedPlaces = localStorage.getItem('tripPlanning_places');
      const savedNotes = localStorage.getItem('tripPlanning_notes');
      const savedChecklists = localStorage.getItem('tripPlanning_checklists');
      
      if (savedPlaces) {
        setDayPlaces(JSON.parse(savedPlaces));
      }
      if (savedNotes) {
        setDayNotes(JSON.parse(savedNotes));
      }
      if (savedChecklists) {
        setDayChecklists(JSON.parse(savedChecklists));
      }

      // Also load from trip summary data if available (for cross-page persistence)
      const tripSummaryData = localStorage.getItem('tripSummaryData');
      if (tripSummaryData) {
        const parsedSummaryData = JSON.parse(tripSummaryData);
        console.log('Loading trip summary data:', parsedSummaryData);
        
        // Update local state with summary data if it's more recent
        if (parsedSummaryData.dayPlaces && Object.keys(parsedSummaryData.dayPlaces).length > 0) {
          setDayPlaces(parsedSummaryData.dayPlaces);
        }
        if (parsedSummaryData.dayNotes && Object.keys(parsedSummaryData.dayNotes).length > 0) {
          setDayNotes(parsedSummaryData.dayNotes);
        }
        if (parsedSummaryData.dayChecklists && Object.keys(parsedSummaryData.dayChecklists).length > 0) {
          setDayChecklists(parsedSummaryData.dayChecklists);
        }
      }
    } catch (error) {
      console.error('Error loading trip planning data:', error);
    }
  };

  // Save trip planning data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tripPlanning_places', JSON.stringify(dayPlaces));
    } catch (error) {
      console.error('Error saving places data:', error);
    }
  }, [dayPlaces]);

  useEffect(() => {
    try {
      localStorage.setItem('tripPlanning_notes', JSON.stringify(dayNotes));
    } catch (error) {
      console.error('Error saving notes data:', error);
    }
  }, [dayNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('tripPlanning_checklists', JSON.stringify(dayChecklists));
    } catch (error) {
      console.error('Error saving checklists data:', error);
    }
  }, [dayChecklists]);

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

  // Debug: Log current state to see what's happening
  useEffect(() => {
    console.log('🔍 TripPlanning Debug:', {
      totalItemsCount: getTotalItemsCount(),
      planningBookings: planningBookings,
      showSummaryModal: showSummaryModal,
      locationState: location.state,
      dayPlaces: dayPlaces,
      dayNotes: dayNotes,
      dayChecklists: dayChecklists,
      hasAnyContent: hasAnyContent(),
      totalContentCount: getTotalContentCount()
    });
  }, [getTotalItemsCount, planningBookings, showSummaryModal, location.state, dayPlaces, dayNotes, dayChecklists]);

  // Get total count of all content (bookings, places, notes, checklists)
  const getTotalContentCount = () => {
    const bookingCount = getTotalItemsCount();
    const placesCount = Object.values(dayPlaces).reduce((total, places) => total + places.length, 0);
    
    // Notes are stored as single objects per day, not arrays
    const notesCount = Object.keys(dayNotes).length;
    
    // Checklists are stored as arrays per day
    const checklistsCount = Object.values(dayChecklists).reduce((total, checklists) => total + checklists.length, 0);
    
    const totalCount = bookingCount + placesCount + notesCount + checklistsCount;
    
    console.log('📊 Total Content Count:', {
      bookingCount,
      placesCount,
      notesCount,
      checklistsCount,
      totalCount,
      dayPlacesKeys: Object.keys(dayPlaces),
      dayNotesKeys: Object.keys(dayNotes),
      dayChecklistsKeys: Object.keys(dayChecklists),
      dayNotesValues: Object.values(dayNotes),
      dayChecklistsValues: Object.values(dayChecklists)
    });
    
    return totalCount;
  };

  // Check if there's any content to show in summary (bookings, places, notes, checklists)
  const hasAnyContent = () => {
    const hasContent = getTotalContentCount() > 0;
    console.log('🔍 hasAnyContent check:', hasContent, 'totalCount:', getTotalContentCount());
    return hasContent;
  };

  // Debug: Track button visibility changes
  useEffect(() => {
    const shouldShowButton = hasAnyContent();
    console.log('🔘 View Summary Button Visibility:', shouldShowButton);
  }, [dayPlaces, dayNotes, dayChecklists, planningBookings]);

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

  // Place management functions
  const handleAddPlace = (dayNumber) => {
    if (newPlaceName.trim()) {
      const selectedDate = tripDays[selectedDateIndex]?.toISOString().split('T')[0];
      const newPlace = {
        id: Date.now().toString(),
        name: newPlaceName.trim(),
        addedAt: new Date().toISOString(),
        selectedDate: selectedDate,
        dayNumber: dayNumber
      };
      
      console.log('📍 Adding place for day:', dayNumber, 'name:', newPlaceName);
      
      setDayPlaces(prev => {
        const newPlaces = {
          ...prev,
          [dayNumber]: [...(prev[dayNumber] || []), newPlace]
        };
        console.log('📍 Updated dayPlaces:', newPlaces);
        return newPlaces;
      });
      
      setNewPlaceName('');
      setToastMessage('Place added successfully!');
      setShowToast(true);
    }
  };

  const removePlaceFromDay = (dayNumber, placeId) => {
    setDayPlaces(prev => ({
      ...prev,
      [dayNumber]: (prev[dayNumber] || []).filter(place => place.id !== placeId)
    }));
    setToastMessage('Place removed successfully!');
    setShowToast(true);
  };

  // Handle adding items to trip planning
  const handleAddToDay = (item, type) => {
    const selectedDate = tripDays[selectedDateIndex]?.toISOString().split('T')[0];
    const bookingData = {
      ...item,
      id: item.id || item._id,
      selectedDate: selectedDate,
      selectedDayIndex: selectedDateIndex
    };
    
    addToTripPlanning(bookingData, type);
    setToastMessage(`${item.name} added to Day ${selectedDateIndex + 1}`);
    setShowToast(true);
  };


  // Notes functions
  const handleEditNotes = (dayNumber) => {
    const existingNotes = dayNotes[dayNumber];
    setNotesText(existingNotes?.text || '');
    setEditingNotesDay(dayNumber);
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    if (editingNotesDay !== null) {
      const selectedDate = tripDays[selectedDateIndex]?.toISOString().split('T')[0];
      console.log('📝 Saving notes for day:', editingNotesDay, 'text:', notesText);
      
      setDayNotes(prev => {
        const newNotes = {
          ...prev,
          [editingNotesDay]: {
            text: notesText,
            selectedDate: selectedDate,
            dayNumber: editingNotesDay,
            savedAt: new Date().toISOString()
          }
        };
        console.log('📝 Updated dayNotes:', newNotes);
        return newNotes;
      });
      
      setShowNotesModal(false);
      setNotesText('');
      setEditingNotesDay(null);
      setToastMessage('Notes saved successfully!');
      setShowToast(true);
    }
  };

  const handleCancelNotes = () => {
    setShowNotesModal(false);
    setNotesText('');
    setEditingNotesDay(null);
  };

  // Checklist functions
  const handleAddChecklist = (dayNumber) => {
    setChecklistTitle('');
    setChecklistItems([]);
    setEditingChecklistDay(dayNumber);
    setShowChecklistModal(true);
  };

  const handleSaveChecklist = () => {
    if (editingChecklistDay !== null && checklistTitle.trim()) {
      const selectedDate = tripDays[selectedDateIndex]?.toISOString().split('T')[0];
      const newChecklist = {
        id: Date.now().toString(),
        title: checklistTitle.trim(),
        items: checklistItems,
        selectedDate: selectedDate,
        dayNumber: editingChecklistDay,
        createdAt: new Date().toISOString()
      };
      
      console.log('✅ Saving checklist for day:', editingChecklistDay, 'title:', checklistTitle);
      
      setDayChecklists(prev => {
        const newChecklists = {
          ...prev,
          [editingChecklistDay]: [...(prev[editingChecklistDay] || []), newChecklist]
        };
        console.log('✅ Updated dayChecklists:', newChecklists);
        return newChecklists;
      });
      
      setShowChecklistModal(false);
      setChecklistTitle('');
      setChecklistItems([]);
      setEditingChecklistDay(null);
      setNewChecklistItem('');
      setToastMessage('Checklist saved successfully!');
      setShowToast(true);
    }
  };

  const handleCancelChecklist = () => {
    setShowChecklistModal(false);
    setChecklistTitle('');
    setChecklistItems([]);
    setEditingChecklistDay(null);
    setNewChecklistItem('');
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: Date.now().toString(),
        title: newChecklistItem.trim(),
        completed: false
      };
      setChecklistItems(prev => [...prev, newItem]);
      setNewChecklistItem('');
    }
  };

  const handleDeleteChecklistItem = (itemId) => {
    setChecklistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleToggleChecklistItem = (itemId) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleFinalizeItinerary = () => {
    console.log('Finalize itinerary');
    setShowSummaryModal(true);
  };

  // Clear all trip planning data
  const clearTripPlanningData = () => {
    setDayPlaces({});
    setDayNotes({});
    setDayChecklists({});
    localStorage.removeItem('tripPlanning_places');
    localStorage.removeItem('tripPlanning_notes');
    localStorage.removeItem('tripPlanning_checklists');
    setToastMessage('Trip planning data cleared successfully!');
    setShowToast(true);
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
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Plan Your Trip</h1>
              {/* Date Chips */}
              {tripDays.length > 0 && (
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
              )}
            </div>
            
            {/* Selected Date Info */}
            {tripDays.length > 0 && (
              <div className="mb-6">
                <div className="text-sm text-white/70">
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

                  {/* Selected Day Itinerary */}
                  {tripDays.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      {(() => {
                        const selectedDay = tripDays[selectedDateIndex];
                        const dayNumber = selectedDateIndex + 1;
                        const dayDate = selectedDay.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });

                        return (
                          <>
                            {/* Day Header */}
                            <div className="flex items-center p-4 border-b border-gray-200">
                              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">{dayNumber}</span>
                  </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">Day {dayNumber}</h4>
                                <p className="text-sm text-gray-500">{dayDate}</p>
                              </div>
                            </div>

                            {/* Places Container */}
                            <div className="p-4 space-y-3">
                              {/* User Added Places */}
                              {dayPlaces[dayNumber] && dayPlaces[dayNumber].length > 0 && (
                                <div className="space-y-2">
                                  {dayPlaces[dayNumber].map((place) => (
                                    <div key={place.id} className="flex items-center bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                                        <MapPin className="w-5 h-5 text-emerald-600" />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-semibold text-gray-800 text-sm">{place.name}</h5>
                                        <p className="text-xs text-gray-500">Added {new Date(place.addedAt).toLocaleDateString()}</p>
                                      </div>
                                      <button
                                        onClick={() => removePlaceFromDay(dayNumber, place.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                      </div>
                    ))}
                  </div>
                              )}

                              {/* Add Place Input */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newPlaceName}
                                  onChange={(e) => setNewPlaceName(e.target.value)}
                                  placeholder="Enter place name..."
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                  onKeyPress={(e) => e.key === 'Enter' && handleAddPlace(dayNumber)}
                                />
                                <button
                                  onClick={() => handleAddPlace(dayNumber)}
                                  disabled={!newPlaceName.trim()}
                                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="p-4 border-t border-gray-200">
                              <div className="flex items-center mb-2">
                                <div className="flex items-center flex-1">
                                  <div className="w-5 h-5 text-gray-600 mr-2">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">Notes</span>
                                </div>
                                <button
                                  onClick={() => handleEditNotes(dayNumber)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </div>
                              {dayNotes[dayNumber] ? (
                                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-emerald-600">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{dayNotes[dayNumber].text}</p>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEditNotes(dayNumber)}
                                  className="flex items-center justify-center w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  <span className="text-sm font-medium">Add notes for this day</span>
                                </button>
                              )}
                            </div>

                            {/* Checklists Section */}
                            <div className="p-4 border-t border-gray-200">
                              <div className="flex items-center mb-2">
                                <div className="flex items-center flex-1">
                                  <div className="w-5 h-5 text-gray-600 mr-2">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">Checklists</span>
                                </div>
                                <button
                                  onClick={() => handleAddChecklist(dayNumber)}
                                  className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* Dynamic Checklists */}
                              {dayChecklists[dayNumber] && dayChecklists[dayNumber].length > 0 ? (
                                <div className="space-y-2">
                                  {dayChecklists[dayNumber].map((checklist) => {
                                    const completedCount = checklist.items.filter(item => item.completed).length;
                                    const totalCount = checklist.items.length;
                                    
                                    return (
                                      <div key={checklist.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-green-500">
                                        <div className="flex items-center justify-between mb-2">
                                          <h6 className="text-sm font-semibold text-gray-800">{checklist.title}</h6>
                                          <div className="flex items-center space-x-1">
                                            <button className="p-1 text-emerald-600 hover:bg-emerald-50 rounded">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                              </svg>
                                            </button>
                                            <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                            </button>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                          {checklist.items.map((item) => (
                                            <div key={item.id} className="flex items-center">
                                              <div className={`w-5 h-5 mr-2 ${item.completed ? 'text-green-500' : 'text-gray-400'}`}>
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                              </div>
                                              <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                                {item.title}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                        
                                        <div className="mt-2 text-right">
                                          <span className="text-xs text-gray-500">{completedCount} of {totalCount} completed</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : null}

                              <button
                                onClick={() => handleAddChecklist(dayNumber)}
                                className="flex items-center justify-center w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Add checklist for this day</span>
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Finalize Button */}
                  <div className="mt-8 p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-3">
                      <button
                        onClick={clearTripPlanningData}
                        className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Clear All Data
                      </button>
                      <button
                        onClick={handleFinalizeItinerary}
                        className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                      >
                        Finalize Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'accommodations' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                    <Home className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-xl font-bold text-gray-900">Accommodations</h2>
                    </div>
                    <button
                      onClick={() => fetchAccommodations(true)}
                      disabled={loadingAccommodations}
                      className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className={`w-4 h-4 mr-2 ${loadingAccommodations ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
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
                    <div>
                      <div className="mb-4 text-sm text-gray-600">
                        Found {accommodations.length} accommodation{accommodations.length !== 1 ? 's' : ''} from database
                      </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {accommodations.map(accommodation => (
                        <div key={accommodation.id || accommodation._id}>
                          {renderActivityCard(accommodation, 'accommodations')}
                        </div>
                      ))}
                      </div>
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
      {hasAnyContent() && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowSummaryModal(true)}
            className="flex items-center font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:scale-105"
          >
            <span className="bg-white text-emerald-600 rounded-full px-2 py-1 text-sm font-bold mr-2 animate-pulse">
              {getTotalContentCount()}
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
        dayNotes={dayNotes}
        dayChecklists={dayChecklists}
        dayPlaces={dayPlaces}
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
                    handleAddToDay(selectedDetailItem, selectedDetailItem.type || 'accommodations');
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

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notes for Day {editingNotesDay}</h3>
              <button
                onClick={handleCancelNotes}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add your notes for this day
                </label>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Enter your notes for this day..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelNotes}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSaveNotes}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checklist Modal */}
      {showChecklistModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">New Checklist - Day {editingChecklistDay}</h3>
              <button
                onClick={handleCancelChecklist}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist Title
                </label>
                <input
                  type="text"
                  value={checklistTitle}
                  onChange={(e) => setChecklistTitle(e.target.value)}
                  placeholder="e.g., Packing List, Things to Do"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Checklist Items
                </label>
                
                {/* Existing Items */}
                {checklistItems.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <button
                          onClick={() => handleToggleChecklistItem(item.id)}
                          className="mr-3"
                        >
                          <div className={`w-5 h-5 ${item.completed ? 'text-green-500' : 'text-gray-400'}`}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </button>
                        <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          {item.title}
                        </span>
                        <button
                          onClick={() => handleDeleteChecklistItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Add new item..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddChecklistItem}
                    disabled={!newChecklistItem.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelChecklist}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSaveChecklist}
                  disabled={!checklistTitle.trim()}
                >
                  Save Checklist
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Trip Summary Modal */}
      <TripSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        tripData={tripData}
        dayNotes={dayNotes}
        dayChecklists={dayChecklists}
        dayPlaces={dayPlaces}
      />

    </div>
  );
};

export default TripPlanning;
