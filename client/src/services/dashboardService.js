import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard/stats';

const getAuthHeaders = () => {
  const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  return {
    headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' }
  };
};

export const getDashboardAnalytics = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};