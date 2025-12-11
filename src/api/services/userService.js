import axiosInstance, { BACKEND_URL } from "../axiosInstance";

export const userService = {
  // =====================================================
  // OBTENER PERFIL POR ID (ya existente)
  // =====================================================
  getUserById(id) {
    return axiosInstance.get(`/users/${id}/detail/`).then(res => res.data);
  },

  // =====================================================
  // EVENTOS DEL PERFIL (ya existente)
  // =====================================================
  async getMyProfileEvents() {
    const res = await axiosInstance.get("/events/my-profile-events/");
    return res.data;
  },

  // =====================================================
  // SUBIR AVATAR (ya existente)
  // =====================================================
  async uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append("profile_photo", file);

    const res = await axiosInstance.post("/users/profile-photo/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const relativePath = res.data.profile_photo;

    return {
      ...res.data,
      full_url: `${BACKEND_URL}${relativePath}`,
    };
  },

  // =====================================================
  // 🔥 NUEVOS MÉTODOS PARA EDITAR PERFIL
  // =====================================================

  // Obtener MI usuario (GET /api/users/)
  async getMe() {
    const res = await axiosInstance.get("/users/");
    return res.data;
  },

  // Actualizar MI perfil (PATCH /api/users/)
  async updateProfile(body) {
    const res = await axiosInstance.patch("/users/", body);
    return res.data;
  },

  // =====================================================
  // 🔥 NUEVOS ENDPOINTS PARA CAMBIAR EMAIL
  // =====================================================

  // Solicitar cambio de email (POST /api/users/change-email/request/)
  async requestEmailChange(body) {
    const res = await axiosInstance.post("/users/change-email/request/", body);
    return res.data;
  },

  // Verificar OTP y completar cambio (POST /api/users/change-email/verify/)
  async verifyEmailChange(body) {
    const res = await axiosInstance.post("/users/change-email/verify/", body);
    return res.data;
  },
  
};
