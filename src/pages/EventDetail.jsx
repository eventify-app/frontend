import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { eventService } from "../api/services/eventService";
import ParticipantsSection from "../pages/ParticipantsSection";
import EventFeedback from "../pages/EventFeedback";
import Main from "../layouts/Main";

const EventDetail = () => {
  const { id } = useParams();
  const numericId = parseInt(id);

  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const cameFromState = Boolean(location.state && location.state.from);
  const referrer = (typeof document !== "undefined" && document.referrer) ? document.referrer : "";
  const isDirectLoad = navigationType === "POP" && !cameFromState && !referrer;
  const canGoBack = !isDirectLoad;

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const openReportModal = () => {
    setReportReason("");
    setShowReportModal(true);
  };

  const submitEventReport = async () => {
    if (!reportReason.trim()) return;

    const formData = new FormData();
    formData.append("reason", reportReason);

    try {
      await eventService.reportEvent(numericId, formData);

      setShowReportModal(false);
      setFeedback({ message: "Reporte enviado correctamente", type: "success" });
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Error al enviar el reporte", type: "error" });
    }

    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const handleGoBack = () => {
    const from = location.state?.from;
    if (from) {
      if (typeof from === "string") {
        navigate(from);
      } else if (typeof from === "object" && from.pathname) {
        navigate(from.pathname + (from.search || ""));
      } else {
        navigate(-2);
      }
    } else {
      navigate(-2);
    }
  };

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventById(numericId);
        setEvent(res);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el evento.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [numericId]);

  const handleEnroll = async () => {
    try {
      await eventService.enroll(numericId);
      setFeedback({ message: "Te has inscrito correctamente", type: "success" });

      const updated = await eventService.getEventById(numericId);
      setEvent(updated);

    } catch (err) {
      console.error(err);

      let msg = "Error al inscribirte.";
      if (err.response?.status === 400) {
        msg = err.response.data?.detail || "Ya estás inscrito en este evento";
      }
      setFeedback({ message: msg, type: "error" });
    }

    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  if (loading) {
    return (
      <Main>
        <div className="text-center text-muted py-20">Cargando evento...</div>
      </Main>
    );
  }

  if (error || !event) {
    return (
      <Main>
        <div className="text-center text-red-500 py-20">{error}</div>
      </Main>
    );
  }

  const {
    title,
    description,
    place,
    cover_image,
    start_date,
    start_time,
    end_date,
    end_time,
    id_creator,
    max_capacity,
    participants_count,
    is_enrolled,
    is_upcoming,
    is_ongoing,
    is_finished,
  } = event;

  const user = JSON.parse(localStorage.getItem("user"));
  const isOrganizer = user?.id === id_creator?.id;

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderActionButton = () => {
    if (isOrganizer) {
      if (is_upcoming) {
        return (
          <button
            onClick={() => navigate("/create-event", { state: { eventToEdit: event } })}
            className="cursor-pointer w-full flex items-center justify-center rounded-lg h-12 px-5 text-base font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
          >
            Editar evento
          </button>
        );
      }

      if (is_ongoing) {
        return (
          <button
            disabled
            className="w-full rounded-lg h-12 px-5 text-base font-bold bg-yellow-500 text-white cursor-not-allowed shadow-lg"
          >
            En curso
          </button>
        );
      }

      return (
        <button
          disabled
          className="w-full rounded-lg h-12 px-5 text-base font-bold bg-gray-400 text-white cursor-not-allowed shadow-lg"
        >
          Finalizado
        </button>
      );
    }

    if (is_upcoming) {
      return (
        <button
          onClick={handleEnroll}
          className={`cursor-pointer w-full flex items-center justify-center rounded-lg h-12 px-5 text-base font-bold shadow-lg hover:scale-105 transition-all
            ${is_enrolled ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-white hover:bg-primary/90"}
          `}
        >
          {is_enrolled ? "Dejar de asistir" : "Asistir"}
        </button>
      );
    }

    if (is_ongoing) {
      return (
        <button
          onClick={() => console.log("Marcar asistencia")}
          className="cursor-pointer w-full rounded-lg h-12 px-5 text-base font-bold bg-yellow-500 text-black hover:bg-yellow-600 shadow-lg"
        >
          Marcar asistencia
        </button>
      );
    }

    return (
      <button
        disabled
        className="w-full rounded-lg h-12 px-5 text-base font-bold bg-gray-400 text-white cursor-not-allowed shadow-lg"
      >
        Finalizado
      </button>
    );
  };

  return (
    <Main>
      <>
        {feedback.message && (
          <div
            className={`w-full p-3 rounded-lg font-semibold text-center
              ${feedback.type === "success" ? "bg-green-200 text-green-700" : "bg-red-300 text-red-800"}`}
          >
            {feedback.message}
          </div>
        )}

        {/* Contenedor principal responsive */}
        <div className="flex flex-col lg:grid lg:grid-cols-[7fr_2fr] w-full gap-6">
        
          {/* Header con imagen de portada */}
          <div
            className="w-full h-64 md:h-80 rounded-xl bg-cover bg-center flex flex-col justify-between pt-4 md:pt-6"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent 40%), url(${cover_image})`,
            }}
          >
            {/* Botones superiores */}
            <div className="flex justify-between px-4 md:pr-5">
              {canGoBack && (
                <Link
                  onClick={() => {
                    if (!document.startViewTransition) return handleGoBack();
                    document.startViewTransition(() => handleGoBack());
                  }}
                  className="flex items-center shadow-lg gap-2 text-black font-medium py-2 px-3 w-fit rounded-xl bg-gray-100 hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="M19 12H5"></path>
                  </svg>
                  <span className="hidden sm:inline">Volver</span>
                </Link>
              )}

              <button
                onClick={openReportModal}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all cursor-pointer text-sm md:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                <span className="hidden sm:inline">Reportar</span>
              </button>
            </div>
            
            {/* Título del evento */}
            <div className="p-4 md:p-6 lg:p-8">
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight">
                {title}
              </h1>
            </div>
          </div>

          {/* Sidebar - se mueve debajo en mobile */}
          <aside className="lg:sticky lg:top-28 h-fit flex flex-col gap-4 rounded-lg bg-background shadow-md p-4 md:p-6 border border-gray-100 mt-6 lg:mt-0">

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <p className="font-medium">Asistentes</p>
              </div>

              <p className="font-bold text-xl md:text-2xl">{participants_count}</p>
            </div>

            {max_capacity && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted">
                  De {max_capacity} cupos disponibles
                </p>

                <div 
                  aria-valuemax={max_capacity} 
                  aria-valuemin="0" 
                  role="progressbar" 
                  className="bg-primary/20 relative w-full overflow-hidden rounded-full h-2"
                >
                  <div 
                    className="bg-primary h-full w-full flex-1 transition-all" 
                    style={{ 
                      width: `${(participants_count / max_capacity) * 100}%`,
                      transform: `translateX(-${100 - (participants_count / max_capacity) * 100}%)`
                    }}
                  ></div>
                </div>

                <p className="text-sm text-muted">{max_capacity - participants_count} cupos restantes</p>
              </div>
            )}

            {/* Botón de acción principal */}
            {renderActionButton()}

          </aside>

          {/* Detalles del evento */}
          <div className="flex flex-col gap-4 mt-6 lg:mt-0">
            <h2 className="text-2xl md:text-3xl font-semibold">Detalles del evento</h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 bg-background p-4 md:p-6 rounded-2xl border shadow-lg">

              {/* Fecha */}
              <div className="flex flex-1 gap-3 items-center w-full sm:w-auto">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-indigo-100 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M8 2v4"></path><path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-muted text-xs md:text-sm">Fecha</h3>
                  <p className="text-sm md:text-base font-semibold">
                    {start_date === end_date
                      ? formatDate(start_date)
                      : `${formatDate(start_date)} a ${formatDate(end_date)}`}
                  </p>
                  <p className="text-sm md:text-base font-semibold">
                    {formatTime(start_time)} - {formatTime(end_time)}
                  </p>
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex flex-1 gap-3 items-center w-full sm:w-auto">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-purple-100 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>

                <div>
                  <h3 className="text-muted text-xs md:text-sm">Ubicación</h3>
                  <p className="text-sm md:text-base font-semibold">{place}</p>
                </div>
              </div>

              {/* Organizador */}
              <div className="flex flex-1 gap-3 items-center w-full sm:w-auto">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-pink-100 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600">
                    <path d="M18 20a6 6 0 0 0-12 0"></path>
                    <circle cx="12" cy="10" r="4"></circle>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>

                <div>
                  <h3 className="text-muted text-xs md:text-sm">Organizador</h3>
                  <p className="text-sm md:text-base font-semibold">{id_creator?.first_name} {id_creator?.last_name}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Descripción */}
          <div className="px-4 md:px-6 py-4 md:py-5 md:row-start-3 bg-card-background rounded-2xl border shadow-lg gap-3 flex flex-col mt-6 lg:mt-0">
            <h2 className="text-lg md:text-xl font-semibold">Descripción</h2>
            <p className="text-base md:text-lg">{description}</p>
          </div>

          {/* Sección de participantes */}
          <div className="mt-6 md:row-start-4 lg:mt-0">
            <ParticipantsSection eventId={numericId} isOrganizer={isOrganizer} />
          </div>

          {/* Feedback (si el evento finalizó) */}
          {true && (
            <div className="mt-6 md:row-start-5 lg:mt-0">
              <EventFeedback eventId={numericId} userId={user?.id} isOrganizer={isOrganizer} />
            </div>
          )}

        </div>

        {/* Modal de reporte */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card-background w-full max-w-md p-4 md:p-6 rounded-xl shadow-xl">

              <h3 className="text-lg md:text-xl font-semibold mb-3">Reportar evento</h3>
              <p className="text-xs md:text-sm mb-3">
                Cuéntanos la razón por la que consideras este evento inapropiado.
              </p>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Escribe aquí..."
                className="w-full border rounded p-3 h-28 mb-4 text-sm md:text-base"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-2 bg-background rounded cursor-pointer text-sm md:text-base"
                >
                  Cancelar
                </button>

                <button
                  onClick={submitEventReport}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer text-sm md:text-base"
                >
                  Enviar reporte
                </button>
              </div>
            </div>
          </div>
        )}

      </>
    </Main>
  );
};

export default EventDetail;