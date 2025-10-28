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
  async getEvents() {
    const res = await axiosInstance.get("/events/");
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
};
