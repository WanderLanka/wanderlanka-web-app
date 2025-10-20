const API_BASE_URL = 'http://localhost:3000/api/complaints';

class ComplaintService {
  async getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async submitComplaint(complaintData) {
    try {
      const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(complaintData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit complaint');
      }

      return result;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error;
    }
  }

  async getUserComplaints(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/my-complaints?${queryParams}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch complaints');
      }

      return result;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  }

  async getComplaintById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/my-complaints/${id}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch complaint details');
      }

      return result;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  }

  async getAllComplaints(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/admin/all?${queryParams}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch all complaints');
      }

      return result;
    } catch (error) {
      console.error('Error fetching all complaints:', error);
      throw error;
    }
  }

  async getComplaintStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch complaint statistics');
      }

      return result;
    } catch (error) {
      console.error('Error fetching complaint stats:', error);
      throw error;
    }
  }

  async updateComplaintStatus(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/${id}/status`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update complaint status');
      }

      return result;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      throw error;
    }
  }
}

export default new ComplaintService();
