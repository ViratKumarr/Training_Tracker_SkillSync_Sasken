import axios from 'axios';
import apiClient from './apiClient';

const API_BASE_URL = 'http://localhost:8080/api';

// Mock users for authentication when backend is not available
const mockUsers = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@sasken.com',
    password: 'admin123',
    role: 'ADMIN',
    department: 'IT',
    employeeId: 'EMP001',
    phoneNumber: '+1234567890',
    isActive: true
  },
  {
    id: 2,
    firstName: 'Manager',
    lastName: 'User',
    email: 'manager@sasken.com',
    password: 'manager123',
    role: 'MANAGER',
    department: 'HR',
    employeeId: 'EMP002',
    phoneNumber: '+1234567891',
    isActive: true
  },
  {
    id: 3,
    firstName: 'Trainer',
    lastName: 'User',
    email: 'trainer@sasken.com',
    password: 'trainer123',
    role: 'TRAINER',
    department: 'Training',
    employeeId: 'EMP003',
    phoneNumber: '+1234567892',
    isActive: true
  },
  {
    id: 4,
    firstName: 'Employee',
    lastName: 'User',
    email: 'employee@sasken.com',
    password: 'employee123',
    role: 'EMPLOYEE',
    department: 'Engineering',
    employeeId: 'EMP004',
    phoneNumber: '+1234567893',
    isActive: true
  }
];

// Mock login function
const mockLogin = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  // Generate a mock token
  const token = `mock-token-${user.id}-${Date.now()}`;

  // Store in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    department: user.department,
    employeeId: user.employeeId,
    phoneNumber: user.phoneNumber
  }));

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department,
      employeeId: user.employeeId,
      phoneNumber: user.phoneNumber
    }
  };
};

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post(`/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Fallback to mock authentication when backend is not available
      console.log('Backend not available, using mock authentication');
      return mockLogin(email, password);
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Registration failed';
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to get user profile';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default apiClient;