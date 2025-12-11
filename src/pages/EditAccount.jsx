import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import { userService } from "../api/services/userService";
import { BirthdayCalendarInput } from "@/components/BirthdayCalendarInput";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EditAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone: "",
  });

  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const [emailRequested, setEmailRequested] = useState(false);

  // === VALIDACIONES ==================================
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) errors.first_name = "El nombre es obligatorio";
    if (!formData.last_name.trim()) errors.last_name = "El apellido es obligatorio";

    if (!formData.date_of_birth)
      errors.date_of_birth = "La fecha de nacimiento es obligatoria";

    if (!formData.phone.trim()) {
      errors.phone = "El teléfono es obligatorio";
    } else if (!/^[0-9+\-\s()]{6,20}$/.test(formData.phone)) {
      errors.phone = "Formato de teléfono inválido";
    }

    if (!formData.username.trim())
      errors.username = "El nombre de usuario es obligatorio";

    return errors;
  };

  // === CARGAR PERFIL ===================================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getMe();

        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          date_of_birth: data.date_of_birth || "",
          phone: data.phone || "",
        });

        setEmail(data.email);
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, []);

  // ======================================================
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
    setValidationErrors((prev) => ({ ...prev, [id]: "" })); // limpiar error al escribir
  };

  // === SUBMIT PERFIL ====================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await userService.updateProfile(formData);
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.detail || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // === SOLICITAR CAMBIO DE EMAIL ========================
  const handleRequestEmailChange = async () => {
    setEmailError("");
    setEmailLoading(true);

    if (!newEmail.trim() || !newEmail.includes("@")) {
      setEmailError("Debes ingresar un correo válido");
      setEmailLoading(false);
      return;
    }

    try {
      await userService.requestEmailChange({ new_email: newEmail });
      setEmailRequested(true);
    } catch (err) {
      setEmailError(err?.response?.data?.detail || "No se pudo solicitar el cambio");
    } finally {
      setEmailLoading(false);
    }
  };

  // === VERIFICAR EMAIL ===================================
  const handleVerifyEmail = async () => {
    setVerifyError("");
    setVerifyLoading(true);

    try {
      await userService.verifyEmailChange({
        new_email: newEmail,
        code: otpCode,
      });

      setEmail(newEmail);
      setEmailRequested(false);
      setNewEmail("");
      setOtpCode("");
    } catch (err) {
      setVerifyError(err?.response?.data?.detail || "Código incorrecto");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <Main>
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Editar mi perfil</h1>

        {/* ================================ */}
        {/* FORMULARIO PRINCIPAL */}
        {/* ================================ */}
        <Card className="p-8 shadow-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* USERNAME */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="username" className="font-semibold">Nombre de usuario</Label>
              <Input id="username" value={formData.username} onChange={handleChange} />

              {validationErrors.username && (
                <p className="text-red-600 text-sm">{validationErrors.username}</p>
              )}
            </div>

            {/* NOMBRE + APELLIDO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <Label htmlFor="first_name">Nombre</Label>
                <Input id="first_name" value={formData.first_name} onChange={handleChange} />
                {validationErrors.first_name && (
                  <p className="text-red-600 text-sm">{validationErrors.first_name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="last_name">Apellido</Label>
                <Input id="last_name" value={formData.last_name} onChange={handleChange} />
                {validationErrors.last_name && (
                  <p className="text-red-600 text-sm">{validationErrors.last_name}</p>
                )}
              </div>
            </div>

            {/* FECHA + TELÉFONO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <BirthdayCalendarInput
                  value={formData.date_of_birth}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, date_of_birth: date }))
                  }
                />
                {validationErrors.date_of_birth && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.date_of_birth}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={formData.phone} onChange={handleChange} />
                {validationErrors.phone && (
                  <p className="text-red-600 text-sm">{validationErrors.phone}</p>
                )}
              </div>
            </div>

            {error && <p className="text-red-600 text-center font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Guardando..." : "Actualizar perfil"}
            </Button>
          </form>
        </Card>

        {/* ================================ */}
        {/* CAMBIO DE EMAIL */}
        {/* ================================ */}
        <Card className="mt-10 p-8 shadow-md">
          <h2 className="text-xl font-bold">Correo electrónico</h2>
          <p className="text-muted">Correo actual: {email}</p>

          {!emailRequested ? (
            <>
              <div className="flex flex-col gap-1">
                <Label>Nuevo correo</Label>
                <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
              </div>

              <Button onClick={handleRequestEmailChange} disabled={emailLoading} className="w-full">
                {emailLoading ? "Enviando código..." : "Solicitar cambio de correo"}
              </Button>
            </>
          ) : (
            <>
              <div>
                <Label>Código de verificación</Label>
                <Input value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                {verifyError && <p className="text-red-600 text-sm">{verifyError}</p>}
              </div>

              <Button onClick={handleVerifyEmail} disabled={verifyLoading} className="w-full">
                {verifyLoading ? "Verificando..." : "Confirmar cambio de correo"}
              </Button>
            </>
          )}
        </Card>
      </div>
    </Main>
  );
};

export default EditAccount;
