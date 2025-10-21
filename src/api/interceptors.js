import axiosInstance from "./axiosInstance";

export const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      return config
    },

    (error) => Promise.reject(error)
  )

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        //window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
}
