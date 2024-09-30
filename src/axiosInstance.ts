import axios from 'axios';
import { useAuth } from './context/AuthContext';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-url.com',
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const auth = useAuth(); // 注意：这里可能需要其他方式来访问 auth context
        await auth.refreshToken();
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;