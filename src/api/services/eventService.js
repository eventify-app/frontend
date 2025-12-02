import axiosInstance, { API_BASE_URL } from "../axiosInstance";

export const eventService = {
  // Crear evento con multipart/form-data
  async createEvent(formData) {
    const res = await axiosInstance.post("/events/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Obtener lista de eventos
  async getEvents(params = {}) {
    const res = await axiosInstance.get("/events/", { params });
    return res.data;
  },

  // Obtener un evento por ID
  async getEventById(id) {
    const res = await axiosInstance.get(`/events/${id}/`);
    return res.data;
  },

  // Obtener participantes de un evento
  async getParticipants(eventId) {
    const res = await axiosInstance.get(`/events/${eventId}/participants/`);
    return res.data.results;
  },

  // Actualizar evento
  async updateEvent(id, formData) {
    const res = await axiosInstance.put(`/events/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Eliminar evento
  async deleteEvent(id) {
    const res = await axiosInstance.delete(`/events/${id}/`);
    return res.data;
  },

  // Listar con URL absoluta o relativa
  async list(url = "/events/", params = {}) {
    if (url.startsWith("http")) {
      return (await axiosInstance.get(url, { params })).data;
    }
    const cleanUrl = url.replace(/^\/?api\//, "").replace(/^\/+/, "");
    return (await axiosInstance.get(`${API_BASE_URL}/${cleanUrl}`, { params })).data;
  },

  // Eventos en los que el usuario está inscrito
  async getMyEvents() {
    const res = await axiosInstance.get("/events/my-events/");
    return res.data; // { results, count, next, previous }
  },

  // Eventos creados por el usuario autenticado
  async getMyProfileEvents() {
    const res = await axiosInstance.get("/events/my-profile-events/");
    return res.data; // { results, count, next, previous }
  },

  // Cancelar inscripción
  async cancelSubscription(eventId) {
    const res = await axiosInstance.delete(`/events/${eventId}/unenroll/`);
    return res.data;
  },

  // Obtener comentarios de un evento
  async getComments(eventId) {
    const res = await axiosInstance.get(`/events/${eventId}/comments/`);
    return res.data.results;
  },

  // Enviar comentario
  async submitComment(eventId, payload) {
    const res = await axiosInstance.post(`/events/${eventId}/comments/`, payload);
    return res.data;
  },

  // Inscribirse en un evento
  async enroll(eventId) {
    const res = await axiosInstance.post(`/events/${eventId}/enroll/`);
    return res.data;
  },

  // Crear rating
  async createEventRating(eventId, payload) {
    const res = await axiosInstance.post(`/events/${eventId}/ratings/`, payload);
    return res.data;
  },

  // Obtener ratings de un evento
  async getEventRatings(eventId) {
    const res = await axiosInstance.get(`/events/${eventId}/ratings/`);
    return res.data;
  },
};