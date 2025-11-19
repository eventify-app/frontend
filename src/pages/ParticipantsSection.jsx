import { useState, useEffect } from "react";
import { eventService } from "../api/services/eventService";

const ParticipantsSection = ({ eventId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId || isNaN(eventId)) {
      setError("ID de evento inválido.");
      setLoading(false);
      return;
    }

    const fetchParticipants = async () => {
      try {
        const data = await eventService.getParticipants(eventId);
        setParticipants(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los participantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [eventId]);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Participantes ({participants.length})
      </h2>

      {loading && <p className="text-gray-500">Cargando participantes...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && participants.length === 0 && (
        <p className="text-gray-500">
          No hay participantes registrados para este evento.
        </p>
      )}

      <ul className="space-y-4">
        {participants.map((p) => (
          <li key={p.id} className="flex items-center gap-4">
            <img
              src={
                p.photo_url && p.photo_url.startsWith("http")
                  ? p.photo_url
                  : "/default-avatar.png"
              }
              alt={p.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <span className="text-gray-800">{p.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ParticipantsSection;