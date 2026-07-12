import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vehicles';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' }
  };
};

export const getAllVehicles = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createNewVehicle = async (vehicleData) => {
  const response = await axios.post(API_URL, vehicleData, getAuthHeaders());
  return response.data;
};

export const deleteVehicleById = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};