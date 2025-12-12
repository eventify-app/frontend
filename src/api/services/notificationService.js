import api from "../axiosInstance";

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get("/notifications/");
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read/`);
    return res.data;
  },
};
