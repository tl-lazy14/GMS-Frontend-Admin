import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";

const api = axios.create({
  baseURL: "http://localhost:2002/gms/api/v1",
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh", { withCredentials: true });
        const { newAccessToken } = response.data;
        document.cookie = `accessToken=${newAccessToken}; Path=/;`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);

        const { user, logout } = useContext(UserContext);
        const navigate = useNavigate();

        const handleLogout = async () => {
          try {
            await api.post(`/auth/logout`, user.id, { withCredentials: true });
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
