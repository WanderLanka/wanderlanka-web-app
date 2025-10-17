import { useState, useEffect } from 'react';
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
  List
} from 'lucide-react';
import { Button, Card } from '../../components/common';
import { useTripPlanning } from '../../hooks/useTripPlanning';
import NavigationWarningModal from '../../components/NavigationWarningModal';
import Toast from '../../components/Toast';

const TripPlanning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItemsCount, addToTripPlanning } = useTripPlanning();
  
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('destinations');
  const [selectedDay, setSelectedDay] = useState(1);
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Get trip data from navigation state or default values
  const tripData = location.state || {
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 2
  };

  // Calculate trip days
  const getTripDays = () => {
    if (!tripData.startDate || !tripData.endDate) return [];
    
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const days = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  };

  const tripDays = getTripDays();

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

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const hideToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  const handleNavigateToDetails = (item) => {
    let path = '';
    
    switch (selectedCategory) {
      case 'accommodations':
        path = `/user/accommodations/${item.id}`;
        break;
      case 'transport':
        path = `/user/transportation/${item.id}`;
        break;
      case 'guides':
        path = `/user/tour-guides/${item.id}`;
        break;
      default:
        return;
    }
    
    // Navigate with state indicating this came from trip planning
    // This is part of the planning workflow, so navigate directly
    navigate(path, { state: { fromTripPlanning: true, selectedDay } });
  };

  const handleAddToTrip = (item) => {
    // Map category to service type for context
    const serviceTypeMap = {
      'accommodations': 'accommodations',
      'transport': 'transportation', 
      'guides': 'guides',
      'destinations': 'destinations'
    };

    const serviceType = serviceTypeMap[selectedCategory];
    
    if (serviceType && serviceType !== 'destinations') {
      // Add to trip planning context
      addToTripPlanning(item, serviceType);
      setHasUnsavedProgress(true);
      
      // Show success toast
      showSuccessToast(`${item.name} added to your trip planning!`);
    } else if (selectedCategory === 'destinations') {
      // For destinations, just show a message for now
      console.log('Adding destination to trip:', item);
      showSuccessToast(`${item.name} added to your trip planning!`);
    }
  };

  // Mock data for destinations
  const destinations = [
    {
      id: 1,
      name: "Sigiriya Rock Fortress",
      location: "Sigiriya",
      type: "Historical Site",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1580910527739-556eb89f9d65?q=80&w=1074&auto=format&fit=crop",
      price: "LKR 2,500",
      duration: "2-3 hours",
      description: "Ancient rock fortress and palace ruins"
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
      description: "Sacred Buddhist temple housing Buddha's tooth relic"
    },
    {
      id: 3,
      name: "Yala National Park",
      location: "Yala",
      type: "Wildlife Safari",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1653151106419-b91300e4be19?q=80&w=1173&auto=format&fit=crop",
      price: "LKR 8,000",
      duration: "4-6 hours",
      description: "Wildlife safari with leopards and elephants"
    }
  ];

  // Mock data for accommodations
  const accommodations = [
    {
      id: 1,
      name: "Heritance Kandalama",
      location: "Dambulla",
      type: "Luxury Resort",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?q=80&w=1170&auto=format&fit=crop",
      price: "LKR 35,000",
      amenities: ["Pool", "Spa", "Restaurant", "WiFi"],
      description: "Eco-luxury resort designed by Geoffrey Bawa"
    },
    {
      id: 2,
      name: "Cinnamon Lodge Habarana",
      location: "Habarana",
      type: "Nature Resort",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1525849306000-cc26ceb5c1d7?q=80&w=735&auto=format&fit=crop",
      price: "LKR 28,000",
      amenities: ["Pool", "Restaurant", "Wildlife Tours", "WiFi"],
      description: "Rustic luxury in the heart of nature"
    }
  ];

  // Mock data for guides
  const guides = [
    {
      id: 1,
      name: "Rohan Silva",
      location: "Kandy & Central Province",
      type: "Cultural Guide",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop",
      price: "LKR 12,000",
      languages: ["English", "Sinhala", "Tamil"],
      experience: "8 years",
      description: "Expert in cultural sites and traditional crafts"
    },
    {
      id: 2,
      name: "Anura Perera",
      location: "Yala & Southern Province",
      type: "Wildlife Guide",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1170&auto=format&fit=crop",
      price: "LKR 15,000",
      languages: ["English", "Sinhala"],
      experience: "10 years",
      description: "Specialist in wildlife photography and safari tours"
    },
    {
      id: 3,
      name: "Chaminda Fernando",
      location: "Sigiriya & Ancient Cities",
      type: "Historical Guide",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=687&auto=format&fit=crop",
      price: "LKR 10,000",
      languages: ["English", "Sinhala", "German"],
      experience: "6 years",
      description: "Archaeological expert and history enthusiast"
    }
  ];

  const categories = [
    { id: 'destinations', name: 'Destinations', icon: MapPin },
    { id: 'accommodations', name: 'Accommodations', icon: Hotel },
    { id: 'transport', name: 'Transport', icon: Car },
    { id: 'guides', name: 'Guides', icon: Users }
  ];

  const getCurrentData = () => {
    switch (selectedCategory) {
      case 'destinations':
        return destinations;
      case 'accommodations':
        return accommodations;
      case 'guides':
        return guides;
      default:
        return destinations;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Trip Planning */}
      <div className="w-1/2 bg-white shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white p-6">
          <button 
            onClick={() => handleSafeNavigation(() => navigate(-1))}
            className="flex items-center text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">Plan Your Trip</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-white/90">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tripData.destination || 'Sri Lanka'}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {tripData.startDate && tripData.endDate 
                    ? `${tripData.startDate} - ${tripData.endDate}`
                    : 'Select dates'
                  }
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {tripData.travelers || 2} travelers
                </div>
              </div>
              
              {/* Day Dropdown */}
              {tripDays.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/90 text-sm">Planning for:</span>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                    className="bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                  >
                    {tripDays.map((day, index) => (
                      <option key={index} value={index + 1} className="bg-white text-gray-900">
                        Day {index + 1} - {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {categories.map((category) => {

              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </Button>
              <div className="flex border rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {getCurrentData().length} {selectedCategory} found
            </span>
          </div>

          {/* Items Grid/List */}
          <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : ''}`}>
            {getCurrentData().map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`${viewMode === 'list' ? 'flex' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} relative`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.location}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{item.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    {/* Additional info for guides */}
                    {selectedCategory === 'guides' && (
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium mr-2">Experience:</span>
                          {item.experience}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="font-medium mr-2">Languages:</span>
                          {item.languages?.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {/* Additional info for accommodations */}
                    {selectedCategory === 'accommodations' && item.amenities && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {item.amenities.slice(0, 3).map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                              {amenity}
                            </span>
                          ))}
                          {item.amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{item.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-emerald-600">{item.price}</span>
                        {item.duration && (
                          <span className="text-sm text-gray-500 ml-1">/ {item.duration}</span>
                        )}
                        {selectedCategory === 'guides' && (
                          <span className="text-sm text-gray-500 ml-1">/ day</span>
                        )}
                        {selectedCategory === 'accommodations' && (
                          <span className="text-sm text-gray-500 ml-1">/ night</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {selectedCategory !== 'destinations' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleNavigateToDetails(item)}
                          >
                            View Details
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => handleAddToTrip(item)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {tripDays.length > 0 ? `Add to Day ${selectedDay}` : 'Add to Trip'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
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

      {/* Floating Trip Summary Button */}
      {getTotalItemsCount() > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleSafeNavigation(() => navigate('/user/trip-summary'))}
            className="shadow-lg hover:shadow-xl transition-shadow flex items-center"
          >
            <span className="bg-white text-emerald-600 rounded-full px-2 py-1 text-sm font-bold mr-2">
              {getTotalItemsCount()}
            </span>
            View Summary
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
    </div>
  );
};

export default TripPlanning;