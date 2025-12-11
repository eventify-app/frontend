// src/api/services/adminService.js
import api from "../axiosInstance";

/**
 * adminService
 * - usa api (axios instance) con baseURL ya configurada
 * - rutas llamadas: /analytics/*, /categories/, /reported-events/, /reported-comments/
 */
const adminService = {
  /* ---------- Analytics & categories ---------- */
  getTopCategories: async (params = {}) => {
    const res = await api.get("/analytics/top-categories/", { params });
    return res.data;
  },

  getTopCreators: async (params = {}) => {
    const res = await api.get("/analytics/top-creators/", { params });
    return res.data;
  },

  getTopEvents: async (params = {}) => {
    const res = await api.get("/analytics/top-events/", { params });
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get("/categories/");
    // API returns list under results or direct array — handle both
    return res.data.results ?? res.data;
  },

  /* ---------- Reported events (paginated) ---------- */
  // Puede recibir una URL completa (next/prev) o params object
  fetchReportedEvents: async (arg = {}) => {
    if (typeof arg === "string") {
      // url passed (next/prev)
      let url = arg;
      if (url.startsWith("http")) {
        // remove domain + possible /api prefix to make relative to axios baseURL
        url = url.replace(/^https?:\/\/[^/]+\/api/, "");
      }
      const res = await api.get(url);
      return res.data;
    } else {
      // params object
      const res = await api.get("/reported-events/", { params: arg });
      return res.data;
    }
  },

  disableEvent: async (id) => {
    const res = await api.post(`/reported-events/${id}/disable/`);
    return res.data;
  },

  restoreEvent: async (id) => {
    const res = await api.post(`/reported-events/${id}/restore/`);
    return res.data;
  },

  /* ---------- Reported comments (paginated)---------- */
  fetchReportedComments: async (arg = {}) => {
    if (typeof arg === "string") {
      let url = arg;
      if (url.startsWith("http")) {
        url = url.replace(/^https?:\/\/[^/]+\/api/, "");
      }
      const res = await api.get(url);
      return res.data;
    } else {
      const res = await api.get("/reported-comments/", { params: arg });
      return res.data;
    }
  },

  disableComment: async (id) => {
    const res = await api.post(`/reported-comments/${id}/disable/`);
    return res.data;
  },

  restoreComment: async (id) => {
    const res = await api.post(`/reported-comments/${id}/restore/`);
    return res.data;
  },
};

export default adminService;
