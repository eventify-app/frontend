import axiosInstance from "../axiosInstance";

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

  // Obtener participantes de un evento por ID
  async getParticipants(id) {
    const res = await axiosInstance.get(`/events/${id}/participants/`);
    return res.data.results;
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

  async list(url = "/events/", params = {}) {
    // si la URL tiene dominio (de next o previous), lo limpiamos
    const cleanUrl = url.replace(/^https?:\/\/[^/]+/, "");
    const res = await axiosInstance.get(cleanUrl, { params });
    return res.data;
  },

  // Obtener un evento por id
  async retrieve(id) {
    const res = await axiosInstance.get(`/events/${id}/`);
    return res.data;
  },

  // Crear evento (usa multipart/form-data)
  async create(formData) {
    const res = await axiosInstance.post("/events/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Obtener eventos creados por el usuario autenticado
  async getMyEvents() {
    const res = await axiosInstance.get("/events/my-events/");
    return res.data.results; // 👈 devolvemos solo la lista de eventos
  },

  // Obtener comentarios de un evento
  async getComments(eventId) {
    const res = await axiosInstance.get(`/events/${eventId}/comments/`);
    return res.data.results;
  },

  // Enviar comentario y calificación
  async submitComment(eventId, payload) {
    const res = await axiosInstance.post(`/events/${eventId}/comments/`, payload);
    return res.data;
  },

};