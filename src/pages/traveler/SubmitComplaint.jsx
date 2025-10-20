import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertTriangle, Upload, X, Send } from 'lucide-react';
import { Button } from '../../components/common';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    complaint: '',
    category: 'other',
    serviceProvider: '',
    bookingReference: '',
    photos: []
  });

  const [photoFiles, setPhotoFiles] = useState([]);

  const categories = [
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'transport', label: 'Transport' },
    { value: 'guide', label: 'Tour Guide' },
    { value: 'platform', label: 'Platform Issue' },
    { value: 'payment', label: 'Payment' },
    { value: 'booking', label: 'Booking' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
      caption: ''
    }));
    
    setPhotoFiles(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (id) => {
    setPhotoFiles(prev => prev.filter(photo => photo.id !== id));
  };

  const handlePhotoCaptionChange = (id, caption) => {
    setPhotoFiles(prev => prev.map(photo => 
      photo.id === id ? { ...photo, caption } : photo
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject?.trim() || !formData.complaint?.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Prepare photos data
      const photosData = photoFiles.map(photo => ({
        url: photo.url, // In a real app, you'd upload to a server first
        caption: photo.caption
      }));

      const complaintData = {
        ...formData,
        photos: photosData
      };

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to submit a complaint');
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:3000/api/complaints/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(complaintData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Complaint submitted successfully!');
        navigate('/user/complaints');
      } else {
        toast.error(result.message || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit a Complaint</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We value your feedback and are committed to resolving any issues you may have encountered. 
            Please provide detailed information about your concern.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief description of your complaint"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-900 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Complaint Description */}
            <div>
              <label htmlFor="complaint" className="block text-sm font-semibold text-slate-900 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="complaint"
                name="complaint"
                value={formData.complaint}
                onChange={handleInputChange}
                rows={6}
                placeholder="Please provide a detailed description of your complaint. Include relevant dates, times, and any other important information."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
               <p className="text-xs text-slate-500 mt-1">
                 {(formData.complaint || '').length}/2000 characters
               </p>
            </div>

            {/* Service Provider */}
            <div>
              <label htmlFor="serviceProvider" className="block text-sm font-semibold text-slate-900 mb-2">
                Service Provider (if applicable)
              </label>
              <input
                type="text"
                id="serviceProvider"
                name="serviceProvider"
                value={formData.serviceProvider}
                onChange={handleInputChange}
                placeholder="e.g., Hotel name, Transport company, etc."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Booking Reference */}
            <div>
              <label htmlFor="bookingReference" className="block text-sm font-semibold text-slate-900 mb-2">
                Booking Reference (if applicable)
              </label>
              <input
                type="text"
                id="bookingReference"
                name="bookingReference"
                value={formData.bookingReference}
                onChange={handleInputChange}
                placeholder="e.g., HOT-2025-001234"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Attach Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label htmlFor="photos" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 mb-1">Click to upload photos</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB each</p>
                </label>
              </div>

              {/* Photo Preview */}
              {photoFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photoFiles.map(photo => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url}
                        alt="Upload preview"
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <input
                        type="text"
                        placeholder="Caption (optional)"
                        value={photo.caption}
                        onChange={(e) => handlePhotoCaptionChange(photo.id, e.target.value)}
                        className="w-full mt-2 px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Complaint</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-800 text-sm mb-2">
            Our support team typically responds to complaints within 24-48 hours. 
            For urgent matters, please contact our customer service directly.
          </p>
          <p className="text-blue-800 text-sm">
            <strong>Customer Service:</strong> +94 11 234 5678 | support@wanderlanka.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
