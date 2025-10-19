import React, { useState, useEffect } from 'react';
import api from '../../services/axiosConfig.js';

const ReportComplain = () => {
  const [formData, setFormData] = useState({
    topic: '',
    category: 'accommodation',
    complaint: '',
    // submittedDate removed from UI; backend will set current time
    status: 'new',
    priority: 'medium',
    serviceProvider: '',
    bookingReference: '',
    responseRequired: false,
    photos: [],
  });

  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let storedUser = null;
    try {
      storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    } catch {}
    const inferredName = storedUser?.name || storedUser?.username || (storedUser?.email ? storedUser.email.split('@')[0] : undefined);
    const inferredEmail = storedUser?.email;
    const payload = {
      topic: formData.topic,
      category: formData.category,
      complaint: formData.complaint,
      userEmail: inferredEmail,
      userName: inferredName,
      // submittedDate omitted; set by backend
      status: formData.status,
      priority: formData.priority,
      photos: formData.photos,
      serviceProvider: formData.serviceProvider,
      bookingReference: formData.bookingReference,
      responseRequired: formData.responseRequired,
    };
    try {
      const res = await api.post('/accommodation/complaints', payload);
      const doc = res?.data?.data || res?.data || {};
      const normalized = {
        id: doc._id || doc.id,
        responseRequired: Boolean(doc.responseRequired),
        response: doc.response,
        status: doc.status,
        submittedDate: doc.submittedDate
      };
      setSubmittedComplaint(normalized);
      if (normalized.id) localStorage.setItem('accLastComplaintId', normalized.id);
      alert('Complaint submitted');
    } catch (err) {
      alert('Failed to submit complaint');
    }
  };

  useEffect(() => {
    const lastId = localStorage.getItem('accLastComplaintId');
    if (lastId && !submittedComplaint) {
      const fetchExisting = async () => {
        try {
          setLoadingResponse(true);
          const res = await api.get(`/accommodation/complaints/${lastId}`);
          const doc = res?.data?.data || res?.data || {};
          setSubmittedComplaint({
            id: doc._id || doc.id,
            responseRequired: Boolean(doc.responseRequired),
            response: doc.response,
            status: doc.status,
            submittedDate: doc.submittedDate
          });
        } catch {}
        finally {
          setLoadingResponse(false);
        }
      };
      fetchExisting();
    }
  }, []);

  useEffect(() => {
    if (!submittedComplaint?.id || !submittedComplaint.responseRequired || submittedComplaint.response) return;
    let timer = null;
    const poll = async () => {
      try {
        const res = await api.get(`/accommodation/complaints/${submittedComplaint.id}`);
        const doc = res?.data?.data || res?.data || {};
        setSubmittedComplaint((prev) => prev ? {
          ...prev,
          response: doc.response,
          status: doc.status
        } : prev);
      } catch {}
    };
    timer = setInterval(poll, 5000);
    return () => { if (timer) clearInterval(timer); };
  }, [submittedComplaint?.id, submittedComplaint?.responseRequired, submittedComplaint?.response]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Report a Complain</h1>
      <p className="text-slate-600 mb-6">Submit an issue related to your accommodation services.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief title of the issue"
            required
          />
        </div>

        

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="accommodation">Accommodation</option>
              <option value="platform">Platform</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Complaint</label>
          <textarea
            name="complaint"
            rows={6}
            value={formData.complaint}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Provide detailed information about the issue"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Provider</label>
            <input
              type="text"
              name="serviceProvider"
              value={formData.serviceProvider}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Booking Reference</label>
            <input
              type="text"
              name="bookingReference"
              value={formData.bookingReference}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional booking id"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 pt-6">
            <input
              id="responseRequired"
              type="checkbox"
              name="responseRequired"
              checked={formData.responseRequired}
              onChange={(e) => setFormData((p) => ({ ...p, responseRequired: e.target.checked }))}
              className="h-4 w-4 text-blue-600 border-slate-300 rounded"
            />
            <label htmlFor="responseRequired" className="text-sm text-slate-700">Response required</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Attachment (optional)</label>
          <input
            type="file"
            name="attachment"
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Complaint
          </button>
        </div>
      </form>

      {submittedComplaint && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Complaint Status</h2>
          <div className="text-sm text-slate-600 mb-2">ID: {submittedComplaint.id}</div>
          <div className="text-sm text-slate-600 mb-2">Status: {submittedComplaint.status}</div>
          {submittedComplaint.responseRequired && (
            <div className="mt-4">
              <h3 className="text-base font-medium text-slate-800 mb-1">Admin Response</h3>
              {loadingResponse ? (
                <div className="text-slate-600 text-sm">Loading...</div>
              ) : submittedComplaint.response ? (
                <div className="whitespace-pre-wrap text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">{submittedComplaint.response}</div>
              ) : (
                <div className="text-slate-600 text-sm">No response yet. We will notify you once it is available.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportComplain;


