import { Link, useLocation } from "react-router-dom";
import "../styles/AccommodationNavbar.css"; // Using the same CSS file

const AccommodationNavbar = () => {
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="transport-navbar">
      <div className="navbar-container">
        {/* Left Section - Brand */}
        <div className="navbar-left">
          <Link to="/accommodation" className="brand-section">
            <div className="company-logo">
              <span className="logo-mark">W</span>
            </div>
            <div className="company-info">
              <h1 className="company-name">WanderLanka</h1>
              <span className="division-name">Accommodation Solutions</span>
            </div>
          </Link>
        </div>

        {/* Center Section - Navigation */}
        <nav className="navbar-center">
          <ul className="main-navigation">
            <li className="nav-item">
              <Link 
                to="/accommodation" 
                className={`nav-link ${isActive('/accommodation') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Overview</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/accommodation/hotels" 
                className={`nav-link ${isActive('/accommodation/hotels') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">My Hotels</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/accommodation/bookings" 
                className={`nav-link ${isActive('/accommodation/bookings') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Current Bookings</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/accommodation/payments" 
                className={`nav-link ${isActive('/accommodation/payments') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Payments</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/accommodation/profile" 
                className={`nav-link ${isActive('/accommodation/profile') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Profile</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Section - User & Actions */}
        <div className="navbar-right">
          <div className="user-section">
            <div className="user-profile">
              <div className="user-avatar">
                <span className="avatar-initials">AP</span>
              </div>
              <div className="user-info">
                <span className="user-name">Accommodation Provider</span>
                <span className="user-role">Administrator</span>
              </div>
            </div>
            <div className="user-actions">
              <button 
                onClick={handleLogout} 
                className="action-button action-button--logout"
                title="Sign out of your account"
              >
                <span className="button-text">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AccommodationNavbar;