import { useState, useEffect, useRef } from 'react';
import { MapPin, X, Loader } from 'lucide-react';

const PlacesAutocomplete = ({ 
    value, 
    onChange, 
    placeholder = "Enter location",
    label = "Location",
    error = null,
    onClearError = () => {},
    required = false,
    icon: Icon = MapPin,
    className = "",
    inputClassName = ""
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const autocompleteService = useRef(null);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    // Initialize Google Places Autocomplete Service
    useEffect(() => {
        const initializeAutocomplete = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                console.log('✅ Google Maps API loaded successfully');
                autocompleteService.current = new window.google.maps.places.AutocompleteService();
            } else {
                console.warn('⚠️ Google Maps JavaScript API not loaded yet, retrying...');
                // Retry after a short delay
                setTimeout(initializeAutocomplete, 500);
            }
        };

        initializeAutocomplete();
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch place suggestions
    const fetchSuggestions = (input) => {
        if (!input || input.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        if (!autocompleteService.current) {
            console.warn('⚠️ Autocomplete service not initialized yet');
            return;
        }

        setIsLoading(true);
        console.log('🔍 Fetching suggestions for:', input);

        autocompleteService.current.getPlacePredictions(
            {
                input,
                // Restrict to all places in Sri Lanka (cities, towns, villages, landmarks)
                types: ['geocode'], // Use 'geocode' for all geographic locations
                componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka only
            },
            (predictions, status) => {
                setIsLoading(false);
                console.log('📍 API Response Status:', status);
                console.log('📍 Predictions:', predictions);
                
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    console.log('✅ Found', predictions.length, 'suggestions');
                    setSuggestions(predictions);
                    setShowSuggestions(true);
                } else {
                    console.warn('❌ No predictions. Status:', status);
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            }
        );
    };

    // Handle input change
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(newValue);
        onClearError();
        fetchSuggestions(newValue);
    };

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion) => {
        onChange(suggestion.description);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Handle clear
    const handleClear = () => {
        onChange('');
        setSuggestions([]);
        setShowSuggestions(false);
        onClearError();
        inputRef.current?.focus();
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <label className="block text-white/90 text-sm font-medium mb-2">
                <Icon className="inline w-4 h-4 mr-2" />
                {label}
                {required && <span className="text-red-300 ml-1">*</span>}
            </label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full px-4 py-3 pr-20 bg-white/90 backdrop-blur-sm border-0 rounded-xl text-slate-800 placeholder-slate-500 focus:ring-2 focus:outline-none transition-all duration-200 ${
                        error 
                            ? 'focus:ring-red-500 ring-2 ring-red-500/50' 
                            : 'focus:ring-white/50'
                    } ${inputClassName}`}
                />
                
                {/* Loading Spinner or Clear Button */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isLoading && (
                        <Loader className="w-5 h-5 text-slate-400 animate-spin" />
                    )}
                    {value && !isLoading && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                            aria-label="Clear"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 max-h-64 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={suggestion.place_id}
                                type="button"
                                onClick={() => handleSelectSuggestion(suggestion)}
                                className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                                    index !== suggestions.length - 1 ? 'border-b border-slate-100' : ''
                                }`}
                            >
                                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-slate-800 font-medium">
                                        {suggestion.structured_formatting.main_text}
                                    </div>
                                    <div className="text-sm text-slate-500 truncate">
                                        {suggestion.structured_formatting.secondary_text}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-300 text-sm mt-1 ml-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PlacesAutocomplete;
