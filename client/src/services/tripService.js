import api from './api';

export const getAllTrips = async () => {
  const response = await api.get('/trips');
  return response.data;
};

export const createNewTrip = async (tripData) => {
  const response = await api.post('/trips', tripData);
  return response.data;
};

export const dispatchTripAction = async (id) => {
  const response = await api.put(`/trips/${id}/dispatch`);
  return response.data;
};

export const completeTripAction = async (id) => {
  const response = await api.put(`/trips/${id}/complete`);
  return response.data;
};

export const cancelTripAction = async (id) => {
  const response = await api.put(`/trips/${id}/cancel`);
  return response.data;
};