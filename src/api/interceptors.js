export const setupInterceptors = (axiosInstance) => {
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  // ----- REQUEST -----
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // ----- RESPONSE -----
  axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Si YA hay un refresh token en curso → ponemos esta request en cola
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          });
        }

        isRefreshing = true;

        try {
          // Llamada al refresh del backend
          const { data } = await axiosInstance.post("/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = data.access;

          // Guardar nuevo token
          localStorage.setItem("token", newAccessToken);

          // Update default header
          axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

          // Procesar cola
          processQueue(null, newAccessToken);

          // Reintentar request original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          processQueue(refreshError, null);

          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          window.location.href = "/login";

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
