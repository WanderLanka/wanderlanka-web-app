import { useState, useEffect } from "react";
import api from "../services/axiosConfig.js";
// import "../styles/HotelsPage.css"; // Converted to Tailwind CSS
import { Navigate, useNavigate } from "react-router-dom";

const HotelsPage = () => {
  const Navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  // Form data for adding new hotel
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    accommodationType: 'hotel',
    totalRooms: '',
    phone: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    status: 'active'
  });
  
  // Form data for updating hotel
  const [updateFormData, setUpdateFormData] = useState({
    totalRooms: '',
    phone: '',
    checkInTime: '',
    checkOutTime: '',
    status: 'active'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [updateErrors, setUpdateErrors] = useState({});

  // API call using your existing axios configuration
  const fetchHotels = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        setError('Please log in to view hotels.');
        setLoading(false);
        return;
      }

      console.log('Making request to: /accommodation/places');
      
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

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle update form input changes
  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (updateErrors[name]) {
      setUpdateErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Hotel name is required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.totalRooms || formData.totalRooms < 1) {
      errors.totalRooms = 'Total rooms must be at least 1';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9-+().\s]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate update form
  const validateUpdateForm = () => {
    const errors = {};

    if (!updateFormData.totalRooms || updateFormData.totalRooms < 1) {
      errors.totalRooms = 'Total rooms must be at least 1';
    }

    if (!updateFormData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9-+().\s]+$/.test(updateFormData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setUpdateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add hotel form submission
  const handleAddHotel = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setAddLoading(true);
    try {
      const response = await api.post('/accommodation/addhotels', {
        ...formData,
        totalRooms: parseInt(formData.totalRooms)
      });
      if (response.status !== 201) {  
        throw new Error('Failed to add hotel');
      }
      // Reset form and close modal
      setFormData({
        name: '',
        location: '',
        accommodationType: 'hotel',
        totalRooms: '',
        phone: '',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        status: 'active'
      });
      setShowAddModal(false);
      setError('');
      // Re-fetch hotels to update the list
      await fetchHotels();
    } catch (err) {
      console.error('Error adding hotel:', err);
      setError('Failed to add hotel. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle update hotel
  const handleUpdateHotel = (hotelId) => {
    const hotel = hotels.find(h => (h._id || h.id) === hotelId);
    if (hotel) {
      setSelectedHotel(hotel);
      setUpdateFormData({
        totalRooms: hotel.totalRooms.toString(),
        phone: hotel.phone,
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        status: hotel.status || 'active'
      });
      setShowUpdateModal(true);
    }
  };

  // Handle update hotel submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateUpdateForm()) {
      return;
    }
    setUpdateLoading(true);
    try {
      const response = await api.put(`/accommodation/updatehotel/${selectedHotel._id || selectedHotel.id}`, {
        totalRooms: parseInt(updateFormData.totalRooms),
        phone: updateFormData.phone,
        checkInTime: updateFormData.checkInTime,
        checkOutTime: updateFormData.checkOutTime,
        status: updateFormData.status
      });
      // Re-fetch hotels to update the list
      await fetchHotels();
      setShowUpdateModal(false);
      setSelectedHotel(null);
      setUpdateFormData({
        totalRooms: '',
        phone: '',
        checkInTime: '',
        checkOutTime: '',
        status: 'active'
      });
      setUpdateErrors({});
      setError('');
    } catch (err) {
      console.error("Error updating hotel:", err);
      setError("Failed to update hotel. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };
  

  // Close modal
  const closeModal = () => {
    setShowAddModal(false);
    setFormErrors({});
    setFormData({
      name: '',
      location: '',
      accommodationType: 'hotel',
      totalRooms: '',
      phone: '',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      status: 'active'
    });
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedHotel(null);
    setUpdateErrors({});
    setUpdateFormData({
      totalRooms: '',
      phone: '',
      checkInTime: '',
      checkOutTime: '',
      status: 'active'
    });
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
              onClick={() => setShowAddModal(true)}
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
                    onClick={() => handleUpdateHotel(hotel._id || hotel.id)}
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

      {/* Add Hotel Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Hotel</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleAddHotel} className="hotel-form">
              <div className="form-grid">
                {/* Hotel Name */}
                <div className="form-group">
                  <label className="form-label">Hotel Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                    placeholder="e.g., Grand Hotel Kandy"
                    required
                  />
                  {formErrors.name && <span className="error-text">{formErrors.name}</span>}
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.location ? 'error' : ''}`}
                    placeholder="e.g., Kandy, Sri Lanka"
                    required
                  />
                  {formErrors.location && <span className="error-text">{formErrors.location}</span>}
                </div>

                {/* Accommodation Type */}
                <div className="form-group">
                  <label className="form-label">Accommodation Type *</label>
                  <select
                    name="accommodationType"
                    value={formData.accommodationType}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  >
                    <option value="hotel">🏨 Hotel</option>
                    <option value="resort">🏖️ Resort</option>
                    <option value="guesthouse">🏠 Guesthouse</option>
                    <option value="homestay">🏡 Homestay</option>
                  </select>
                </div>

                {/* Total Rooms */}
                <div className="form-group">
                  <label className="form-label">Total Rooms *</label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.totalRooms ? 'error' : ''}`}
                    placeholder="e.g., 50"
                    min="1"
                    required
                  />
                  {formErrors.totalRooms && <span className="error-text">{formErrors.totalRooms}</span>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.phone ? 'error' : ''}`}
                    placeholder="e.g., +94 81 223 4567"
                    required
                  />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>

                {/* Check-in Time */}
                <div className="form-group">
                  <label className="form-label">Check-in Time</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

                {/* Check-out Time */}
                <div className="form-group">
                  <label className="form-label">Check-out Time</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="form-input"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={closeModal}
                  className="form-btn form-btn--cancel"
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-btn form-btn--submit"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Adding Hotel...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      Add Hotel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Hotel Modal */}
      {showUpdateModal && selectedHotel && (
        <div className="modal-overlay" onClick={closeUpdateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Hotel - {selectedHotel.name}</h2>
              <button className="modal-close" onClick={closeUpdateModal}>✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="hotel-form">
              {/* Hotel Info Display */}
              <div className="hotel-info-display">
                <div className="info-row">
                  <span className="info-label">Hotel Name:</span>
                  <span className="info-value">{selectedHotel.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{selectedHotel.location}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{selectedHotel.accommodationType.charAt(0).toUpperCase() + selectedHotel.accommodationType.slice(1)}</span>
                </div>
              </div>

              <div className="form-grid update-form-grid">
                {/* Total Rooms */}
                <div className="form-group">
                  <label className="form-label">Total Rooms *</label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={updateFormData.totalRooms}
                    onChange={handleUpdateFormChange}
                    className={`form-input ${updateErrors.totalRooms ? 'error' : ''}`}
                    placeholder="e.g., 50"
                    min="1"
                    required
                  />
                  {updateErrors.totalRooms && <span className="error-text">{updateErrors.totalRooms}</span>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={updateFormData.phone}
                    onChange={handleUpdateFormChange}
                    className={`form-input ${updateErrors.phone ? 'error' : ''}`}
                    placeholder="e.g., +94 81 223 4567"
                    required
                  />
                  {updateErrors.phone && <span className="error-text">{updateErrors.phone}</span>}
                </div>

                {/* Check-in Time */}
                <div className="form-group">
                  <label className="form-label">Check-in Time</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={updateFormData.checkInTime}
                    onChange={handleUpdateFormChange}
                    className="form-input"
                  />
                </div>

                {/* Check-out Time */}
                <div className="form-group">
                  <label className="form-label">Check-out Time</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={updateFormData.checkOutTime}
                    onChange={handleUpdateFormChange}
                    className="form-input"
                  />
                </div>

                {/* Status */}
                <div className="form-group full-width">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={updateFormData.status}
                    onChange={handleUpdateFormChange}
                    className="form-input"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="form-btn form-btn--cancel"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-btn form-btn--submit"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Updating Hotel...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      Update Hotel
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default HotelsPage;