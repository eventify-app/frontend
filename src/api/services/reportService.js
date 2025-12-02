// frontend/src/api/services/reportService.js
import axiosInstance from "../axiosInstance";

/**
 * Servicio para obtener reportes globales del dashboard admin
 * @param {Object} filters - { start_date, end_date, category }
 * @returns {Promise<{ kpis, charts, top_events, top_categories }>}
 */
export const reportService = {
  async getGlobalReports(filters = {}) {
    try {
      const res = await axiosInstance.get("/admin/reports", {
        params: filters,
      });
      return res.data;
    } catch (error) {
      console.error("Error obteniendo reportes globales:", error);
      throw error;
    }
  },
};