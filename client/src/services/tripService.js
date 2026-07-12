import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trips';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' }
  };
};

export const getAllTrips = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createNewTrip = async (tripData) => {
  const response = await axios.post(API_URL, tripData, getAuthHeaders());
  return response.data;
};

export const dispatchTripAction = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/dispatch`, {}, getAuthHeaders());
  return response.data;
};

export const completeTripAction = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/complete`, {}, getAuthHeaders());
  return response.data;
};

export const cancelTripAction = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/cancel`, {}, getAuthHeaders());
  return response.data;
};