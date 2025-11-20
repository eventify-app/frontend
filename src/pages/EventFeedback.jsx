import { useState, useEffect } from "react";
import { eventService } from "../api/services/eventService";

export default function EventFeedback({ eventId, userId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [attended, setAttended] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await eventService.getComments(eventId);
        setComments(data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }
    };

    const checkAttendance = async () => {
      try {
        const participants = await eventService.getParticipants(eventId);
        const me = participants.find((p) => p.id === userId);
        setAttended(me?.attended || false);
      } catch (err) {
        console.error("Error al verificar asistencia:", err);
      }
    };

    fetchComments();
    checkAttendance();
  }, [eventId, userId]);

  const handleSubmit = async () => {
    if (!attended) {
      setError("Solo puedes calificar si asististe al evento.");
      return;
    }

    try {
      await eventService.submitComment(eventId, { rating, comment });
      setComment("");
      setRating(0);
      setError("");
      const updated = await eventService.getComments(eventId);
      setComments(updated);
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      setError("No se pudo enviar tu comentario.");
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tu opinión</h2>

      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "text-yellow-500" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Enviar
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">
        Comentarios recientes
      </h3>
      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="border-b pb-2">
            <div className="flex items-center gap-2">
              <strong>{c.user_name}</strong>
              <span className="text-yellow-500">{`★`.repeat(c.rating)}</span>
            </div>
            <p className="text-gray-700">{c.comment}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}