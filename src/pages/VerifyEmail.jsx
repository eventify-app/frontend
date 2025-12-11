import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance"; // tu instancia axios

export default function VerifyEmail() {
  const [message, setMessage] = useState("Verificando tu cuenta...");
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    console.log("uid:", uid, "token:", token); // 🔍 Debug

    if (!uid || !token) {
      setError(true);
      setMessage("Token inválido o faltante.");
      return;
    }

    axios
      .post("/users/verify-email/", { uid, token })
      .then(() => {
        setMessage("¡Tu correo ha sido verificado correctamente!");
        setError(false);
        // Redirigir al login después de 3 segundos
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => {
        setError(true);
        setMessage("El token es inválido o ha expirado.");
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className={`p-6 rounded-lg shadow-md max-w-md text-center ${
          error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}
      >
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
}
