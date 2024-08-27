import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";

const api = axios.create({
  baseURL: "https://eagle-fits.onrender.com/gms/api/v1",
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const { newAccessToken } = response.data;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);

        const { user, logout } = useContext(UserContext);
        const navigate = useNavigate();

        const handleLogout = async () => {
          try {
            await api.post(`/auth/logout`, user.id);
            logout();
            navigate("/login");
          } catch (error) {
            console.error(error);
          }
        };

        handleLogout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
