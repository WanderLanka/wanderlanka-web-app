import { Link, useLocation } from "react-router-dom";
import "../styles/TransportNavbar.css";

const TransportNavbar = () => {
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
          <Link to="/transport" className="brand-section">
            <div className="company-logo">
              <span className="logo-mark">W</span>
            </div>
            <div className="company-info">
              <h1 className="company-name">WanderLanka</h1>
              <span className="division-name">Transport Solutions</span>
            </div>
          </Link>
        </div>

        {/* Center Section - Navigation */}
        <nav className="navbar-center">
          <ul className="main-navigation">
            <li className="nav-item">
              <Link 
                to="/transport" 
                className={`nav-link ${isActive('/transport') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Overview</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/transport/vehicles" 
                className={`nav-link ${isActive('/transport/vehicles') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Fleet Management</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/transport/trips" 
                className={`nav-link ${isActive('/transport/trips') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Operations</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/transport/drivers" 
                className={`nav-link ${isActive('/transport/drivers') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Personnel</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/transport/payments" 
                className={`nav-link ${isActive('/transport/payments') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Financial</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/transport/profile" 
                className={`nav-link ${isActive('/transport/profile') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-label">Account</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Section - User & Actions */}
        <div className="navbar-right">
          <div className="user-section">
            <div className="user-profile">
              <div className="user-avatar">
                <span className="avatar-initials">TP</span>
              </div>
              <div className="user-info">
                <span className="user-name">Transport Provider</span>
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

export default TransportNavbar;