import axios from "axios";

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

      // ⛔ EVITAR REFRESH en la pantalla de LOGIN
      // Si la petición fallida es /login o estás en /login
      if (
        window.location.pathname === "/login" ||
        originalRequest?.url?.includes("/login")
      ) {
        return Promise.reject(error);
      }

      // ----- MANEJO DE 401 -----
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refresh");

        // Si NO hay refresh token → cerrar sesión y redirigir
        if (!refreshToken) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");

          window.location.href = "/login"; // Aquí sí es correcto refrescar
          return Promise.reject(error);
        }

        // Si YA hay un refresh en proceso → agregar a cola
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          });
        }

        // Ejecutar refresh token
        isRefreshing = true;

        try {
          const { data } = await axiosInstance.post("/token/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = data.access;

          // Guardar el nuevo token
          localStorage.setItem("token", newAccessToken);

          // Actualizar auth headers por defecto
          axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

          // Procesar cola
          processQueue(null, newAccessToken);

          // Reintentar petición original
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);

        } catch (refreshError) {
          processQueue(refreshError, null);

          // El refresh token falló → cerrar sesión
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user");

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
