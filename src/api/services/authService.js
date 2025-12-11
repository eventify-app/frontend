// src/api/services/authService.js
import axiosInstance from "../axiosInstance";

export const authService = {
  async register(userData) {
    const res = await axiosInstance.post("/users/register/", userData);
    return res.data;
  },

  async login(credentials) {
    const res = await axiosInstance.post("/users/login/", credentials);

    const { access, refresh, user } = res.data;

    // 🔥 Guardar en localStorage
    if (access) localStorage.setItem("token", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    return res.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  },
};
