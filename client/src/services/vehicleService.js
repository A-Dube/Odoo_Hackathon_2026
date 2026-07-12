import api from './api';

export const getAllVehicles = async () => {
  const response = await api.get('/vehicles');
  return response.data;
};

export const getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const createNewVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

export const updateVehicleById = async (id, vehicleData) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicleById = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};