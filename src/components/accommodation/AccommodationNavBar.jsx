import { Link } from "react-router-dom";
import { Button, Logo, NavLink, Container, Avatar } from "../common";
import { toast } from 'react-toastify';

const AccommodationNavbar = () => {
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
    { path: '/accommodation', label: 'Dashboard' },
    { path: '/accommodation/hotels', label: 'My Hotels' },
    { path: '/accommodation/bookings', label: 'Bookings' },
    { path: '/accommodation/payments', label: 'Payments' },
    { path: '/accommodation/complains/report', label: 'Report a Complain' },
    { path: '/accommodation/profile', label: 'Profile' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <Container>
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
                  <NavLink 
                    to={item.path}
                    activeClass="bg-blue-50 text-blue-700 shadow-sm"
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
                Log Out
              </Button>
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

export default AccommodationNavbar;
