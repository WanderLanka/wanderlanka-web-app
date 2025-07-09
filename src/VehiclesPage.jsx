import { useState, useEffect } from "react";
import api from "./axiosConfig.js"; // Use your existing axios config
import "./VehiclesPage.css";

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    vehicleType: 'car',
    brand: '',
    seats: '',
    ac: true,
    availability: 'available',
    pricingPerKm: '',
    licensePlate: '',
    year: '',
    fuelType: 'Petrol'
  });
  const [updateFormData, setUpdateFormData] = useState({
    seats: '',
    ac: true,
    availability: 'available',
    pricingPerKm: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [updateErrors, setUpdateErrors] = useState({});

  // API call using your existing axios configuration
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
      console.log('Token value:', token);
      
      if (!token) {
        setError('Please log in to view vehicles.');
        setLoading(false);
        return;
      }

      // Debug: Log the request
      console.log('Making request to: /transport/vehicles');
      
      // Use your existing api instance - it will automatically add the Bearer token
      const response = await api.get('/transport/vehicles');
      console.log('Response received:', response.data);
      
      setVehicles(response.data);
      setFilteredVehicles(response.data);
      setError("");
      
    } catch (err) {
      console.error("Full error object:", err);
      console.error("Error response:", err.response);
      setError("Failed to fetch vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter vehicles based on selected type
  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    if (filterType === "all") {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter(vehicle => vehicle.vehicleType === filterType));
    }
  };

  // Handle vehicle removal using your existing axios config
  const handleRemoveVehicle = async (vehicleId) => {
    if (window.confirm("Are you sure you want to remove this vehicle?")) {
      try {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to perform this action.');
          return;
        }

        // Use your existing api instance
        await api.delete(`/transport/vehicles/${vehicleId}`);
        
        // Refresh the vehicles list
        const response = await api.get('/transport/vehicles');
        setVehicles(response.data);
        
        // Update filtered vehicles
        if (selectedFilter === "all") {
          setFilteredVehicles(response.data);
        } else {
          setFilteredVehicles(response.data.filter(vehicle => vehicle.vehicleType === selectedFilter));
        }
        
      } catch (err) {
        // Your axios config already handles 401 errors and redirects to /auth
        if (err.response?.status === 403) {
          setError("You don't have permission to delete this vehicle.");
        } else if (err.response?.status === 404) {
          setError("Vehicle not found.");
        } else {
          setError("Failed to remove vehicle. Please try again.");
        }
        console.error("Error removing vehicle:", err);
      }
    }
  };

  // Handle vehicle update
  const handleUpdateVehicle = (vehicleId) => {
    const vehicle = vehicles.find(v => (v._id || v.id) === vehicleId);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setUpdateFormData({
        seats: vehicle.seats.toString(),
        ac: vehicle.ac,
        availability: vehicle.availability,
        pricingPerKm: vehicle.pricingPerKm.toString()
      });
      setShowUpdateModal(true);
    }
  };

  // Handle update form input changes
  const handleUpdateFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (updateErrors[name]) {
      setUpdateErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate update form
  const validateUpdateForm = () => {
    const errors = {};

    if (!updateFormData.seats || updateFormData.seats < 1 || updateFormData.seats > 100) {
      errors.seats = 'Seats must be between 1 and 100';
    }

    if (!updateFormData.pricingPerKm || updateFormData.pricingPerKm < 0) {
      errors.pricingPerKm = 'Pricing per km must be a positive number';
    }

    setUpdateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle update vehicle submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateUpdateForm()) {
      return;
    }

    setUpdateLoading(true);

    try {
      // API call to update vehicle
      const response = await api.put(`/transport/updatevehicles/${selectedVehicle._id || selectedVehicle.id}`, {
        seats: parseInt(updateFormData.seats),
        ac: updateFormData.ac,
        availability: updateFormData.availability,
        pricingPerKm: parseFloat(updateFormData.pricingPerKm)
      });

      if (response.status === 200) {
        console.log("Vehicle updated successfully:", response.data);
        setShowUpdateModal(false);
        setSelectedVehicle(null);
        setUpdateFormData({
          seats: '',
          ac: true,
          availability: 'available',
          pricingPerKm: ''
        });
        setUpdateErrors({});
        
        // Refresh vehicles list
        const vehiclesResponse = await api.get('/transport/vehicles');
        setVehicles(vehiclesResponse.data);
        
        // Update filtered vehicles
        if (selectedFilter === "all") {
          setFilteredVehicles(vehiclesResponse.data);
        } else {
          setFilteredVehicles(vehiclesResponse.data.filter(vehicle => vehicle.vehicleType === selectedFilter));
        }
        
        setError('');
      } else {
        console.error("Failed to update vehicle:", response.data);
        setError("Failed to update vehicle. Please try again.");
      }
    } catch (err) {
      console.error("Error updating vehicle:", err);
      if (err.response?.status === 400) {
        setError("Invalid data. Please check your input.");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("Vehicle not found.");
      } else {
        setError("Failed to update vehicle. Please try again.");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedVehicle(null);
    setUpdateErrors({});
    setUpdateFormData({
      seats: '',
      ac: true,
      availability: 'available',
      pricingPerKm: ''
    });
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!formData.brand.trim()) {
      errors.brand = 'Brand is required';
    }

    if (!formData.seats || formData.seats < 1 || formData.seats > 100) {
      errors.seats = 'Seats must be between 1 and 100';
    }

    if (!formData.pricingPerKm || formData.pricingPerKm < 0) {
      errors.pricingPerKm = 'Pricing per km must be a positive number';
    }

    if (!formData.licensePlate.trim()) {
      errors.licensePlate = 'License plate is required';
    } else if (!/^[A-Z0-9-]+$/i.test(formData.licensePlate)) {
      errors.licensePlate = 'License plate can only contain letters, numbers, and hyphens';
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add vehicle form submission
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setAddLoading(true);

    try {
      // Dummy API call - replace with your actual endpoint
      /*
      const response = await api.post('/transport/vehicles', {
        ...formData,
        seats: parseInt(formData.seats),
        pricingPerKm: parseFloat(formData.pricingPerKm),
        year: parseInt(formData.year)
      });
      */

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      const newVehicle = {
        _id: Date.now().toString(),
        ...formData,
        seats: parseInt(formData.seats),
        pricingPerKm: parseFloat(formData.pricingPerKm),
        year: parseInt(formData.year),
        userId: 'currentUser'
      };

      // Update local state (remove when using real API)
      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      
      // Update filtered vehicles
      if (selectedFilter === "all" || selectedFilter === formData.vehicleType) {
        setFilteredVehicles(prev => [...prev, newVehicle]);
      }

      // Reset form and close modal
      setFormData({
        vehicleType: 'car',
        brand: '',
        seats: '',
        ac: true,
        availability: 'available',
        pricingPerKm: '',
        licensePlate: '',
        year: '',
        fuelType: 'Petrol'
      });
      setShowAddModal(false);
      setError('');

    } catch (err) {
      console.error('Error adding vehicle:', err);
      setError('Failed to add vehicle. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowAddModal(false);
    setFormErrors({});
    setFormData({
      vehicleType: 'car',
      brand: '',
      seats: '',
      ac: true,
      availability: 'available',
      pricingPerKm: '',
      licensePlate: '',
      year: '',
      fuelType: 'Petrol'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (availability) => {
    switch (availability) {
      case "available":
        return "status-badge status-badge--available";
      case "unavailable":
        return "status-badge status-badge--unavailable";
      case "maintenance":
        return "status-badge status-badge--maintenance";
      default:
        return "status-badge";
    }
  };

  // Get vehicle type icon
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case "car":
        return "🚗";
      case "van":
        return "🚐";
      case "bus":
        return "🚌";
      default:
        return "🚗";
    }
  };

  // useEffect to fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) {
    return (
      <div className="vehicles-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicles-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Fleet Management</h1>
            <p className="page-subtitle">
              Manage your vehicle fleet, track availability, and monitor performance
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{vehicles.length}</span>
              <span className="stat-label">Total Vehicles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {vehicles.filter(v => v.availability === "available").length}
              </span>
              <span className="stat-label">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-container">
          <div className="filter-left">
            <label className="filter-label">Filter by Vehicle Type:</label>
            <select 
              className="filter-dropdown"
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Vehicles</option>
              <option value="car">Cars</option>
              <option value="van">Vans</option>
              <option value="bus">Buses</option>
            </select>
            <div className="results-count">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
            </div>
          </div>
          <div className="filter-right">
            <button 
              className="add-vehicle-btn"
              onClick={() => setShowAddModal(true)}
            >
              <span className="btn-icon">➕</span>
              Add Vehicle
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

      {/* Vehicles Grid */}
      <div className="vehicles-container">
        {filteredVehicles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚗</div>
            <h3 className="empty-title">No vehicles found</h3>
            <p className="empty-description">
              {selectedFilter === "all" 
                ? "No vehicles are currently registered in your fleet."
                : `No ${selectedFilter}s found in your fleet.`
              }
            </p>
          </div>
        ) : (
          <div className="vehicles-grid">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle._id || vehicle.id} className="vehicle-card">
                {/* Card Header */}
                <div className="card-header">
                  <div className="vehicle-type">
                    <span className="vehicle-icon">{getVehicleIcon(vehicle.vehicleType)}</span>
                    <span className="vehicle-type-text">
                      {vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1)}
                    </span>
                  </div>
                  <div className={getStatusBadgeClass(vehicle.availability)}>
                    {vehicle.availability.charAt(0).toUpperCase() + vehicle.availability.slice(1)}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="vehicle-info">
                  <h3 className="vehicle-brand">{vehicle.brand}</h3>
                  <div className="vehicle-details">
                    <div className="detail-row">
                      <span className="detail-label">License Plate:</span>
                      <span className="detail-value">{vehicle.licensePlate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Year:</span>
                      <span className="detail-value">{vehicle.year}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Seats:</span>
                      <span className="detail-value">{vehicle.seats} passengers</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Air Conditioning:</span>
                      <span className={`detail-value ${vehicle.ac ? 'text-success' : 'text-warning'}`}>
                        {vehicle.ac ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fuel Type:</span>
                      <span className="detail-value">{vehicle.fuelType}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="pricing-section">
                  <div className="price-label">Rate per Kilometer</div>
                  <div className="price-value">LKR {vehicle.pricingPerKm.toFixed(2)}</div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions">
                  <button 
                    className="action-btn action-btn--update"
                    onClick={() => handleUpdateVehicle(vehicle._id || vehicle.id)}
                  >
                    <span className="btn-icon">✏️</span>
                    Update
                  </button>
                  <button 
                    className="action-btn action-btn--remove"
                    onClick={() => handleRemoveVehicle(vehicle._id || vehicle.id)}
                  >
                    <span className="btn-icon">🗑️</span>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Vehicle</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleAddVehicle} className="vehicle-form">
              <div className="form-grid">
                {/* Vehicle Type */}
                <div className="form-group">
                  <label className="form-label">Vehicle Type *</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  >
                    <option value="car">🚗 Car</option>
                    <option value="van">🚐 Van</option>
                    <option value="bus">🚌 Bus</option>
                  </select>
                </div>

                {/* Brand */}
                <div className="form-group">
                  <label className="form-label">Brand & Model *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.brand ? 'error' : ''}`}
                    placeholder="e.g., Toyota Corolla"
                    required
                  />
                  {formErrors.brand && <span className="error-text">{formErrors.brand}</span>}
                </div>

                {/* Seats */}
                <div className="form-group">
                  <label className="form-label">Number of Seats *</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.seats ? 'error' : ''}`}
                    placeholder="e.g., 5"
                    min="1"
                    max="100"
                    required
                  />
                  {formErrors.seats && <span className="error-text">{formErrors.seats}</span>}
                </div>

                {/* License Plate */}
                <div className="form-group">
                  <label className="form-label">License Plate *</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.licensePlate ? 'error' : ''}`}
                    placeholder="e.g., ABC-1234"
                    style={{ textTransform: 'uppercase' }}
                    required
                  />
                  {formErrors.licensePlate && <span className="error-text">{formErrors.licensePlate}</span>}
                </div>

                {/* Year */}
                <div className="form-group">
                  <label className="form-label">Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.year ? 'error' : ''}`}
                    placeholder="e.g., 2022"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                  />
                  {formErrors.year && <span className="error-text">{formErrors.year}</span>}
                </div>

                {/* Fuel Type */}
                <div className="form-group">
                  <label className="form-label">Fuel Type *</label>
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleFormChange}
                    className="form-input"
                    required
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Pricing Per Km */}
                <div className="form-group">
                  <label className="form-label">Pricing per Kilometer (LKR) *</label>
                  <input
                    type="number"
                    name="pricingPerKm"
                    value={formData.pricingPerKm}
                    onChange={handleFormChange}
                    className={`form-input ${formErrors.pricingPerKm ? 'error' : ''}`}
                    placeholder="e.g., 25.50"
                    step="0.01"
                    min="0"
                    required
                  />
                  {formErrors.pricingPerKm && <span className="error-text">{formErrors.pricingPerKm}</span>}
                </div>

                {/* Availability */}
                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleFormChange}
                    className="form-input"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Air Conditioning Checkbox */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="ac"
                    checked={formData.ac}
                    onChange={handleFormChange}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">Air Conditioning Available</span>
                </label>
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
                      Adding Vehicle...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      Add Vehicle
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Vehicle Modal */}
      {showUpdateModal && selectedVehicle && (
        <div className="modal-overlay" onClick={closeUpdateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Vehicle - {selectedVehicle.brand}</h2>
              <button className="modal-close" onClick={closeUpdateModal}>✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="vehicle-form">
              {/* Vehicle Info Display */}
              <div className="vehicle-info-display">
                <div className="info-row">
                  <span className="info-label">License Plate:</span>
                  <span className="info-value">{selectedVehicle.licensePlate}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Brand & Model:</span>
                  <span className="info-value">{selectedVehicle.brand}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Vehicle Type:</span>
                  <span className="info-value">{selectedVehicle.vehicleType.charAt(0).toUpperCase() + selectedVehicle.vehicleType.slice(1)}</span>
                </div>
              </div>

              <div className="form-grid update-form-grid">
                {/* Seats */}
                <div className="form-group">
                  <label className="form-label">Number of Seats *</label>
                  <input
                    type="number"
                    name="seats"
                    value={updateFormData.seats}
                    onChange={handleUpdateFormChange}
                    className={`form-input ${updateErrors.seats ? 'error' : ''}`}
                    placeholder="e.g., 5"
                    min="1"
                    max="100"
                    required
                  />
                  {updateErrors.seats && <span className="error-text">{updateErrors.seats}</span>}
                </div>

                {/* Pricing Per Km */}
                <div className="form-group">
                  <label className="form-label">Pricing per Kilometer (LKR) *</label>
                  <input
                    type="number"
                    name="pricingPerKm"
                    value={updateFormData.pricingPerKm}
                    onChange={handleUpdateFormChange}
                    className={`form-input ${updateErrors.pricingPerKm ? 'error' : ''}`}
                    placeholder="e.g., 25.50"
                    step="0.01"
                    min="0"
                    required
                  />
                  {updateErrors.pricingPerKm && <span className="error-text">{updateErrors.pricingPerKm}</span>}
                </div>

                {/* Availability */}
                <div className="form-group">
                  <label className="form-label">Availability Status</label>
                  <select
                    name="availability"
                    value={updateFormData.availability}
                    onChange={handleUpdateFormChange}
                    className="form-input"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Air Conditioning Checkbox */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="ac"
                    checked={updateFormData.ac}
                    onChange={handleUpdateFormChange}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">Air Conditioning Available</span>
                </label>
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
                      Updating Vehicle...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      Update Vehicle
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
};

export default VehiclesPage;