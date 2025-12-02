import { useState, useEffect } from "react";
import { eventService } from "../api/services/eventService";

const Comment = ({ comment, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    await onReply(comment.id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="border-b pb-3 mb-3">
      <p className="font-semibold">{comment.author_name}</p>
      <p className="text-gray-700">{comment.content}</p>

      {/* Botón para responder */}
      <button
        onClick={() => setShowReplyBox(!showReplyBox)}
        className="text-sm text-blue-600 mt-2"
      >
        Responder
      </button>

      {/* Caja de respuesta */}
      {showReplyBox && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="w-full border rounded p-2"
          />
          <button
            onClick={handleReplySubmit}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enviar respuesta
          </button>
        </div>
      )}

      {/* Renderizar respuestas en forma de hilo */}
      {comment.replies?.length > 0 && (
        <div className="ml-6 mt-3 border-l pl-3">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
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
        const participants = await eventService.getParticipants(eventId);
        const me = participants.find((p) => p.user_id === userId);
        setAttended(me?.attended || false);
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

    try {
      await eventService.submitComment(eventId, { content: comment });
      setComment("");
      setError("");
      const updated = await eventService.getComments(eventId);
      setComments(updated);
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      setError("No se pudo enviar tu comentario.");
    }
  };

  // Enviar respuesta a un comentario
  const handleReply = async (parentId, replyText) => {
    if (!attended) {
      setError("Solo puedes responder si asististe al evento.");
      return;
    }

    try {
      await eventService.submitComment(eventId, {
        content: replyText,
        parent_id: parentId,
      });
      setError("");
      const updated = await eventService.getComments(eventId);
      setComments(updated);
    } catch (err) {
      console.error("Error al enviar respuesta:", err);
      setError("No se pudo enviar tu respuesta.");
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
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tu opinión</h2>

      {/* Caja de comentarios */}
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

      {/* Caja de rating */}
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
      <h3 className="text-lg font-semibold text-gray-700 mt-8 mb-4">
        Comentarios recientes
      </h3>
      <div>
        {comments.map((c) => (
          <Comment key={c.id} comment={c} onReply={handleReply} />
        ))}
      </div>
    </section>
  );
}