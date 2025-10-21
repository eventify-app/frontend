import axiosInstance from "../axiosInstance";

export const authService = {
  async register(userData) {
    const res = await axiosInstance.post("/users/register/", userData);
    return res.data;
  },

  async login(credentials) {
    const res = await axiosInstance.post("/users/login/", credentials);
    // Suponiendo que el token está en res.data.token
    const token = res.data.access;

    if (token) {
      localStorage.setItem("token", token);
      
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem("token")
  }
}

