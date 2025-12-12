import { useEffect, useState } from "react";
import { eventService } from "../api/services/eventService";
import { BACKEND_URL } from "@/api/axiosInstance";
import { Link } from "react-router-dom"; // Importa Link

export default function ParticipantsSection({ eventId, isOrganizer }) {
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const data = await eventService.getParticipants(eventId);
        setParticipants(data);
        setError(false);
      } catch (err) {
        console.error("Error al cargar participantes:", err);
        setError("No se pudieron cargar los participantes");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]);

  const marcarAsistencia = async (participantId) => {
    try {
      await eventService.markAttendance(eventId, participantId);

      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, attended: true } : p
        )
      );
    } catch (err) {
      console.error("Error al marcar asistencia:", err);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">
        Participantes ({participants.length})
      </h2>

      {loading && <p className="text-gray-500">Cargando participantes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && participants.length === 0 && (
        <p className="text-gray-500">No hay participantes registrados para este evento.</p>
      )}

      <ul className="space-y-4">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center gap-4">
            {/* Envolvemos el avatar con Link */}
            <Link to={`/profile/${p.id}`}>
              <img
                src={ p.profile_photo || "/assets/avatar-profile.png"}
                className="w-12 h-12 rounded-full object-cover border"
                alt="avatar"
              />
            </Link>

            {/* Envolvemos el nombre con Link */}
            <Link to={`/profile/${p.id}`} className="text-muted">
              {p.first_name} {p.last_name}
            </Link>

            {isOrganizer && !p.attended && (
              <button
                onClick={() => marcarAsistencia(p.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Marcar asistencia
              </button>
            )}

            {p.attended && (
              <span className="text-green-600 font-semibold ml-2">✅ Asistió</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
