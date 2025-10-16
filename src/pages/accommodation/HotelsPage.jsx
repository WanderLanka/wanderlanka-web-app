import { useState, useEffect } from "react";
import api from "../../services/axiosConfig.js";
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
      await api.put(`/accommodation/updatehotel/${selectedHotel._id || selectedHotel.id}`, {
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
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800";
      case "inactive":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800";
      case "under_maintenance":
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800";
      default:
        return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mb-4"></div>
            <p className="text-lg font-medium text-slate-600">Loading hotels...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Hotel Management</h1>
              <p className="text-lg text-slate-300">
                Manage your accommodation properties, track availability, and monitor performance
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-400">{hotels.length}</div>
                <div className="text-sm font-medium text-slate-200">Total Hotels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {hotels.filter(h => h.status === "active").length}
                </div>
                <div className="text-sm font-medium text-slate-200">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-sm font-medium text-slate-700">Filter by Hotel Type:</label>
              <select 
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white text-slate-900"
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="all">All Hotels</option>
                <option value="hotel">Hotels</option>
                <option value="resort">Resorts</option>
                <option value="guesthouse">Guesthouses</option>
                <option value="homestay">Homestays</option>
              </select>
              <div className="text-sm text-slate-500">
                {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
              </div>
            </div>
            <button 
              className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              onClick={() => setShowAddModal(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Hotel
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredHotels.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No hotels found</h3>
            <p className="text-slate-600">
              {selectedFilter === "all" 
                ? "No hotels are currently registered in your system."
                : `No ${selectedFilter}s found in your system.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHotels.map((hotel) => (
              <div key={hotel._id || hotel.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getAccommodationIcon(hotel.accommodationType)}</span>
                      <span className="text-sm font-medium text-slate-600 capitalize">
                        {hotel.accommodationType}
                      </span>
                    </div>
                    <div className={getStatusBadgeClass(hotel.status)}>
                      {hotel.status ? hotel.status.charAt(0).toUpperCase() + hotel.status.slice(1) : 'Unknown'}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-4 line-clamp-2">{hotel.name}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="text-slate-900 font-medium text-right">{hotel.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Star Rating:</span>
                      <span className="text-slate-900">{formatStarRating(hotel.starRating)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Rooms:</span>
                      <span className="text-slate-900 font-medium">{hotel.totalRooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="text-slate-900 font-medium">{hotel.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Check-in:</span>
                      <span className="text-slate-900 font-medium">{hotel.checkInTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Check-out:</span>
                      <span className="text-slate-900 font-medium">{hotel.checkOutTime}</span>
                    </div>
                  </div>
                </div>

                {/* Hotel Stats */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{hotel.totalRooms}</div>
                      <div className="text-xs text-slate-500">Rooms</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-slate-900">{hotel.starRating}</div>
                      <div className="text-xs text-slate-500">Stars</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 grid grid-cols-2 gap-2">
                  <button 
                    className="flex items-center justify-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => handleViewHotelDetails(hotel._id || hotel.id)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button 
                    className="flex items-center justify-center px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => handleUpdateHotel(hotel._id || hotel.id)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add New Hotel</h2>
              <button className="text-slate-400 hover:text-slate-600" onClick={closeModal}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddHotel} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hotel Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hotel Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${formErrors.name ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="e.g., Grand Hotel Kandy"
                    required
                  />
                  {formErrors.name && <span className="text-red-500 text-sm mt-1">{formErrors.name}</span>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${formErrors.location ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="e.g., Kandy, Sri Lanka"
                    required
                  />
                  {formErrors.location && <span className="text-red-500 text-sm mt-1">{formErrors.location}</span>}
                </div>

                {/* Accommodation Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Accommodation Type *</label>
                  <select
                    name="accommodationType"
                    value={formData.accommodationType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="hotel">🏨 Hotel</option>
                    <option value="resort">🏖️ Resort</option>
                    <option value="guesthouse">🏠 Guesthouse</option>
                    <option value="homestay">🏡 Homestay</option>
                  </select>
                </div>

                {/* Total Rooms */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Rooms *</label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${formErrors.totalRooms ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="e.g., 50"
                    min="1"
                    required
                  />
                  {formErrors.totalRooms && <span className="text-red-500 text-sm mt-1">{formErrors.totalRooms}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${formErrors.phone ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="e.g., +94 81 223 4567"
                    required
                  />
                  {formErrors.phone && <span className="text-red-500 text-sm mt-1">{formErrors.phone}</span>}
                </div>

                {/* Check-in Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Time</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Check-out Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Time</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
                  disabled={addLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={addLoading}
                >
                  {addLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Adding Hotel...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeUpdateModal}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Update Hotel: {selectedHotel.name}</h2>
              <button className="text-slate-400 hover:text-slate-600" onClick={closeUpdateModal}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hotel Info (Read Only) */}
                <div className="md:col-span-2 bg-slate-50 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Hotel Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Name:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedHotel.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Location:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedHotel.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Type:</span>
                      <span className="ml-2 font-medium text-slate-900 capitalize">{selectedHotel.accommodationType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Star Rating:</span>
                      <span className="ml-2 font-medium text-slate-900">{selectedHotel.starRating} ⭐</span>
                    </div>
                  </div>
                </div>

                {/* Total Rooms */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Rooms *</label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={updateFormData.totalRooms}
                    onChange={handleUpdateFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${updateErrors.totalRooms ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="e.g., 50"
                    min="1"
                    required
                  />
                  {updateErrors.totalRooms && <span className="text-red-500 text-sm mt-1">{updateErrors.totalRooms}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={updateFormData.phone}
                    onChange={handleUpdateFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${updateErrors.phone ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="e.g., +94 81 223 4567"
                    required
                  />
                  {updateErrors.phone && <span className="text-red-500 text-sm mt-1">{updateErrors.phone}</span>}
                </div>

                {/* Check-in Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Time</label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={updateFormData.checkInTime}
                    onChange={handleUpdateFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Check-out Time */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Time</label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={updateFormData.checkOutTime}
                    onChange={handleUpdateFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={updateFormData.status}
                    onChange={handleUpdateFormChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="under_maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Updating Hotel...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
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
};

export default HotelsPage;  