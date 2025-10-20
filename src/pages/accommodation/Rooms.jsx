import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/axiosConfig.js";

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

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view rooms.');
        setRooms([]);
        setFilteredRooms([]);
        setHotelData(null);
        setLoading(false);
        return;
      }

      const response = await api.get(`/accommodation/hotel/${hotelid}`);

      let hotel = null;
      if (Array.isArray(response.data)) {
        hotel = response.data[0] || null;
      } else if (response.data && response.data.data) {
        hotel = response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        hotel = response.data;
      }
      setHotelData(hotel);

      let roomsData = [];
      if (hotel && Array.isArray(hotel.roomTypes)) {
        roomsData = hotel.roomTypes.map((rt) => ({
          _id: rt._id,
          type: rt.type,
          roomcount: rt.totalRooms,
          availableroomcount: rt.availableRooms,
          pricePerNight: rt.pricePerNight,
          pricePerDay: rt.pricePerNight,
          maxOccupancy: rt.occupancy,
          description: rt.size ? `${rt.size}` : '',
          images: hotel.images || []
        }));
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
  }, [hotelid]);

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
    if (filterType === "all") {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(room => room.type === filterType));
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleRoomImageClick = (room, e) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setShowRoomModal(true);
  };

  const handleUpdateDetails = () => {
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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateUpdateForm()) return;
    
    setUpdateLoading(true);
    
    try {
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
      
      closeUpdateModal();
      await fetchRooms();
      alert('Room details updated successfully!');
    } catch (err) {
      console.error('Error updating room:', err);
      setUpdateErrors({ form: 'Failed to update room. Please try again.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateErrors({});
    setSelectedRoom(null);
  };

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

  const handleAddRoomImage = (e) => {
    setAddRoomForm(prev => ({ ...prev, images: [e.target.value] }));
    if (addRoomErrors.images) {
      setAddRoomErrors(prev => ({ ...prev, images: '' }));
    }
  };

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
        pricePerNight: parseInt(addRoomForm.pricePerNight),
        isAC: Boolean(addRoomForm.isAC),
        isPetsAllowed: Boolean(addRoomForm.isPetsAllowed),
        hotel: hotelid
      });
      
      if (response.status === 201) {
        closeAddRoomModal();
        setError('');
        await fetchRooms();
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

  const closeRoomModal = () => {
    setShowRoomModal(false);
    setSelectedRoom(null);
  };

  const getAvailabilityStatus = (availableCount, totalCount) => {
    if (!totalCount || totalCount === 0) return { status: 'full', text: 'No Rooms' };
    
    const percentage = (availableCount / totalCount) * 100;
    if (percentage === 0) return { status: 'full', text: 'Fully Booked' };
    if (percentage <= 25) return { status: 'low', text: 'Limited Availability' };
    if (percentage <= 50) return { status: 'medium', text: 'Available' };
    return { status: 'high', text: 'Highly Available' };
  };

  const getStatusBadgeClass = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "high":
        return `${base} bg-green-100 text-green-800`;
      case "medium":
        return `${base} bg-blue-100 text-blue-800`;
      case "low":
        return `${base} bg-yellow-100 text-yellow-800`;
      case "full":
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  };

  const getRoomTypeDisplay = (type) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) + " Room" : "Room";
  };

  const getRoomTypeIcon = (type) => {
    return type === 'luxury' ? '👑' : '🛏️';
  };

  const getTotalRooms = () => {
    return rooms.reduce((sum, room) => sum + (room.roomcount || 0), 0);
  };

  const getAvailableRooms = () => {
    return rooms.reduce((sum, room) => sum + (room.availableroomcount || 0), 0);
  };

  useEffect(() => {
    if (hotelid) {
      fetchRooms();
    } else {
      setError("Hotel ID is required");
      setLoading(false);
    }
  }, [hotelid, fetchRooms]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading room types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hotelData?.name ? `${hotelData.name} - Room Types` : 'Room Type Management'}
              </h1>
              <p className="text-gray-600">
                Manage room types, availability, and pricing for your accommodation
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{getTotalRooms()}</div>
                <div className="text-sm text-gray-600">Total Rooms</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{getAvailableRooms()}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-sm font-medium text-gray-700">Filter by Room Type:</label>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="all">All Room Types</option>
                <option value="luxury">Luxury Rooms</option>
                <option value="standard">Standard Rooms</option>
              </select>
              <span className="text-sm text-gray-600">
                {filteredRooms.length} room type{filteredRooms.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredRooms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🛏️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No room types found</h3>
            <p className="text-gray-600">
              {selectedFilter === "all" 
                ? "No room types are currently configured in your system."
                : `No ${selectedFilter} room types found in your system.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room, index) => {
              const availability = getAvailabilityStatus(room.availableroomcount, room.roomcount);
              
              return (
                <div 
                  key={room._id || index} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => handleRoomClick(room)}
                >
                  {/* Room Image */}
                  <div className="relative h-48 overflow-hidden group">
                    <img 
                      src={room.images && room.images[0] ? room.images[0] : 'https://via.placeholder.com/400x250?text=No+Image'} 
                      alt={getRoomTypeDisplay(room.type)}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        const placeholder = 'https://via.placeholder.com/400x250?text=No+Image';
                        if (e.target.src !== placeholder) {
                          e.target.src = placeholder;
                        }
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                        <span>{getRoomTypeIcon(room.type)}</span>
                        <span className="text-xs font-semibold text-blue-800">
                          {room.type ? room.type.toUpperCase() : 'ROOM'}
                        </span>
                      </div>
                      <div className={getStatusBadgeClass(availability.status)}>
                        {availability.text}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {getRoomTypeDisplay(room.type)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {room.description || 'No description available'}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-100">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{room.roomcount || 0}</div>
                        <div className="text-xs text-gray-500">Total Rooms</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{room.availableroomcount || 0}</div>
                        <div className="text-xs text-gray-500">Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{room.maxOccupancy || '-'}</div>
                        <div className="text-xs text-gray-500">Max Guests</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 mb-4">
                      {room.isAC ? (
                        <div className="flex items-center gap-1 text-sm">
                          <span>❄️</span>
                          <span className="text-gray-700">AC</span>
                        </div>
                      ) : null}
                      {room.isPetsAllowed ? (
                        <div className="flex items-center gap-1 text-sm">
                          <span>🐕</span>
                          <span className="text-gray-700">Pet Friendly</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Per Night</div>
                        <div className="text-lg font-bold text-gray-900">LKR {(room.pricePerNight || 0).toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-600 mb-1">Per Day</div>
                        <div className="text-lg font-bold text-gray-900">LKR {(room.pricePerDay || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {showAddRoomModal && (
        <></>
      )}

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <></>
      )}

      {/* Update Room Modal */}
      {showUpdateModal && selectedRoom && (
        <></>
      )}
    </div>
  );
};

export default RoomsPage;