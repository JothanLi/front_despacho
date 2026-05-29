import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const esLogin = config.url?.includes("/auth/login");

    if (token && !esLogin) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;