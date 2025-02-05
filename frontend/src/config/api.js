import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Server Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;