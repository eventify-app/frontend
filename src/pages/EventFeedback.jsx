import { useState, useEffect } from "react";
import { eventService } from "../api/services/eventService";

const Comment = ({ comment }) => {
  // Sacamos iniciales para el avatar si no hay foto
  const initials = comment.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex gap-3 p-3 bg-card-background shadow-sm rounded-xl mb-4 border">
      {/* Avatar genérico */}
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
        {initials}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{comment.author}</p>
          <span className="text-xs text-muted">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>

        <p className="text-lg">{comment.content}</p>
      </div>
    </div>
  );
};



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
        const data = await eventService.getParticipants(eventId);

        const participants = data.results || data; // soporte para paginator o lista directa

        const me = participants.find((p) => p.id === userId);

        setAttended(me?.attended === true);
      } catch (err) {
        console.error("Error al verificar asistencia:", err);
      }
    };

    fetchComments();
    checkAttendance();
  }, [eventId, userId]);

  // Enviar comentario principal
  const handleSubmitComment = async () => {
    if (!attended) {
      setError("Solo puedes comentar si asististe al evento.");
      return;
    }

    if (!comment.trim()) return;

    try {
      await eventService.submitComment(eventId, { content: comment });
      setComment("");
      setError("");

      // refrescar lista
      const updated = await eventService.getComments(eventId);
      setComments(updated);
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      setError("No se pudo enviar tu comentario.");
    }
  };

  // Enviar rating
  const handleSubmitRating = async () => {
    if (!attended) {
      setError("Solo puedes calificar si asististe al evento.");
      return;
    }

    try {
      await eventService.createEventRating(eventId, { score: rating });
      setRating(0);
      setError("");
    } catch (err) {
      console.error("Error al enviar rating:", err);
      setError("No se pudo enviar tu calificación.");
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Tu opinión</h2>

      {/* Comentarios */}
      <div className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleSubmitComment}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Enviar comentario
        </button>
      </div>

      {/* Rating */}
      <div className="mb-6">
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

        <button
          onClick={handleSubmitRating}
          className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Enviar calificación
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Lista de comentarios */}
      <h3 className="text-lg font-semibold mt-8 mb-4">
        Comentarios recientes
      </h3>

      <div>
        {comments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))}
      </div>
    </section>
  );
}
