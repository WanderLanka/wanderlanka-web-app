import { Link } from "react-router-dom";
import { Button, Logo, NavLink, Container, Avatar } from "../common";
import { toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";
import { LogOut, ChevronDown, Home, Car, Users, User, AlertTriangle } from "lucide-react";

const TravelerNavbar = () => {
  const [user, setUser] = useState({ username: "", role: "" });
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const servicesDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Fetching user details from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        username: storedUser.username || "",
        role: storedUser.role || ""
      });
    }
  }, []);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setShowServicesDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const handleLogout = () => {
    toast.info(
  <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl max-w-md mx-auto">
    {/* Custom icon on top */}
    <span className="text-4xl mb-4">⚠️</span> 
    <p className="text-lg font-medium mb-6">Are you sure you want to logout?</p>
    <div className="flex justify-center gap-4">
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/auth";
        }}
      >
        Yes
      </button>
      <button
        className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
        onClick={() => toast.dismiss()}
      >
        No
      </button>
    </div>
  </div>,
  {
    autoClose: false,
    closeOnClick: false,
    hideProgressBar: true,
    closeButton: false,
    icon: false,  // DISABLE default icon
    className: "toast-center",
  }
);
  };

  const navItems = [
    { path: '/user', label: 'Dashboard' },
    { path: '/user/mybookings', label: 'My Bookings' },
    { path: '/user/mytrips', label: 'My Trips' },
    { path: '/user/payments', label: 'Payments' },
    { path: '/user/complaints', label: 'Complaints', icon: AlertTriangle }
  ];

  const servicesSubmenu = [
    { 
      path: '/user/accommodations', 
      label: 'Accommodations',
      icon: Home,
      description: 'Hotels, resorts & stays'
    },
    { 
      path: '/user/transportation', 
      label: 'Transportation',
      icon: Car,
      description: 'Cars, transfers & transport'
    },
    { 
      path: '/user/tour-guides', 
      label: 'Tour Guides',
      icon: Users,
      description: 'Local guides & tours'
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Brand */}
          <Link to="/user" className="flex items-center space-x-3 group">
            <Logo size="sm" variant="accommodation" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-150">WanderLanka</h1>
            </div>
          </Link>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink 
                      to={item.path}
                      activeClass="bg-green-200 text-green-700 shadow-sm"
                      inactiveClass="text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    >
                      <div className="flex items-center space-x-1">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
              
              {/* Services Dropdown */}
              <li className="relative" ref={servicesDropdownRef}>
                <button
                  onClick={() => setShowServicesDropdown(!showServicesDropdown)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-150"
                >
                  <span>Services</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showServicesDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showServicesDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                    {servicesSubmenu.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowServicesDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors duration-150"
                        >
                          <div className="flex-shrink-0">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-800">{item.label}</div>
                            <div className="text-xs text-slate-500">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            </ul>
          </nav>

          {/* Right Section - User Avatar Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 p-1 rounded-full hover:bg-slate-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Avatar 
                  name="Traveler"
                  initials={user.username ? user.username.charAt(0).toUpperCase() : "T"}
                  bgColor="bg-gradient-to-br from-blue-600 to-blue-700"
                />
                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <Avatar 
                        name="Traveler"
                        initials={user.username ? user.username.charAt(0).toUpperCase() : "T"}
                        bgColor="bg-gradient-to-br from-blue-600 to-blue-700"
                        size="sm"
                      />
                      <div>
                        <div className="font-medium text-slate-800">{user.username || "User"}</div>
                        <div className="text-xs text-slate-500">Traveler</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to="/user/profile"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-slate-50 transition-colors duration-150"
                    >
                      <User className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">My Profile</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors duration-150 text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      <style>{`
        .toast-center {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 9999 !important;
          width: auto !important;
          max-width: 90% !important;
          text-align: center;
        }
      `}</style>

    </header>
  );
};

export default TravelerNavbar;
