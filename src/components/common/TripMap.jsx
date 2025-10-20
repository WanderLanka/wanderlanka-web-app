import { AlertCircle, Clock, MapPin, Navigation } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TripMap = ({ 
  startingDestination, 
  destination, 
  apiKey,
  waypoints = [], // NEW: Array of waypoint objects with name/address
  routePreference = 'recommended' // NEW: 'recommended', 'shortest', or 'scenic'
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const waypointMarkersRef = useRef([]); // NEW: Track waypoint markers
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps API loaded');
        initializeMap();
      } else {
        console.log('⏳ Waiting for Google Maps API...');
        setTimeout(checkGoogleMaps, 500);
      }
    };

    checkGoogleMaps();

    // Cleanup
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, []);

  // Re-calculate route when destinations or waypoints change
  useEffect(() => {
    if (mapInstanceRef.current && startingDestination && destination) {
      calculateAndDisplayRoute();
    }
  }, [startingDestination, destination, waypoints, routePreference]);

  const initializeMap = () => {
    try {
      console.log('🗺️ Initializing map...');
      
      // Create map centered on Sri Lanka
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka center
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Initialize Directions Service and Renderer
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // Use custom markers for better waypoint visualization
        polylineOptions: {
          strokeColor: '#10b981', // Emerald color (will be updated based on route type)
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });

      console.log('✅ Map initialized successfully');
      setLoading(false);

      // Calculate route if destinations are provided
      if (startingDestination && destination) {
        calculateAndDisplayRoute();
      }
    } catch (err) {
      console.error('❌ Error initializing map:', err);
      setError('Failed to initialize map');
      setLoading(false);
    }
  };

  const calculateAndDisplayRoute = () => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) {
      console.warn('⚠️ Directions service not ready');
      return;
    }

    if (!startingDestination || !destination) {
      console.warn('⚠️ Missing starting destination or destination');
      return;
    }

    // Clear existing waypoint markers
    clearWaypointMarkers();

    // Prepare waypoints for Google Directions API
    const formattedWaypoints = waypoints
      .filter(wp => wp && (wp.address || wp.name)) // Filter valid waypoints
      .map(wp => ({
        location: wp.address || wp.name,
        stopover: true // Stop at each waypoint
      }));

    console.log('🔍 Calculating route:', {
      origin: startingDestination,
      destination: destination,
      waypoints: formattedWaypoints.length,
      preference: routePreference
    });

    setLoading(true);
    setError(null);

    // Determine route optimization based on preference
    let optimizeWaypoints = false;
    let avoidHighways = false;
    let avoidTolls = false;

    switch (routePreference) {
      case 'shortest':
        optimizeWaypoints = true; // Optimize for shortest distance
        break;
      case 'scenic':
        avoidHighways = true; // Prefer smaller roads for scenic views
        break;
      case 'recommended':
      default:
        // Balanced approach - no special restrictions
        break;
    }

    // Update polyline color based on route type
    const routeColors = {
      recommended: '#10b981', // Emerald
      shortest: '#3b82f6',    // Blue
      scenic: '#a855f7'       // Purple
    };

    directionsRendererRef.current.setOptions({
      polylineOptions: {
        strokeColor: routeColors[routePreference] || routeColors.recommended,
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    directionsServiceRef.current.route(
      {
        origin: startingDestination,
        destination: destination,
        waypoints: formattedWaypoints,
        optimizeWaypoints: optimizeWaypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: avoidHighways,
        avoidTolls: avoidTolls
      },
      (result, status) => {
        setLoading(false);

        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log('✅ Route calculated successfully:', result);

          // Display route on map
          directionsRendererRef.current.setDirections(result);

          // Extract route information
          const route = result.routes[0];
          
          // Calculate total distance and duration
          let totalDistance = 0;
          let totalDuration = 0;
          route.legs.forEach(leg => {
            totalDistance += leg.distance.value; // in meters
            totalDuration += leg.duration.value; // in seconds
          });

          // Format distance and duration
          const distanceKm = (totalDistance / 1000).toFixed(1);
          const durationHours = Math.floor(totalDuration / 3600);
          const durationMinutes = Math.round((totalDuration % 3600) / 60);
          const durationText = durationHours > 0 
            ? `${durationHours}h ${durationMinutes}m` 
            : `${durationMinutes}m`;

          setRouteInfo({
            distance: `${distanceKm} km`,
            duration: durationText,
            startAddress: route.legs[0].start_address,
            endAddress: route.legs[route.legs.length - 1].end_address,
            waypointCount: formattedWaypoints.length,
            routeType: routePreference
          });

          // Add custom markers for start, end, and waypoints
          addCustomMarkers(route);
        } else {
          console.error('❌ Directions request failed:', status);
          let errorMessage = 'Failed to calculate route';
          
          switch (status) {
            case 'NOT_FOUND':
              errorMessage = 'One or more locations could not be found';
              break;
            case 'ZERO_RESULTS':
              errorMessage = 'No route could be found between these locations';
              break;
            case 'MAX_WAYPOINTS_EXCEEDED':
              errorMessage = 'Too many waypoints. Maximum 25 waypoints allowed';
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = 'Too many requests. Please try again later';
              break;
            case 'REQUEST_DENIED':
              errorMessage = 'Directions request denied. Check API key permissions';
              break;
            default:
              errorMessage = `Route calculation failed: ${status}`;
          }
          
          setError(errorMessage);
        }
      }
    );
  };

  const clearWaypointMarkers = () => {
    // Clear all existing waypoint markers
    waypointMarkersRef.current.forEach(marker => marker.setMap(null));
    waypointMarkersRef.current = [];
  };

  const addCustomMarkers = (route) => {
    if (!mapInstanceRef.current) return;

    clearWaypointMarkers();

    const legs = route.legs;

    // Starting point marker (Green)
    const startMarker = new window.google.maps.Marker({
      position: legs[0].start_location,
      map: mapInstanceRef.current,
      title: 'Starting Point',
      label: {
        text: 'A',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold'
      },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: '#10b981',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      }
    });
    waypointMarkersRef.current.push(startMarker);

    // Waypoint markers (Blue)
    legs.slice(0, -1).forEach((leg, index) => {
      const waypointMarker = new window.google.maps.Marker({
        position: leg.end_location,
        map: mapInstanceRef.current,
        title: `Waypoint ${index + 1}`,
        label: {
          text: String(index + 1),
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });
      waypointMarkersRef.current.push(waypointMarker);
    });

    // Destination marker (Red)
    const endMarker = new window.google.maps.Marker({
      position: legs[legs.length - 1].end_location,
      map: mapInstanceRef.current,
      title: 'Destination',
      label: {
        text: 'B',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold'
      },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: '#ef4444',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      }
    });
    waypointMarkersRef.current.push(endMarker);
  };

  return (
    <div className="h-full w-full relative">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading map...</p>
            <p className="text-sm text-gray-500 mt-2">Calculating route</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-red-800 font-semibold text-sm mb-1">Route Error</h4>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route Info Card */}
      {routeInfo && !loading && !error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className={`p-4 text-white ${
              routeInfo.routeType === 'shortest' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              routeInfo.routeType === 'scenic' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
              'bg-gradient-to-r from-emerald-500 to-emerald-600'
            }`}>
              <h3 className="font-semibold text-lg mb-1">
                {routeInfo.routeType === 'shortest' ? 'Shortest Route' :
                 routeInfo.routeType === 'scenic' ? 'Scenic Route' :
                 'Recommended Route'}
              </h3>
              <p className={`text-sm ${
                routeInfo.routeType === 'shortest' ? 'text-blue-100' :
                routeInfo.routeType === 'scenic' ? 'text-purple-100' :
                'text-emerald-100'
              }`}>
                {routeInfo.waypointCount > 0 
                  ? `Journey through ${routeInfo.waypointCount} waypoint${routeInfo.waypointCount > 1 ? 's' : ''}`
                  : 'Direct journey to destination'}
              </p>
            </div>
            
            <div className="p-4 space-y-3">
              {/* Starting Point */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Starting Point</p>
                  <p className="text-sm text-gray-900 font-medium truncate">{routeInfo.startAddress}</p>
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                  <Navigation className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Destination</p>
                  <p className="text-sm text-gray-900 font-medium truncate">{routeInfo.endAddress}</p>
                </div>
              </div>

              {/* Distance & Duration */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <Navigation className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-semibold text-gray-900">{routeInfo.distance}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-semibold text-gray-900">{routeInfo.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Route Message */}
      {!loading && !error && !routeInfo && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md mx-4">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 text-center font-medium">
              Select starting location and destination to view route
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripMap;
