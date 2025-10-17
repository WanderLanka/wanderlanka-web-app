import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Upload, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Calendar,
  DollarSign,
  Fuel,
  Settings,
  FileText,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import api from '../../services/axiosConfig';
import { toast } from 'react-toastify';

const AddNewTransport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Vehicle Information
    vehicleType: 'car',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    seats: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    
    // Pricing & Availability
    pricingPerKm: '',
    availability: 'available',
    
    // Driver Information
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    
    // Insurance & Legal
    insuranceNumber: '',
    
    // Features & Amenities
    ac: true,
    features: [],
    
    // Location & Description
    location: '',
    description: '',
    
    // Images
    images: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  // Available vehicle features
  const availableFeatures = [
    'Air Conditioning',
    'GPS Navigation',
    'WiFi',
    'Music System',
    'USB Charging',
    'First Aid Kit',
    'Child Seat Available',
    'Professional Driver',
    'English Speaking Driver',
    'Tour Guide Service',
    'Luggage Space',
    'Wheelchair Accessible',
    'Pet Friendly',
    'Water Bottles',
    'Towels Provided'
  ];

  const handleInputChange = (e) => {
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

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newImages = [];
      const newPreviews = [];
      
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          newImages.push(file);
          
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target.result);
            if (newPreviews.length === files.length) {
              setImagePreview(prev => [...prev, ...newPreviews]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.brand.trim()) errors.brand = 'Brand is required';
    if (!formData.model.trim()) errors.model = 'Model is required';
    if (!formData.licensePlate.trim()) errors.licensePlate = 'License plate is required';
    if (!formData.seats || formData.seats < 1) errors.seats = 'Valid seat count is required';
    if (!formData.pricingPerKm || formData.pricingPerKm <= 0) errors.pricingPerKm = 'Valid pricing per km is required';
    if (!formData.driverName.trim()) errors.driverName = 'Driver name is required';
    if (!formData.driverPhone.trim()) errors.driverPhone = 'Driver phone is required';
    if (!formData.driverLicense.trim()) errors.driverLicense = 'Driver license is required';
    if (!formData.insuranceNumber.trim()) errors.insuranceNumber = 'Insurance number is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real application, you'd upload images to a cloud service first
      // For now, we'll simulate this with placeholder URLs
      const imageUrls = formData.images.map((_, index) => 
        `https://example.com/vehicle-image-${Date.now()}-${index}.jpg`
      );
      
      const submitData = {
        ...formData,
        images: imageUrls,
        seats: parseInt(formData.seats),
        year: parseInt(formData.year),
        pricingPerKm: parseFloat(formData.pricingPerKm)
      };
      
      console.log('Submitting vehicle data:', submitData);
      
      const response = await api.post('/transport/vehicles', submitData);
      
      console.log('Vehicle added successfully:', response.data);
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/transport/vehicles');
      }, 2000);
      
    } catch (error) {
      console.error('Error adding vehicle:', error);
      
      if (error.response?.data?.details) {
        setFormErrors(error.response.data.details);
        toast.error('Please check the form for validation errors');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to add vehicle. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-4">
            Your vehicle has been added successfully. Redirecting to vehicles page...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/transport/vehicles')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Vehicles</span>
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold">Add New Vehicle</h1>
            <p className="text-gray-300 mt-2">
              Add a new vehicle to your transport fleet
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Vehicle Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Vehicle Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="bus">Bus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Toyota, Honda, Mercedes"
                />
                {formErrors.brand && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Corolla, Civic, Sprinter"
                />
                {formErrors.model && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.model}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="e.g., 2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate *
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.licensePlate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ABC-1234"
                />
                {formErrors.licensePlate && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.licensePlate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.seats ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 4"
                />
                {formErrors.seats && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.seats}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Availability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing & Availability
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing per KM (LKR) *
                </label>
                <input
                  type="number"
                  name="pricingPerKm"
                  value={formData.pricingPerKm}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.pricingPerKm ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 50.00"
                />
                {formErrors.pricingPerKm && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.pricingPerKm}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Driver Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Driver Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Name *
                </label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.driverName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Ravi Perera"
                />
                {formErrors.driverName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.driverName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver Phone *
                </label>
                <input
                  type="tel"
                  name="driverPhone"
                  value={formData.driverPhone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.driverPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., +94 77 123 4567"
                />
                {formErrors.driverPhone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.driverPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver License Number *
                </label>
                <input
                  type="text"
                  name="driverLicense"
                  value={formData.driverLicense}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.driverLicense ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., B1234567"
                />
                {formErrors.driverLicense && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.driverLicense}</p>
                )}
              </div>
            </div>
          </div>

          {/* Insurance & Legal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Insurance & Legal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Number *
                </label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.insuranceNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., INS-2023-001234"
                />
                {formErrors.insuranceNumber && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.insuranceNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                    formErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Colombo, Sri Lanka"
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Features & Amenities
            </h2>

            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="ac"
                  checked={formData.ac}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700 font-medium">Air Conditioning Available</span>
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Description
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your vehicle, its condition, special features, and any additional services you provide..."
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Vehicle Images
            </h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div>
                  <label className="cursor-pointer">
                    <span className="text-teal-600 hover:text-teal-700 font-medium">
                      Click to upload images
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/transport/vehicles')}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{loading ? 'Adding Vehicle...' : 'Add Vehicle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewTransport;