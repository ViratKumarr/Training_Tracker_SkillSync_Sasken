import apiClient from './apiClient';

export const ProgressService = {
  getAllProgress: async () => {
    try {
      const response = await apiClient.get('/progress');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch progress data';
    }
  },

  getProgressByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/progress/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch user progress';
    }
  },

  getProgressByCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/progress/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch course progress';
    }
  },

  getProgressById: async (id) => {
    try {
      const response = await apiClient.get(`/progress/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch progress';
    }
  },

  createProgress: async (progressData) => {
    try {
      const response = await apiClient.post('/progress', progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create progress';
    }
  },

  updateProgress: async (id, progressData) => {
    try {
      const response = await apiClient.put(`/progress/${id}`, progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update progress';
    }
  },

  deleteProgress: async (id) => {
    try {
      const response = await apiClient.delete(`/progress/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete progress';
    }
  },

  getUserProgressStats: async (userId) => {
    try {
      const response = await apiClient.get(`/progress/user/${userId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch user progress stats';
    }
  },

  updateQuizScore: async (id, quizData) => {
    try {
      const response = await apiClient.put(`/progress/${id}/quiz`, quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update quiz score';
    }
  },

  updateTimeSpent: async (id, timeData) => {
    try {
      const response = await apiClient.put(`/progress/${id}/time`, timeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update time spent';
    }
  }
}; 