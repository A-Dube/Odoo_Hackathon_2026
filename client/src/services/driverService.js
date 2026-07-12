import axios from 'axios';

const API_URL = 'http://localhost:5000/api/drivers';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' }
  };
};

export const getAllDrivers = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createNewDriver = async (driverData) => {
  const response = await axios.post(API_URL, driverData, getAuthHeaders());
  return response.data;
};

export const deleteDriverById = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};