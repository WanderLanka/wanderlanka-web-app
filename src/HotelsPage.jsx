import { useState, useEffect } from "react";
import api from "./axiosConfig.js"; // Use your existing axios config
import "./HotelsPage.css";
import { Navigate, useNavigate } from "react-router-dom";

const HotelsPage = () => {
  const Navigate=useNavigate();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // API call using your existing axios configuration
  const fetchHotels = async () => {
    try {
      setLoading(true);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
      console.log('Token value:', token);
      
      if (!token) {
        setError('Please log in to view hotels.');
        setLoading(false);
        return;
      }

      // Debug: Log the request
      console.log('Making request to: /accommodation/places');
      
      // Use your existing api instance - it will automatically add the Bearer token
      const response = await api.get('/accommodation/places');
      console.log('Response received:', response.data);
      
      setHotels(response.data);
      setFilteredHotels(response.data);
      setError("");
      
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      setError("Failed to fetch hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter hotels based on selected type
  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    if (filterType === "all") {
      setFilteredHotels(hotels);
    } else {
      setFilteredHotels(hotels.filter(hotel => hotel.accommodationType === filterType));
    }
  };

  // Handle view hotel details
  const handleViewHotelDetails = (hotelId) => {
  Navigate(`/accommodation/hotels/${hotelId}`);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "status-badge status-badge--available";
      case "inactive":
        return "status-badge status-badge--unavailable";
      case "under_maintenance":
        return "status-badge status-badge--maintenance";
      default:
        return "status-badge";
    }
  };

  // Get accommodation type icon
  const getAccommodationIcon = (accommodationType) => {
    switch (accommodationType) {
      case "hotel":
        return "🏨";
      case "resort":
        return "🏖️";
      case "guesthouse":
        return "🏠";
      case "homestay":
        return "🏡";
      default:
        return "🏨";
    }
  };

  // Format star rating
  const formatStarRating = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  // useEffect to fetch hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="hotels-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hotels-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Hotel Management</h1>
            <p className="page-subtitle">
              Manage your accommodation properties, track availability, and monitor performance
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{hotels.length}</span>
              <span className="stat-label">Total Hotels</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {hotels.filter(h => h.status === "active").length}
              </span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <div className="filter-left">
            <label className="filter-label">Filter by Hotel Type:</label>
            <select 
              className="filter-dropdown"
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Hotels</option>
              <option value="hotel">Hotels</option>
              <option value="resort">Resorts</option>
              <option value="guesthouse">Guesthouses</option>
              <option value="homestay">Homestays</option>
            </select>
            <div className="results-count">
              {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
            </div>
          </div>
          <div className="filter-right">
            <button 
              className="add-hotel-btn"
              onClick={() => console.log("Add hotel - to be implemented")}
            >
              <span className="btn-icon">➕</span>
              Add Hotel
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Hotels Grid */}
      <div className="hotels-container">
        {filteredHotels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏨</div>
            <h3 className="empty-title">No hotels found</h3>
            <p className="empty-description">
              {selectedFilter === "all" 
                ? "No hotels are currently registered in your system."
                : `No ${selectedFilter}s found in your system.`
              }
            </p>
          </div>
        ) : (
          <div className="hotels-grid">
            {filteredHotels.map((hotel) => (
              <div key={hotel._id || hotel.id} className="hotel-card">
                {/* Card Header */}
                <div className="card-header">
                  <div className="hotel-type">
                    <span className="hotel-icon">{getAccommodationIcon(hotel.accommodationType)}</span>
                    <span className="hotel-type-text">
                      {hotel.accommodationType.charAt(0).toUpperCase() + hotel.accommodationType.slice(1)}
                    </span>
                  </div>
                  <div className={getStatusBadgeClass(hotel.status)}>
                    {hotel.status ? hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1) : 'Unknown'}
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <div className="hotel-details">
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">{hotel.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Star Rating:</span>
                      <span className="detail-value">{formatStarRating(hotel.starRating)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Rooms:</span>
                      <span className="detail-value">{hotel.totalRooms} rooms</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{hotel.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Check-in:</span>
                      <span className="detail-value">{hotel.checkInTime}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Check-out:</span>
                      <span className="detail-value">{hotel.checkOutTime}</span>
                    </div>
                  </div>
                </div>

                {/* Hotel Stats */}
                <div className="hotel-stats">
                  <div className="stat-item-small">
                    <span className="stat-number-small">{hotel.totalRooms}</span>
                    <span className="stat-label-small">Rooms</span>
                  </div>
                  <div className="stat-item-small">
                    <span className="stat-number-small">{hotel.starRating}</span>
                    <span className="stat-label-small">Stars</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions">
                  <button 
                    className="action-btn action-btn--details"
                    onClick={() => handleViewHotelDetails(hotel._id || hotel.id)}
                  >
                    <span className="btn-icon">👁️</span>
                    View Details
                  </button>
                  <button 
                    className="action-btn action-btn--update"
                    onClick={() => console.log("Update hotel - to be implemented")}
                  >
                    <span className="btn-icon">✏️</span>
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;