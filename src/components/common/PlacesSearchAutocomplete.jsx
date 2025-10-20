import { MapPin, Star, Clock, X, Loader } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * PlacesSearchAutocomplete Component
 * 
 * A comprehensive autocomplete search component for Google Places API
 * Features:
 * - Real-time place suggestions restricted to Sri Lanka
 * - Place details: photo, name, description, opening hours, rating
 * - Detailed place information fetching using Place Details API
 * 
 * Props:
 * @param {string} value - Current search input value
 * @param {function} onChange - Handler for input value changes
 * @param {function} onPlaceSelect - Handler when a place is selected (receives full place details)
 * @param {string} placeholder - Input placeholder text
 * @param {string} apiKey - Google Maps API key
 */
const PlacesSearchAutocomplete = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Search for places to visit...",
  apiKey
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState(null);
  
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const mapDivRef = useRef(null);

  // Initialize Google Maps Services
  useEffect(() => {
    const initializeServices = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        console.log('✅ Google Maps API loaded - Initializing Places services');
        
        // Initialize Autocomplete Service
        if (!autocompleteServiceRef.current) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          console.log('✅ AutocompleteService initialized');
        }
        
        // Initialize Places Service (requires a map div)
        if (!placesServiceRef.current && !mapDivRef.current) {
          mapDivRef.current = document.createElement('div');
          const map = new window.google.maps.Map(mapDivRef.current);
          placesServiceRef.current = new window.google.maps.places.PlacesService(map);
          console.log('✅ PlacesService initialized');
        }
        
        return true;
      }
      return false;
    };

    // Try to initialize immediately
    if (initializeServices()) return;

    // If not available, wait for script to load
    const checkInterval = setInterval(() => {
      if (initializeServices()) {
        clearInterval(checkInterval);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  // Fetch place predictions
  const fetchSuggestions = async (input) => {
    if (!input.trim() || !autocompleteServiceRef.current) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Searching places for:', input);

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: input,
          componentRestrictions: { country: 'lk' }, // Sri Lanka only
          types: ['tourist_attraction', 'museum', 'park', 'point_of_interest']
        },
        (predictions, status) => {
          console.log('📍 Places API Status:', status);
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            console.log('✅ Found', predictions.length, 'predictions');
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            console.log('⚠️ No results found');
            setSuggestions([]);
            setShowSuggestions(false);
          } else {
            console.error('❌ Places API error:', status);
            setError('Unable to fetch suggestions. Please try again.');
            setSuggestions([]);
          }
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('❌ Error fetching suggestions:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Fetch detailed place information
  const fetchPlaceDetails = (placeId) => {
    if (!placesServiceRef.current) {
      console.error('❌ PlacesService not initialized');
      return;
    }

    console.log('🔍 Fetching details for place:', placeId);

    placesServiceRef.current.getDetails(
      {
        placeId: placeId,
        fields: [
          'name',
          'formatted_address',
          'photos',
          'rating',
          'user_ratings_total',
          'opening_hours',
          'types',
          'editorial_summary',
          'geometry',
          'place_id'
        ]
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          console.log('✅ Place details fetched:', place);
          
          // Extract photo URL (first photo)
          const photoUrl = place.photos && place.photos.length > 0
            ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
            : null;

          // Extract opening hours
          let openingHours = null;
          if (place.opening_hours) {
            openingHours = {
              isOpen: place.opening_hours.isOpen ? place.opening_hours.isOpen() : null,
              weekdayText: place.opening_hours.weekday_text || [],
              openNow: place.opening_hours.open_now
            };
          }

          // Create enriched place object
          const enrichedPlace = {
            id: place.place_id,
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address,
            description: place.editorial_summary?.overview || `Visit ${place.name} - ${place.types?.[0]?.replace(/_/g, ' ') || 'attraction'} in Sri Lanka`,
            photo: photoUrl,
            rating: place.rating || null,
            ratingsCount: place.user_ratings_total || 0,
            openingHours: openingHours,
            types: place.types || [],
            location: place.geometry?.location ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            } : null,
            addedAt: new Date().toISOString()
          };

          console.log('📍 Enriched place data:', enrichedPlace);
          onPlaceSelect(enrichedPlace);
          
          // Clear input and suggestions
          onChange('');
          setSuggestions([]);
          setShowSuggestions(false);
        } else {
          console.error('❌ Failed to fetch place details:', status);
          setError('Unable to fetch place details. Please try again.');
        }
      }
    );
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.trim()) {
      fetchSuggestions(newValue);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    console.log('📍 Selected suggestion:', suggestion);
    fetchPlaceDetails(suggestion.place_id);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle clear button
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    inputRef.current?.focus();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <Loader className="h-4 w-4 text-gray-400 animate-spin" />
          ) : value ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {suggestion.structured_formatting?.main_text || suggestion.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {suggestion.structured_formatting?.secondary_text || ''}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && !isLoading && suggestions.length === 0 && value.trim() && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">
            No places found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlacesSearchAutocomplete;
