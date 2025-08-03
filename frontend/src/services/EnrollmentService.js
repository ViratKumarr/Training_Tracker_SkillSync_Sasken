import apiClient from './apiClient';

export const EnrollmentService = {
  getAllEnrollments: async () => {
    try {
      const response = await apiClient.get('/enrollments');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch enrollments';
    }
  },

  getEnrollmentsByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/enrollments/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch user enrollments';
    }
  },

  getEnrollmentsByCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/enrollments/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch course enrollments';
    }
  },

  getEnrollmentById: async (id) => {
    try {
      const response = await apiClient.get(`/enrollments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch enrollment';
    }
  },

  createEnrollment: async (enrollmentData) => {
    try {
      const response = await apiClient.post('/enrollments', enrollmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create enrollment';
    }
  },

  updateEnrollmentStatus: async (id, status) => {
    try {
      const response = await apiClient.put(`/enrollments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update enrollment status';
    }
  },

  deleteEnrollment: async (id) => {
    try {
      const response = await apiClient.delete(`/enrollments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete enrollment';
    }
  },

  getEnrollmentStats: async () => {
    try {
      const response = await apiClient.get('/enrollments/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch enrollment stats';
    }
  }
}; 