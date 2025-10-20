import { Navigation, Zap, Camera } from 'lucide-react';

const RouteButtons = ({ onRouteSelect, selectedRoute, disabled }) => {
  const routes = [
    {
      id: 'recommended',
      label: 'Recommended Route',
      icon: Navigation,
      color: 'emerald',
      description: 'Best overall route considering time and distance'
    },
    {
      id: 'shortest',
      label: 'Shortest Route',
      icon: Zap,
      color: 'blue',
      description: 'Fastest route to your destination'
    },
    {
      id: 'scenic',
      label: 'Scenic Route',
      icon: Camera,
      color: 'purple',
      description: 'Most scenic route with beautiful views'
    }
  ];

  const getButtonStyles = (routeId, color) => {
    const isSelected = selectedRoute === routeId;
    const baseStyles = 'flex-1 flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const colorStyles = {
      emerald: {
        selected: 'bg-emerald-600 border-emerald-600 text-white shadow-lg transform scale-105',
        unselected: 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400'
      },
      blue: {
        selected: 'bg-blue-600 border-blue-600 text-white shadow-lg transform scale-105',
        unselected: 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400'
      },
      purple: {
        selected: 'bg-purple-600 border-purple-600 text-white shadow-lg transform scale-105',
        unselected: 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
      }
    };

    return `${baseStyles} ${isSelected ? colorStyles[color].selected : colorStyles[color].unselected}`;
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Select Route Type
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route) => {
          const Icon = route.icon;
          const isSelected = selectedRoute === route.id;
          
          return (
            <button
              key={route.id}
              onClick={() => onRouteSelect(route.id)}
              disabled={disabled}
              className={getButtonStyles(route.id, route.color)}
              title={route.description}
            >
              <Icon 
                className={`w-8 h-8 mb-2 ${isSelected ? 'text-white' : `text-${route.color}-600`}`}
              />
              <span className="font-semibold text-sm mb-1">
                {route.label}
              </span>
              <span className={`text-xs text-center ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                {route.description}
              </span>
            </button>
          );
        })}
      </div>
      
      {!disabled && selectedRoute && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-semibold">Route selected!</span> The map will display the {selectedRoute} route through all your waypoints.
          </p>
        </div>
      )}
      
      {disabled && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 text-center">
            <span className="font-semibold">Add waypoints to enable route calculation.</span> Start by adding places you want to visit in each day.
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteButtons;
