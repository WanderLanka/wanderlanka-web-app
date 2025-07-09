import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./axiosConfig.js"; // Use your existing axios config
import "./Rooms.css";

const RoomsPage = () => {
  const { hotelid } = useParams();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hotelData, setHotelData] = useState(null);

  // API call using your existing axios configuration
  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      // Check authentication
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view rooms.');
        setRooms([]);
        setFilteredRooms([]);
        setHotelData(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/accommodation/places/${hotelid}`);
      // Store hotel data (if object, not array)
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        setHotelData(response.data);
      } else {
        setHotelData(null);
      }

      // Try to extract rooms array from possible locations
      let roomsData = [];
      if (response.data.rooms && Array.isArray(response.data.rooms)) {
        roomsData = response.data.rooms;
      } else if (Array.isArray(response.data)) {
        roomsData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        roomsData = response.data.data;
      } else if (Array.isArray(response.data.roomTypes)) {
        roomsData = response.data.roomTypes;
      }

      setRooms(roomsData);
      setFilteredRooms(roomsData);
      setError("");
    } catch (err) {
      setRooms([]);
      setFilteredRooms([]);
      setHotelData(null);
      if (err.response?.status === 404) {
        setError("Hotel not found.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError("Failed to fetch hotel details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on selected type
  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    if (filterType === "all") {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(room => room.type === filterType));
    }
  };

  // Handle room card click
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  // Close room modal
  const closeRoomModal = () => {
    setShowRoomModal(false);
    setSelectedRoom(null);
  };

  // Get availability status
  const getAvailabilityStatus = (availableCount, totalCount) => {
    if (!totalCount || totalCount === 0) return { status: 'full', text: 'No Rooms' };
    
    const percentage = (availableCount / totalCount) * 100;
    if (percentage === 0) return { status: 'full', text: 'Fully Booked' };
    if (percentage <= 25) return { status: 'low', text: 'Limited Availability' };
    if (percentage <= 50) return { status: 'medium', text: 'Available' };
    return { status: 'high', text: 'Highly Available' };
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "high":
        return "status-badge status-badge--available";
      case "medium":
        return "status-badge status-badge--medium";
      case "low":
        return "status-badge status-badge--low";
      case "full":
        return "status-badge status-badge--unavailable";
      default:
        return "status-badge";
    }
  };

  // Get room type display name
  const getRoomTypeDisplay = (type) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) + " Room" : "Room";
  };

  // Get room type icon
  const getRoomTypeIcon = (type) => {
    return type === 'luxury' ? '👑' : '🛏️';
  };

  // Calculate total rooms
  const getTotalRooms = () => {
    return rooms.reduce((sum, room) => sum + (room.roomcount || 0), 0);
  };

  // Calculate available rooms
  const getAvailableRooms = () => {
    return rooms.reduce((sum, room) => sum + (room.availableroomcount || 0), 0);
  };

  // useEffect to fetch rooms on component mount
  useEffect(() => {
    if (hotelid) {
      fetchRooms();
    } else {
      setError("Hotel ID is required");
      setLoading(false);
    }
  }, [hotelid]);

  if (loading) {
    return (
      <div className="rooms-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading room types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      {/* Debug Info - Remove this after fixing */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px', fontSize: '12px' }}>
          <strong>Debug Info:</strong><br/>
          Hotel Data: {hotelData ? JSON.stringify(Object.keys(hotelData)) : 'null'}<br/>
          Rooms Array Length: {rooms.length}<br/>
          Filtered Rooms Length: {filteredRooms.length}<br/>
          Selected Filter: {selectedFilter}<br/>
          {rooms.length > 0 && (
            <>First Room Keys: {JSON.stringify(Object.keys(rooms[0] || {}))}</>
          )}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              {hotelData?.name ? `${hotelData.name} - Room Types` : 'Room Type Management'}
            </h1>
            <p className="page-subtitle">
              Manage room types, availability, and pricing for your accommodation
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{getTotalRooms()}</span>
              <span className="stat-label">Total Rooms</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getAvailableRooms()}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <div className="filter-left">
            <label className="filter-label">Filter by Room Type:</label>
            <select 
              className="filter-dropdown"
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Room Types</option>
              <option value="luxury">Luxury Rooms</option>
              <option value="standard">Standard Rooms</option>
            </select>
            <div className="results-count">
              {filteredRooms.length} room type{filteredRooms.length !== 1 ? 's' : ''} found
            </div>
          </div>
          <div className="filter-right">
            <button 
              className="add-room-btn"
              onClick={() => console.log("Add room type - to be implemented")}
            >
              <span className="btn-icon">➕</span>
              Add Room Type
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

      {/* Rooms Grid */}
      <div className="rooms-container">
        {filteredRooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛏️</div>
            <h3 className="empty-title">No room types found</h3>
            <p className="empty-description">
              {selectedFilter === "all" 
                ? "No room types are currently configured in your system."
                : `No ${selectedFilter} room types found in your system.`
              }
            </p>
          </div>
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map((room, index) => {
              const availability = getAvailabilityStatus(room.availableroomcount, room.roomcount);
              
              return (
                <div 
                  key={room._id || index} 
                  className="room-card"
                  onClick={() => handleRoomClick(room)}
                >
                  {/* Room Image */}
                  <div className="room-image-container">
                    <img 
                      src={room.images && room.images[0] ? room.images[0] : 'https://via.placeholder.com/400x250?text=No+Image'} 
                      alt={getRoomTypeDisplay(room.type)}
                      className="room-image"
                      onError={(e) => {
                        const placeholder = 'https://via.placeholder.com/400x250?text=No+Image';
                        if (e.target.src !== placeholder) {
                          e.target.src = placeholder;
                        }
                      }}
                    />
                    <div className="room-overlay">
                      <span className="view-details">View Details</span>
                    </div>
                  </div>

                  {/* Card Header */}
                  <div className="card-header">
                    <div className="room-info-header">
                      <div className="room-type-badge">
                        <span className="room-icon">{getRoomTypeIcon(room.type)}</span>
                        <span className="room-type-text">{room.type ? room.type.toUpperCase() : 'ROOM'}</span>
                      </div>
                      <div className={getStatusBadgeClass(availability.status)}>
                        {availability.text}
                      </div>
                    </div>
                  </div>

                  {/* Room Basic Info */}
                  <div className="room-basic-info">
                    <h3 className="room-type-title">{getRoomTypeDisplay(room.type)}</h3>
                    <p className="room-description">
                      {room.description ? room.description.substring(0, 100) + '...' : 'No description available'}
                    </p>
                  </div>

                  {/* Room Stats */}
                  <div className="room-stats">
                    <div className="stat-item-small">
                      <span className="stat-number-small">{room.roomcount || 0}</span>
                      <span className="stat-label-small">Total Rooms</span>
                    </div>
                    <div className="stat-item-small">
                      <span className="stat-number-small">{room.availableroomcount || 0}</span>
                      <span className="stat-label-small">Available</span>
                    </div>
                    <div className="stat-item-small">
                      <span className="stat-number-small">{room.maxOccupancy || 0}</span>
                      <span className="stat-label-small">Max Guests</span>
                    </div>
                  </div>

                  {/* Room Features */}
                  <div className="room-features">
                    <div className="feature-item">
                      <span className="feature-icon">{room.isAC ? '❄️' : '🌬️'}</span>
                      <span className="feature-text">{room.isAC ? 'AC' : 'Non-AC'}</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">{room.isPetsAllowed ? '🐕' : '🚫'}</span>
                      <span className="feature-text">{room.isPetsAllowed ? 'Pet Friendly' : 'No Pets'}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="room-pricing">
                    <div className="pricing-row">
                      <div className="price-item">
                        <span className="price-label">Per Night</span>
                        <span className="price-value">LKR {(room.pricePerNight || 0).toLocaleString()}</span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">Per Day</span>
                        <span className="price-value">LKR {(room.pricePerDay || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <div className="modal-overlay" onClick={closeRoomModal}>
          <div className="modal-content room-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{getRoomTypeDisplay(selectedRoom.type)}</h2>
              <button className="modal-close" onClick={closeRoomModal}>✕</button>
            </div>

            <div className="room-modal-body">
              {/* Room Images */}
              <div className="room-modal-images">
                {selectedRoom.images && selectedRoom.images.length > 0 ? (
                  selectedRoom.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${getRoomTypeDisplay(selectedRoom.type)} ${index + 1}`}
                      className="modal-room-image"
                      onError={(e) => {
                        const placeholder = 'https://via.placeholder.com/400x250?text=No+Image';
                        if (e.target.src !== placeholder) {
                          e.target.src = placeholder;
                        }
                      }}
                    />
                  ))
                ) : (
                  <img 
                    src="https://via.placeholder.com/400x250?text=No+Image"
                    alt="No Image Available"
                    className="modal-room-image"
                  />
                )}
              </div>

              {/* Room Details Grid */}
              <div className="room-details-grid">
                {/* Basic Information */}
                <div className="detail-section">
                  <h3 className="section-title">Room Information</h3>
                  <div className="detail-list">
                    <div className="detail-row">
                      <span className="detail-label">Room Type:</span>
                      <span className="detail-value">{getRoomTypeDisplay(selectedRoom.type)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Rooms:</span>
                      <span className="detail-value">{selectedRoom.roomcount || 0} rooms</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Available Rooms:</span>
                      <span className="detail-value">{selectedRoom.availableroomcount || 0} rooms</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Occupancy Rate:</span>
                      <span className="detail-value">
                        {selectedRoom.roomcount > 0 
                          ? (((selectedRoom.roomcount - selectedRoom.availableroomcount) / selectedRoom.roomcount) * 100).toFixed(1)
                          : 0
                        }%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features & Amenities */}
                <div className="detail-section">
                  <h3 className="section-title">Features & Amenities</h3>
                  <div className="detail-list">
                    <div className="detail-row">
                      <span className="detail-label">Maximum Occupancy:</span>
                      <span className="detail-value">{selectedRoom.maxOccupancy || 0} guests</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Air Conditioning:</span>
                      <span className="detail-value">{selectedRoom.isAC ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Pet Policy:</span>
                      <span className="detail-value">{selectedRoom.isPetsAllowed ? 'Pets Allowed' : 'No Pets'}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="detail-section">
                  <h3 className="section-title">Pricing</h3>
                  <div className="pricing-details">
                    <div className="price-detail-item">
                      <span className="price-detail-label">Night Rate</span>
                      <span className="price-detail-amount">LKR {(selectedRoom.pricePerNight || 0).toLocaleString()}</span>
                    </div>
                    <div className="price-detail-item">
                      <span className="price-detail-label">Day Rate</span>
                      <span className="price-detail-amount">LKR {(selectedRoom.pricePerDay || 0).toLocaleString()}</span>
                    </div>
                    {selectedRoom.pricePerNight && selectedRoom.pricePerDay && selectedRoom.pricePerNight > selectedRoom.pricePerDay && (
                      <div className="price-detail-item savings">
                        <span className="price-detail-label">Day Rate Savings</span>
                        <span className="price-detail-amount">
                          {(((selectedRoom.pricePerNight - selectedRoom.pricePerDay) / selectedRoom.pricePerNight) * 100).toFixed(1)}% off
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="detail-section description-section">
                  <h3 className="section-title">Description</h3>
                  <p className="room-full-description">
                    {selectedRoom.description || 'No description available for this room type.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button 
                  className="action-btn action-btn--update"
                  onClick={() => console.log("Edit room type - to be implemented")}
                >
                  <span className="btn-icon">✏️</span>
                  Edit Room Type
                </button>
                <button 
                  className="action-btn action-btn--status"
                  onClick={() => console.log("Manage availability - to be implemented")}
                >
                  <span className="btn-icon">📅</span>
                  Manage Availability
                </button>
                <button 
                  className="action-btn action-btn--pricing"
                  onClick={() => console.log("Update pricing - to be implemented")}
                >
                  <span className="btn-icon">💰</span>
                  Update Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;