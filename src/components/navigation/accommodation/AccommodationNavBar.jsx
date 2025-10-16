import { Link, useLocation } from "react-router-dom";
import Button from "../../common/Button";
import Logo from "../../common/Logo";

const AccommodationNavbar = () => {
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/accommodation', label: 'Overview' },
    { path: '/accommodation/hotels', label: 'My Hotels' },
    { path: '/accommodation/bookings', label: 'Current Bookings' },
    { path: '/accommodation/payments', label: 'Payments' },
    { path: '/accommodation/profile', label: 'Profile' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Brand */}
          <Link to="/accommodation" className="flex items-center space-x-3 group">
            <Logo size="sm" variant="accommodation" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-150">WanderLanka</h1>
              <span className="text-sm text-slate-500 font-medium">Accommodation Solutions</span>
            </div>
          </Link>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                      isActive(item.path) 
                        ? 'bg-blue-50 text-blue-700 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section - User & Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">AP</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold text-slate-800 block">Accommodation Provider</span>
                  <span className="text-xs text-slate-500">Administrator</span>
                </div>
              </div>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleLogout}
                className="focus:ring-red-500 focus:ring-offset-2"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AccommodationNavbar;
