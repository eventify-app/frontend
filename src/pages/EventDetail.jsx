// src/pages/EventDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { eventService } from "../api/services/eventService";
import ParticipantsSection from "../pages/ParticipantsSection";
import EventFeedback from "../pages/EventFeedback";
import Main from "../layouts/Main";

const EventDetail = () => {
  const { id } = useParams();
  const numericId = Number(id);

  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const cameFromState = Boolean(location.state && location.state.from);
  const referrer = typeof document !== "undefined" ? document.referrer : "";
  const isDirectLoad = navigationType === "POP" && !cameFromState && !referrer;
  const canGoBack = !isDirectLoad;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const handleGoBack = () => {
    const from = location.state?.from;
    if (from) {
      if (typeof from === "string") return navigate(from);
      if (typeof from === "object" && from.pathname) return navigate(from.pathname + (from.search || ""));
      return navigate(-2);
    }
    navigate(-2);
  };

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
      // Ajusta aquí si tienes endpoints separados para inscribir/desinscribir
      setFeedback({ message: "Te has inscrito correctamente", type: "success" });
      const refreshed = await eventService.getEventById(numericId);
      setEvent(refreshed);
    } catch (err) {
      console.error(err);
      let msg = "Error al inscribirte";
      if (err.response?.status === 400) {
        msg = err.response?.data?.detail || "Ya estás inscrito en este evento";
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
        <div className="text-center text-red-500 py-20">{error || "No se encontró el evento."}</div>
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
    attendees,       // opcional según backend
    user_attended,   // opcional según backend
  } = event;

  const user = JSON.parse(localStorage.getItem("user"));
  const isOrganizer = user?.id === id_creator?.id;

  const attendedFromList = Array.isArray(attendees) && user?.id
    ? attendees.some((a) => a.id === user.id || a.user_id === user.id)
    : false;
  const userAttendedFlag = typeof user_attended === "boolean" ? user_attended : attendedFromList;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    const date = new Date(`1970-01-01T${timeStr}`);
    return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  const capacityPct =
    max_capacity && max_capacity > 0
      ? Math.min(100, Math.max(0, ((participants_count ?? 0) / max_capacity) * 100))
      : 0;

  return (
    <Main>
      <div className="grid grid-cols-[7fr_2fr] w-full gap-6 px-6 py-6">
        {/* Feedback */}
        {feedback.message && (
          <div
            className={`col-span-2 w-full p-3 rounded-lg font-semibold text-center
              ${feedback.type === "success" ? "bg-green-200 text-green-700" : "bg-red-300 text-red-800"}`}
          >
            {feedback.message}
          </div>
        )}

        {/* Portada */}
        <div
          className="col-span-2 w-full h-80 rounded-xl bg-cover bg-center flex flex-col justify-between pt-6"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent 40%), url(${cover_image})`,
          }}
        >
          {canGoBack && (
            <Link
              onClick={() => {
                if (!document.startViewTransition) return handleGoBack();
                document.startViewTransition(() => handleGoBack());
              }}
              className="ml-6 flex items-center shadow-lg gap-2 text-black font-medium py-2 px-3 w-fit rounded-xl bg-gray-100 hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-arrow-left h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Volver
            </Link>
          )}
          <div className="p-6 md:p-8">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Aside: asistentes + capacidad + botón */}
        <aside className="sticky top-28 h-fit flex flex-col gap-4 rounded-lg bg-background shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lucide lucide-users h-5 w-5 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <p className="font-medium">Asistentes</p>
            </div>
            <p className="font-bold text-2xl">{participants_count ?? 0}</p>
          </div>

          {typeof max_capacity === "number" && max_capacity > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted">De {max_capacity} cupos disponibles</p>
              <div
                className="bg-primary/20 relative w-full overflow-hidden rounded-full h-2"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={capacityPct}
              >
                <div className="bg-primary h-full transition-all" style={{ width: `${capacityPct}%` }} />
              </div>
              <p className="text-sm text-muted">
                {Math.max(max_capacity - (participants_count ?? 0), 0)} cupos restantes
              </p>
            </div>
          )}

          {!isOrganizer && (
            <button
              onClick={handleEnroll}
              className={`cursor-pointer w-full flex items-center justify-center rounded-lg h-12 px-5 text-base font-bold shadow-lg transition-all transform hover:scale-105
                ${is_enrolled ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-white hover:bg-primary/90"}`}
            >
              {is_enrolled ? "Dejar de asistir" : "Asistir"}
            </button>
          )}
        </aside>

        {/* Detalles del evento */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">Detalles del evento</h2>

          <div className="flex items-center gap-6 bg-background p-6 rounded-2xl border shadow-lg">
            {/* Fecha */}
            <div className="flex flex-1 gap-3 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-calendar h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-muted text-sm">Fecha</h3>
                <p className="text-md font-semibold">
                  {start_date && end_date && start_date === end_date
                    ? formatDate(start_date)
                    : `${formatDate(start_date)} a ${formatDate(end_date)}`}
                </p>
                <p className="text-md font-semibold">
                  {formatTime(start_time)} - {formatTime(end_time)}
                </p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex flex-1 gap-3 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-map-pin h-5 w-5 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-muted text-sm">Ubicación</h3>
                <p className="text-md font-semibold">{place || "-"}</p>
              </div>
            </div>

            {/* Organizador */}
            <div className="flex flex-1 gap-3 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-circle-user-round h-5 w-5 text-pink-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 20a6 6 0 0 0-12 0"></path>
                  <circle cx="12" cy="10" r="4"></circle>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-muted text-sm">Organizador</h3>
                <p className="text-md font-semibold">
                  {id_creator?.first_name} {id_creator?.last_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="row-start-3 px-6 py-5 bg-card-background rounded-2xl border shadow-lg gap-3 flex flex-col">
          <h2 className="text-xl font-semibold">Descripción</h2>
          <p className="text-lg">{description}</p>
        </div>

        {/* Participantes */}
        <div className="row-start-4">
          <ParticipantsSection eventId={numericId} isOrganizer={isOrganizer} />
        </div>

        {/* Comentarios y calificación (solo asistentes) */}
        <div className="row-start-5">
          {userAttendedFlag ? (
            <EventFeedback eventId={numericId} userId={user?.id} />
          ) : (
            <p className="text-gray-500 mt-4">
              Solo los asistentes pueden comentar o calificar este evento.
            </p>
          )}
        </div>
      </div>
    </Main>
  );
};

export default EventDetail;