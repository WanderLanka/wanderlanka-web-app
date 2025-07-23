import { Link, useLocation } from "react-router-dom";
import "./AdminNavbar.css";

const AdminNavbar = () => {
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-container">
        {/* Left Section - Brand */}
        <div className="navbar-left">
          <Link to="/admin" className="brand-section">
            <div className="company-logo">
              <span className="logo-mark">W</span>
            </div>
            <div className="company-info">
              <h1 className="company-name">WanderLanka</h1>
              <span className="division-name">Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Center Section - Navigation */}
        <nav className="navbar-center">
          <ul className="main-navigation">
            <li className="nav-item">
              <Link 
                to="/admin" 
                className={`nav-link ${isActive('/admin') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/payment" 
                className={`nav-link ${isActive('/admin/payment-analytics') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-label">Payment Analytics</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/requests" 
                className={`nav-link ${isActive('/admin/signup-requests') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-label">Signup Requests</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/admin/complains" 
                className={`nav-link ${isActive('/admin/complaints') ? 'nav-link--active' : ''}`}
              >
                <span className="nav-icon">📞</span>
                <span className="nav-label">Complaints</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Section - User & Actions */}
        <div className="navbar-right">
          <div className="user-section">
            <div className="user-profile">
              <div className="user-avatar">
                <span className="avatar-initials">AD</span>
              </div>
              <div className="user-info">
                <span className="user-name">System Administrator</span>
                <span className="user-role">Super Admin</span>
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

export default AdminNavbar;