import { useState, useEffect } from "react";
import { eventService } from "../api/services/eventService";

import { RatingStars } from "../components/Rating";
import { Button } from "@/components/ui/button";

const Comment = ({ comment, onReport }) => {
  // Extraemos las iniciales del autor
  const initials = comment.author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Usamos el perfil si está disponible, sino usamos las iniciales
  const profileImage = comment.profile_photo || null;

  return (
    <div className="flex gap-3 p-3 bg-card-background shadow-sm rounded-xl mb-4 border">
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
        {/* Si hay imagen de perfil, la mostramos, si no, mostramos las iniciales */}
        {profileImage ? (
          <img
            src={profileImage}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold">{comment.author}</p>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>

            <button
              onClick={() => onReport(comment)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Reportar
            </button>
          </div>
        </div>

        <p className="text-lg">{comment.content}</p>
      </div>
    </div>
  );
};

export default function EventFeedback({ eventId, userId, isOrganizer }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [attended, setAttended] = useState(false);
  const [error, setError] = useState("");

  // Modal Reporte
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await eventService.getComments(eventId);
        setComments(data);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }

      try {
        const data = await eventService.getParticipants(eventId);
        const participants = data.results || data;
        const me = participants.find((p) => p.id === userId);
        setAttended(me?.attended === true);
      } catch (err) {
        console.error("Error al verificar asistencia:", err);
      }
    };

    loadData();
  }, [eventId, userId]);

  // Comentar
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

      const updated = await eventService.getComments(eventId);
      setComments(updated);
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      setError("No se pudo enviar tu comentario.");
    }
  };

  // Rating
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

  // Abrir modal reporte
  const handleOpenReport = (comment) => {
    setSelectedComment(comment);
    setReason("");
    setShowModal(true);
  };

  // Enviar reporte
  const handleSubmitReport = async () => {
    if (!reason.trim()) return;

    try {
      await eventService.reportComment(eventId, selectedComment.id, {
        reason,
      });

      setShowModal(false);
      setReason("");

      const updated = await eventService.getComments(eventId);
      setComments(updated);
    } catch (err) {
      console.error("Error al reportar comentario:", err);
    }
  };

  return (
    <section>
      {/* 🔥 Ocultar si es el organizador */}
      {!isOrganizer && (
        <>
          <h2 className="text-2xl font-bold mb-4">Tu opinión</h2>

          {/* Comentarios */}
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="w-full border rounded p-2"
            />

            <Button onClick={handleSubmitComment} className="mt-4 w-fit">
              Enviar comentario
            </Button>
          </div>

          {/* Rating */}
          <div className="mb-6 bg-card-background border p-5 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-2 text-lg">Califica este evento</h3>

            <RatingStars rating={rating} onChange={setRating} />

            <Button
              onClick={handleSubmitRating}
              className="mt-4 w-fit"
              disabled={!rating}
            >
              Enviar calificación
            </Button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      )}

      {/* Lista de comentarios */}
      <h3 className="text-lg font-semibold mt-8 mb-4">Comentarios recientes</h3>

      <div>
        {comments.map((c) => (
          <Comment key={c.id} comment={c} onReport={handleOpenReport} />
        ))}
      </div>

      {/* Modal Reporte */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card-background p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Reportar comentario
            </h3>

            <p className="text-sm mb-3">
              Estás reportando el comentario de <b>{selectedComment?.author}</b>
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Escribe la razón del reporte..."
              className="w-full border rounded p-2 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 bg-background rounded cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmitReport}
                className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded hover:bg-red-700"
              >
                Enviar reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
