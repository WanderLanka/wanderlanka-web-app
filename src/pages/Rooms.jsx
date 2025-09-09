import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axiosConfig.js"; // Use your existing axios config
import "../styles/Rooms.css";

const RoomsPage = () => {
  const navigate=useNavigate();
  const { hotelid } = useParams();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  
  // Add Room Modal State
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [addRoomLoading, setAddRoomLoading] = useState(false);
  const [addRoomForm, setAddRoomForm] = useState({
    roomcount: '',
    availableroomcount: '',
    type: 'luxury',
    isAC: false,
    maxOccupancy: '',
    isPetsAllowed: false,
    pricePerNight: '',
    pricePerDay: '',
    description: '',
    images: ['']
  });
  const [addRoomErrors, setAddRoomErrors] = useState({});

  // Update Room Modal State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    roomcount: '',
    availableroomcount: '',
    type: '',
    isAC: false,
    maxOccupancy: '',
    isPetsAllowed: false,
    pricePerNight: '',
    pricePerDay: ''
  });
  const [updateErrors, setUpdateErrors] = useState({});

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

  // Handle room image click (separate from card click)
  const handleRoomImageClick = (room, e) => {
    e.stopPropagation(); // Prevent card click event
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  // Handle update details button click
  const handleUpdateDetails = () => {
    // Pre-fill form with existing room data
    setUpdateForm({
      roomcount: selectedRoom?.roomcount || '',
      availableroomcount: selectedRoom?.availableroomcount || '',
      type: selectedRoom?.type || '',
      isAC: selectedRoom?.isAC || false,
      maxOccupancy: selectedRoom?.maxOccupancy || '',
      isPetsAllowed: selectedRoom?.isPetsAllowed || false,
      pricePerNight: selectedRoom?.pricePerNight || '',
      pricePerDay: selectedRoom?.pricePerDay || ''
    });
    setUpdateErrors({});
    setShowRoomModal(false);
    setShowUpdateModal(true);
  };

  // Handle update form input changes
  const handleUpdateInput = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (updateErrors[name]) {
      setUpdateErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate update form
  const validateUpdateForm = () => {
    const errors = {};
    if (!updateForm.roomcount || updateForm.roomcount < 1) errors.roomcount = 'Required';
    if (!updateForm.availableroomcount || updateForm.availableroomcount < 0) errors.availableroomcount = 'Required';
    if (!updateForm.type) errors.type = 'Required';
    if (!updateForm.maxOccupancy || updateForm.maxOccupancy < 1) errors.maxOccupancy = 'Required';
    if (!updateForm.pricePerNight || updateForm.pricePerNight < 1) errors.pricePerNight = 'Required';
    if (!updateForm.pricePerDay || updateForm.pricePerDay < 1) errors.pricePerDay = 'Required';
    setUpdateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle update form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateUpdateForm()) return;
    
    setUpdateLoading(true);
    
    try {
      // Dummy API call - replace with your actual API endpoint
      const response = await api.put(`accommodation/updateroom/${selectedRoom._id}`, {
        ...updateForm,
        roomcount: parseInt(updateForm.roomcount),
        availableroomcount: parseInt(updateForm.availableroomcount),
        maxOccupancy: parseInt(updateForm.maxOccupancy),
        pricePerDay: parseInt(updateForm.pricePerDay),
        pricePerNight: parseInt(updateForm.pricePerNight),
        isAC: Boolean(updateForm.isAC),
        isPetsAllowed: Boolean(updateForm.isPetsAllowed)
      });
      
      console.log('Room updated successfully:', response.data);
      
      // Close modal and refresh data
      closeUpdateModal();
      await fetchRooms();
      
      // Show success message
      alert('Room details updated successfully!');
    } catch (err) {
      console.error('Error updating room:', err);
      setUpdateErrors({ form: 'Failed to update room. Please try again.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateErrors({});
    setSelectedRoom(null);
  };

  // Add Room Modal Handlers
  const openAddRoomModal = () => {
    setAddRoomForm({
      roomcount: '',
      availableroomcount: '',
      type: 'luxury',
      isAC: false,
      maxOccupancy: '',
      isPetsAllowed: false,
      pricePerNight: '',
      pricePerDay: '',
      description: '',
      images: ['']
    });
    setAddRoomErrors({});
    setShowAddRoomModal(true);
  };
  const closeAddRoomModal = () => {
    setShowAddRoomModal(false);
    setAddRoomErrors({});
  };
  const handleAddRoomInput = (e) => {
    const { name, value, type, checked } = e.target;
    setAddRoomForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (addRoomErrors[name]) {
      setAddRoomErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  // Only allow one image URL for now
  const handleAddRoomImage = (e) => {
    setAddRoomForm(prev => ({ ...prev, images: [e.target.value] }));
    if (addRoomErrors.images) {
      setAddRoomErrors(prev => ({ ...prev, images: '' }));
    }
  };
  // Validate add room form
  const validateAddRoomForm = () => {
    const errors = {};
    if (!addRoomForm.roomcount || addRoomForm.roomcount < 1) errors.roomcount = 'Required';
    if (!addRoomForm.availableroomcount || addRoomForm.availableroomcount < 0) errors.availableroomcount = 'Required';
    if (!addRoomForm.type) errors.type = 'Required';
    if (!addRoomForm.maxOccupancy || addRoomForm.maxOccupancy < 1) errors.maxOccupancy = 'Required';
    if (!addRoomForm.pricePerNight || addRoomForm.pricePerNight < 1) errors.pricePerNight = 'Required';
    if (!addRoomForm.pricePerDay || addRoomForm.pricePerDay < 1) errors.pricePerDay = 'Required';
    setAddRoomErrors(errors);
    return Object.keys(errors).length === 0;
  };
  // Dummy API call for add room
  // Fixed handleAddRoomSubmit function
const handleAddRoomSubmit = async (e) => {
  e.preventDefault();
  if (!validateAddRoomForm()) return;
  
  setAddRoomLoading(true);
  
  try {
    const response = await api.post('/accommodation/addrooms', {
      ...addRoomForm,
      roomcount: parseInt(addRoomForm.roomcount),
      availableroomcount: parseInt(addRoomForm.availableroomcount), 
      maxOccupancy: parseInt(addRoomForm.maxOccupancy),
      pricePerDay: parseInt(addRoomForm.pricePerDay),
      pricePerNight: parseInt(addRoomForm.pricePerNight), // Fixed typo
      isAC: Boolean(addRoomForm.isAC),
      isPetsAllowed: Boolean(addRoomForm.isPetsAllowed),
      hotel: hotelid
    });
    
    if (response.status === 201) {
      // Close modal first
      closeAddRoomModal();
      setError('');
      
      // Refresh the rooms data from the API
      await fetchRooms();
      
      // Optional: Show success message
      // setSuccessMessage('Room type added successfully!');
    } else {
      throw new Error('Failed to add room');
    }
  } catch (err) {
    console.error('Error adding room:', err);
    setAddRoomErrors({ form: 'Failed to add room. Please try again.' });
  } finally {
    setAddRoomLoading(false);
  }
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
              onClick={openAddRoomModal}
            >
              <span className="btn-icon">➕</span>
              Add Room Type
            </button>
      {/* Add Room Modal */}
      {showAddRoomModal && (
        <div className="modal-overlay" onClick={closeAddRoomModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add Room Type</h2>
              <button className="modal-close" onClick={closeAddRoomModal}>✕</button>
            </div>
            <form className="room-form" onSubmit={handleAddRoomSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Room Count *</label>
                  <input type="number" name="roomcount" min="1" value={addRoomForm.roomcount} onChange={handleAddRoomInput} required className={addRoomErrors.roomcount ? 'error' : ''} />
                  {addRoomErrors.roomcount && <span className="error-text">{addRoomErrors.roomcount}</span>}
                </div>
                <div className="form-group">
                  <label>Available Room Count *</label>
                  <input type="number" name="availableroomcount" min="0" value={addRoomForm.availableroomcount} onChange={handleAddRoomInput} required className={addRoomErrors.availableroomcount ? 'error' : ''} />
                  {addRoomErrors.availableroomcount && <span className="error-text">{addRoomErrors.availableroomcount}</span>}
                </div>
                <div className="form-group">
                  <label>Room Type *</label>
                  <select name="type" value={addRoomForm.type} onChange={handleAddRoomInput} required className={addRoomErrors.type ? 'error' : ''}>
                    <option value="luxury">Luxury</option>
                    <option value="standard">Standard</option>
                  </select>
                  {addRoomErrors.type && <span className="error-text">{addRoomErrors.type}</span>}
                </div>
                <div className="form-group">
                  <label>AC</label>
                  <input type="checkbox" name="isAC" checked={addRoomForm.isAC} onChange={handleAddRoomInput} />
                </div>
                <div className="form-group">
                  <label>Max Occupancy *</label>
                  <input type="number" name="maxOccupancy" min="1" value={addRoomForm.maxOccupancy} onChange={handleAddRoomInput} required className={addRoomErrors.maxOccupancy ? 'error' : ''} />
                  {addRoomErrors.maxOccupancy && <span className="error-text">{addRoomErrors.maxOccupancy}</span>}
                </div>
                <div className="form-group">
                  <label>Pet Friendly</label>
                  <input type="checkbox" name="isPetsAllowed" checked={addRoomForm.isPetsAllowed} onChange={handleAddRoomInput} />
                </div>
                <div className="form-group">
                  <label>Price Per Night *</label>
                  <input type="number" name="pricePerNight" min="1" value={addRoomForm.pricePerNight} onChange={handleAddRoomInput} required className={addRoomErrors.pricePerNight ? 'error' : ''} />
                  {addRoomErrors.pricePerNight && <span className="error-text">{addRoomErrors.pricePerNight}</span>}
                </div>
                <div className="form-group">
                  <label>Price Per Day *</label>
                  <input type="number" name="pricePerDay" min="1" value={addRoomForm.pricePerDay} onChange={handleAddRoomInput} required className={addRoomErrors.pricePerDay ? 'error' : ''} />
                  {addRoomErrors.pricePerDay && <span className="error-text">{addRoomErrors.pricePerDay}</span>}
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea name="description" value={addRoomForm.description} onChange={handleAddRoomInput} />
                </div>
                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input type="text" name="images" value={addRoomForm.images[0]} onChange={handleAddRoomImage} placeholder="https://..." />
                  {addRoomErrors.images && <span className="error-text">{addRoomErrors.images}</span>}
                </div>
              </div>
              {addRoomErrors.form && <div className="error-message">{addRoomErrors.form}</div>}
              <div className="form-actions">
                <button type="button" className="form-btn form-btn--cancel" onClick={closeAddRoomModal} disabled={addRoomLoading}>Cancel</button>
                <button type="submit" className="form-btn form-btn--submit" disabled={addRoomLoading}>
                  {addRoomLoading ? 'Adding...' : 'Add Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                      onClick={(e) => handleRoomImageClick(room, e)}
                      style={{ cursor: 'pointer' }}
                      onError={(e) => {
                        const placeholder = 'https://via.placeholder.com/400x250?text=No+Image';
                        if (e.target.src !== placeholder) {
                          e.target.src = placeholder;
                        }
                      }}
                    />
                    <div className="room-overlay">
                      <span className="view-details">Click image for details</span>
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

              {/* Single Action Button */}
              <div className="modal-actions">
                <button 
                  className="action-btn action-btn--update"
                  onClick={handleUpdateDetails}
                >
                  <span className="btn-icon">✏️</span>
                  Update Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Room Modal */}
      {showUpdateModal && selectedRoom && (
        <div className="modal-overlay" onClick={closeUpdateModal}>
          <div className="modal-content update-room-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Room Details</h2>
              <button className="modal-close" onClick={closeUpdateModal}>✕</button>
            </div>
            <form className="room-form" onSubmit={handleUpdateSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Room Count *</label>
                  <input 
                    type="number" 
                    name="roomcount" 
                    min="1" 
                    value={updateForm.roomcount} 
                    onChange={handleUpdateInput} 
                    required 
                    className={updateErrors.roomcount ? 'error' : ''} 
                  />
                  {updateErrors.roomcount && <span className="error-text">{updateErrors.roomcount}</span>}
                </div>
                <div className="form-group">
                  <label>Available Room Count *</label>
                  <input 
                    type="number" 
                    name="availableroomcount" 
                    min="0" 
                    value={updateForm.availableroomcount} 
                    onChange={handleUpdateInput} 
                    required 
                    className={updateErrors.availableroomcount ? 'error' : ''} 
                  />
                  {updateErrors.availableroomcount && <span className="error-text">{updateErrors.availableroomcount}</span>}
                </div>
                <div className="form-group">
                  <label>Room Type *</label>
                  <select 
                    name="type" 
                    value={updateForm.type} 
                    onChange={handleUpdateInput} 
                    required 
                    className={updateErrors.type ? 'error' : ''}
                  >
                    <option value="">Select Type</option>
                    <option value="luxury">Luxury</option>
                    <option value="standard">Standard</option>
                  </select>
                  {updateErrors.type && <span className="error-text">{updateErrors.type}</span>}
                </div>
                <div className="form-group">
                  <label>Max Occupancy *</label>
                  <input 
                    type="number" 
                    name="maxOccupancy" 
                    min="1" 
                    value={updateForm.maxOccupancy} 
                    onChange={handleUpdateInput} 
                    required 
                    className={updateErrors.maxOccupancy ? 'error' : ''} 
                  />
                  {updateErrors.maxOccupancy && <span className="error-text">{updateErrors.maxOccupancy}</span>}
                </div>
                <div className="form-group">
                  <label>Price Per Night (LKR) *</label>
                  <input 
                    type="number" 
                    name="pricePerNight" 
                    min="1" 
                    value={updateForm.pricePerNight} 
                    onChange={handleUpdateInput} 
                    required 
                    className={updateErrors.pricePerNight ? 'error' : ''} 
                  />
                  {updateErrors.pricePerNight && <span className="error-text">{updateErrors.pricePerNight}</span>}
                </div>
                <div className="form-group">
                  <label>Price Per Day (LKR) *</label>
                  <input 
                    type="number" 
                    name="pricePerDay" 
                    min="1" 
                    value={updateForm.pricePerDay} 
                    onChange={handleUpdateInput} 
                    required 
                    className={updateErrors.pricePerDay ? 'error' : ''} 
                  />
                  {updateErrors.pricePerDay && <span className="error-text">{updateErrors.pricePerDay}</span>}
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="isAC" 
                      checked={updateForm.isAC} 
                      onChange={handleUpdateInput} 
                    />
                    Air Conditioning
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="isPetsAllowed" 
                      checked={updateForm.isPetsAllowed} 
                      onChange={handleUpdateInput} 
                    />
                    Pets Allowed
                  </label>
                </div>
              </div>
              {updateErrors.form && <div className="error-message">{updateErrors.form}</div>}
              <div className="form-actions">
                <button 
                  type="button" 
                  className="form-btn form-btn--cancel" 
                  onClick={closeUpdateModal} 
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="form-btn form-btn--submit" 
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Updating...' : 'Update Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;