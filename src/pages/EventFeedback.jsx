import { useState, useEffect } from "react";
import { eventService } from "../api/services/eventService";

export default function EventFeedback({ eventId, userId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [attended, setAttended] = useState(false);
  const [error, setError] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    if (!eventId || !userId) return;

    const fetchComments = async () => {
      try {
        const data = await eventService.getComments(eventId);
        setComments(data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
        setError("No se pudieron cargar los comentarios.");
      }
    };

    const checkAttendance = async () => {
      try {
        const participants = await eventService.getParticipants(eventId);
        const me = participants.find((p) => p.id === userId);
        setAttended(me?.attended || false);
      } catch (err) {
        console.error("Error al verificar asistencia:", err);
        setError("No se pudo verificar tu asistencia.");
      }
    };

    fetchComments();
    checkAttendance();
  }, [eventId, userId]);

  const handleRating = async () => {
    if (!attended) {
      setError("Solo puedes calificar si asististe al evento.");
      return;
    }

    try {
      if (rating > 0) {
        await eventService.submitRating(eventId, rating);
        setError("");
        setShowRatingModal(false);
        const updated = await eventService.getComments(eventId);
        setComments(updated);
      }
    } catch (err) {
      console.error("Error al enviar calificación:", err);
      setError("No se pudo enviar tu calificación.");
    }
  };

  const handleComment = async (parentId = null) => {
    if (!attended) {
      setError("Solo puedes comentar si asististe al evento.");
      return;
    }

    try {
      if (comment.trim()) {
        await eventService.submitComment(eventId, comment, parentId);
        setComment("");
        setError("");
        const updated = await eventService.getComments(eventId);
        setComments(updated);
      }
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      setError("No se pudo enviar tu comentario.");
    }
  };

  return (
    <section className="mt-12 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tu opinión</h2>

      {/* Botón para abrir modal de calificación */}
      <div className="mb-6">
        <button
          onClick={() => setShowRatingModal(true)}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Calificar evento
        </button>
      </div>

      {/* Modal de calificación */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Selecciona tu calificación
            </h3>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleRating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bloque de comentarios */}
      <div className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe tu comentario..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleComment()}
          className="mt-3 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
        >
          Publicar
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
        Comentarios recientes
      </h3>
      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="border-b pb-3">
            <div className="flex items-center gap-2 mb-1">
              <strong className="text-gray-800">{c.user?.username}</strong>
            </div>
            <p className="text-gray-700">{c.comment}</p>
            <button
              onClick={() => setComment(`@${c.user?.username} `)}
              className="text-blue-600 text-sm hover:underline mt-1"
            >
              Responder
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}