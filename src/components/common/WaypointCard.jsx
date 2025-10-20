import { CheckCircle, Clock, MapPin, Star, X, XCircle } from 'lucide-react';

/**
 * WaypointCard Component
 * 
 * Displays a waypoint/place card with comprehensive details
 * Features:
 * - Place photo (from Google Places API)
 * - Name and address
 * - Description
 * - Rating with star icon
 * - Opening hours (if available)
 * - Remove button
 * 
 * Props:
 * @param {object} place - Place object with details
 * @param {function} onRemove - Handler for removing the waypoint
 */
const WaypointCard = ({ place, onRemove }) => {
  // Format opening hours for display
  const formatOpeningHours = () => {
    if (!place.openingHours) return null;

    const { openNow, weekdayText } = place.openingHours;
    
    // Get today's hours
    const today = new Date().getDay();
    const todayText = weekdayText && weekdayText[today === 0 ? 6 : today - 1]; // Adjust for Sunday

    return {
      openNow,
      todayText
    };
  };

  const hours = formatOpeningHours();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* Place Photo */}
        <div className="relative w-32 h-32 flex-shrink-0">
          {place.photo ? (
            <img
              src={place.photo}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-emerald-600" />
            </div>
          )}
          
          {/* Rating Badge */}
          {place.rating && (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-sm">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-xs font-semibold text-gray-800">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Place Details */}
        <div className="flex-1 p-3 relative">
          {/* Remove Button */}
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remove waypoint"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Place Name */}
          <h5 className="font-semibold text-gray-900 text-sm mb-1 pr-8">
            {place.name}
          </h5>

          {/* Description */}
          {place.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {place.description}
            </p>
          )}

          {/* Rating and Reviews Count */}
          {place.rating && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(place.rating)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {place.ratingsCount > 0 && (
                <span className="text-xs text-gray-500 ml-2">
                  ({place.ratingsCount.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {/* Opening Hours */}
          {hours && (
            <div className="flex items-start mb-2">
              <Clock className="w-3.5 h-3.5 text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                {hours.openNow !== null && (
                  <div className="flex items-center mb-0.5">
                    {hours.openNow ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-xs font-medium text-green-600">Open Now</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-red-600 mr-1" />
                        <span className="text-xs font-medium text-red-600">Closed</span>
                      </>
                    )}
                  </div>
                )}
                {hours.todayText && (
                  <p className="text-xs text-gray-600">
                    {hours.todayText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Address */}
          {place.address && (
            <div className="flex items-start">
              <MapPin className="w-3.5 h-3.5 text-gray-500 mr-1.5 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600 line-clamp-1">
                {place.address}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaypointCard;
