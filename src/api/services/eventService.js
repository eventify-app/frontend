import axiosInstance from "../axiosInstance";

const API_URL = "http://localhost:8000/api/";

export const eventService = {
  // Crear evento con multipart/form-data
  async createEvent(formData) {
    const res = await axiosInstance.post("/events/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Obtener lista de eventos (explorar)
  async getEvents(params = {}) {
    const res = await axiosInstance.get("/events/", { params });
    return res.data;
  },

  // Obtener un evento por ID
  async getEventById(id) {
    const res = await axiosInstance.get(`/events/${id}/`);
    return res.data;
  },

  // Actualizar evento (también admite FormData)
  async updateEvent(id, formData) {
    const res = await axiosInstance.put(`/events/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  // Eliminar evento
  async deleteEvent(id) {
    const res = await axiosInstance.delete(`/events/${id}/`);
    return res.data;
  },

  // Listado genérico con soporte de paginación
  list: async (url = "events/", params = {}) => {
    if (url.startsWith("http")) {
      return (await axiosInstance.get(url, { params })).data;
    }
    const cleanUrl = url.replace(/^\/?api\//, "").replace(/^\/+/, "");
    return (await axiosInstance.get(`${API_URL}${cleanUrl}`, { params })).data;
  },

  // Obtener eventos creados por el usuario autenticado
  async getMyEvents() {
    const res = await axiosInstance.get("/events/my-events/");
    return res.data; // devuelve objeto con results, count, next, previous
  },

  // 🔹 Obtener participantes de un evento
  async getParticipants(eventId) {
    const res = await axiosInstance.get(`/events/${eventId}/participants/`);
    return res.data.results; // ahora sí devuelve un array
  },


  // 🔹 Obtener comentarios de un evento
  async getComments(eventId) {
    const res = await axiosInstance.get(`/events/${eventId}/comments/`);
    return res.data;
  },

  // 🔹 Crear comentario (con soporte para respuestas en hilo)
  async submitComment(eventId, comment, parentId = null) {
    const res = await axiosInstance.post(`/events/${eventId}/comments/`, {
      comment,
      parent_id: parentId,
    });
    return res.data;
  },

  // 🔹 Obtener calificaciones de un evento
  async getRatings(eventId) {
    const res = await axiosInstance.get(`/events/${eventId}/ratings/`);
    return res.data;
  },

  // 🔹 Enviar calificación
  async submitRating(eventId, rating) {
    const res = await axiosInstance.post(`/events/${eventId}/ratings/`, {
      rating,
    });
    return res.data;
  },
};