import apiClient from './apiClient';

export const CourseService = {
  getAllCourses: async () => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch courses';
    }
  },

  getCourseById: async (id) => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch course';
    }
  },

  getCoursesByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/courses/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch courses by category';
    }
  },

  getCoursesByType: async (type) => {
    try {
      const response = await apiClient.get(`/courses/type/${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch courses by type';
    }
  },

  getMandatoryCourses: async () => {
    try {
      const response = await apiClient.get('/courses/mandatory');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch mandatory courses';
    }
  },

  searchCourses: async (keyword) => {
    try {
      const response = await apiClient.get(`/courses/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to search courses';
    }
  },

  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create course';
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      const response = await apiClient.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update course';
    }
  },

  deleteCourse: async (id) => {
    try {
      const response = await apiClient.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete course';
    }
  },

  getCoursesByTrainer: async (trainerId) => {
    try {
      const response = await apiClient.get(`/courses/trainer/${trainerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch trainer courses';
    }
  }
}; 