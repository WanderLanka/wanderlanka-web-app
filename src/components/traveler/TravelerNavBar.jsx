import { Link } from "react-router-dom";
import { Button, Logo, NavLink, Container, Avatar } from "../common";
import { toast } from 'react-toastify';
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

const TravelerNavbar = () => {
  const [user, setUser] = useState({ username: "", role: "" });

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
    { path: '/user/services', label: 'Services' },
    { path: '/user/profile', label: 'Profile' }
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
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path}
                    activeClass="bg-green-200 text-green-700 shadow-sm"
                    inactiveClass="text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section - User & Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <Avatar 
                  name="Accommodation Provider"
                  initials="AP"
                  bgColor="bg-gradient-to-br from-blue-600 to-blue-700"
                />
                <div className="hidden sm:block">
                  <span className="text-sm font-semibold text-slate-800 block">{user.username || "User"}</span>
                  <span className="text-xs text-slate-500">Traveler</span>
                </div>
              </div>
              <div
                onClick={handleLogout}
                className="cursor-pointer p-2 rounded hover:bg-red-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-5 focus:ring-red-100 flex items-center"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </div>
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
