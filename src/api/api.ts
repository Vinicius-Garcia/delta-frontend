import axios, { AxiosInstance } from "axios";
var url = "http://localhost:8080"

const api: AxiosInstance = axios.create({
  baseURL: url,
});

api.interceptors.request.use(
  function (config) {
    const token = sessionStorage.getItem("token");
    if (token) config.headers.authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
