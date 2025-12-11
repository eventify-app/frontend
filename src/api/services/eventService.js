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

  async createEventRating(eventId, payload) {
    const res = await axiosInstance.post(
      `/events/${eventId}/ratings/`,
      payload
    );
    return res.data;
  },

  async reportEvent(eventId, reason) {
    const formData = new FormData();
    formData.append("reason", reason);

    const res = await axiosInstance.post(
      `/events/${eventId}/report/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  },

  async markAttendance(eventId, participantId) {
    const formData = new FormData();
    formData.append("participant_id", participantId);

    const res = await axiosInstance.post(
      `/events/${eventId}/check-in/`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

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
    // Si es URL absoluta, limpiar dominio + prefijo /api
    if (url.startsWith("http")) {
      url = url.replace(/^https?:\/\/[^/]+\/api/, "");   // quita dominio + /api
    }

    const res = await axiosInstance.get(url, { params });
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

  async enroll(eventId) {
    const res = await axiosInstance.post(`/events/${eventId}/enroll/`);
    return res.data;
  },

  // Estadísticas del creador (eventos creados)
  async getMyStats() {
    const res = await axiosInstance.get("/events/my-stats/");
    return res.data;
},

  // Estadísticas como asistente (cantidad de eventos donde estoy inscrito)
  async getMyAttendeeStats() {
    const res = await axiosInstance.get("/events/my-attendee-stats/");
    return res.data;
  },

  async getAttendeesByCategory() {
    const res = await axiosInstance.get("/events/attendees-by-category/");
    return res.data;
  },

  async getMyPopularEvents() {
    const res = await axiosInstance.get("/events/my-popular-events/");
    return res.data; // el backend ya devuelve lista directa
  },


  async getCategories() {
    const res = await axiosInstance.get("/categories/");
    return res.data.results; // devolvemos solo la lista de categorías
  },

  async reportComment(eventId, commentId, body) {
    const res = await axiosInstance.post(
      `/events/${eventId}/comments/${commentId}/report/`,
      body
    );
    return res.data;
  },

  reportEvent(eventId, data) {
    return axiosInstance.post(`/events/${eventId}/report/`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },


};