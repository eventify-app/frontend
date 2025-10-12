import axiosInstance from "../axiosInstance";

export const authService = {
  async register(userData) {
    const res = await axiosInstance.post("/users/register/", userData);
    return res.data;
  },

  logout() {
    localStorage.removeItem("token")
  }
}

