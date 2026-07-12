import api from './api';

export const getAllDrivers = async () => {
  const response = await api.get('/drivers');
  return response.data;
};

export const getDriverById = async (id) => {
  const response = await api.get(`/drivers/${id}`);
  return response.data;
};

export const createNewDriver = async (driverData) => {
  const response = await api.post('/drivers', driverData);
  return response.data;
};

export const updateDriverById = async (id, driverData) => {
  const response = await api.put(`/drivers/${id}`, driverData);
  return response.data;
};

export const deleteDriverById = async (id) => {
  const response = await api.delete(`/drivers/${id}`);
  return response.data;
};