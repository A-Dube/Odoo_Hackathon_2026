import axios from 'axios';

const API_URL = 'http://localhost:5000/api/ops';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' } };
};

export const getMaintenanceLogs = async () => (await axios.get(`${API_URL}/maintenance`, getAuthHeaders())).data;
export const createMaintenanceLog = async (data) => (await axios.post(`${API_URL}/maintenance`, data, getAuthHeaders())).data;

export const getExpenses = async () => (await axios.get(`${API_URL}/expenses`, getAuthHeaders())).data;
export const createExpenseLog = async (data) => (await axios.post(`${API_URL}/expenses`, data, getAuthHeaders())).data;

export const getReportAnalytics = async () => (await axios.get(`${API_URL}/reports`, getAuthHeaders())).data;