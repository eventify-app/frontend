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
  // Consideramos "direct access" cuando la navegación fue 'POP' y no hay state.from ni referrer
  const isDirectLoad = navigationType === "POP" && !cameFromState && !referrer;
  const canGoBack = !isDirectLoad; // muestra botón salvo que sea acceso directo sin referrer/state

  const handleGoBack = () => {
    // Si hay location.state.from, volvemos exactamente a esa ruta
    const from = location.state?.from;
    if (from) {
      if (typeof from === "string") {
        navigate(from);
      } else if (typeof from === "object" && from.pathname) {
        navigate(from.pathname + (from.search || ""));
      } else {
        navigate(-2); // fallback seguro
      }
    } else {
      // fallback: navegamos una entrada atrás en el history
      navigate(-2);
    }
  };

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log(event)

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

      // Mostrar feedback positivo
      setFeedback({ message: "Te has inscrito correctamente", type: "success" });

      // Refrescar participantes
      setEvent(await eventService.getEventById(numericId));

    } catch (err) {
      console.error(err);

      let msg = "Error al inscribirte";
      if (err.response?.status === 400) {
        msg = err.response.data?.detail || "Ya estás inscrito en este evento";
      }

      // Mostrar feedback negativo
      setFeedback({ message: msg, type: "error" });
    }

    // Ocultar feedback después de 5 segundos
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  };

  const [feedback, setFeedback] = useState({ message: "", type: "" }); 

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
  } = event;

  const user = JSON.parse(localStorage.getItem("user"));
  const isOrganizer = user?.id === id_creator?.id;

  const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

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

      <div className="grid grid-cols-[7fr_2fr] w-full gap-6">
      
        <div
          className="w-full h-80 rounded-xl bg-cover bg-center flex flex-col justify-between pt-6 flex-8"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent 40%), url(${cover_image})`,
          }}
        >
          {canGoBack && (
            <Link

              onClick={() => {
                if (!document.startViewTransition) return handleGoBack();

                document.startViewTransition(() => {
                  handleGoBack();
                });
              }}
              className="ml-6 flex items-center shadow-lg gap-2 text-black font-medium py-2 px-3 w-fit rounded-xl bg-gray-100 hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left h-4 w-4 mr-2" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
              Volver
            </Link>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {title}
            </h1>
          </div>
        </div>

      <aside className="sticky top-28 flex-2 h-fit flex flex-col gap-4 rounded-lg bg-background shadow-md p-6 border border-gray-100">

          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users h-5 w-5 text-primary" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
              <p className="font-medium">Asistentes</p>
            </div>

            <p className="font-bold text-2xl">{participants_count}</p>
            
          </div>

          { max_capacity && (
            <div className="flex flex-col gap-1">
            <p className="text-sm text-muted">
              De {max_capacity} cupos disponibles
            </p>

            <div aria-valuemax={max_capacity} aria-valuemin="0" role="progressbar" data-state="indeterminate" data-max="100" data-slot="progress" className="bg-primary/20 relative w-full overflow-hidden rounded-full h-2"><div data-state="indeterminate" data-max="100" data-slot="progress-indicator" className="bg-primary h-full w-full flex-1 transition-all" style={{transform: `translateX(-${participants_count / max_capacity * 100}%)`}}></div></div>

            <p className="text-sm text-muted">{max_capacity - participants_count} cupos restantes</p>
          </div>
          ) }
          
          <button
            onClick={handleEnroll}
            className={`cursor-pointer w-full flex items-center justify-center rounded-lg h-12 px-5 text-base font-bold shadow-lg transition-all transform hover:scale-105
              ${is_enrolled 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-primary text-white hover:bg-primary/90'
              }`}
          >
            {is_enrolled ? 'Dejar de asistir' : 'Asistir'}
          </button>
        </aside>

        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">Detalles del evento</h2>

          <div className="flex items-center gap-6 bg-background p-6 rounded-2xl border shadow-lg">

          <div className="flex flex-1 gap-3 items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-5 w-5 text-primary" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg></div>

            <div className="flex flex-col">
              <h3 className="text-muted text-sm">Fecha</h3>
              <p className="text-md font-semibold">
                {start_date === end_date
                  ? formatDate(start_date)
                  : `${formatDate(start_date)} a ${formatDate(end_date)}`}
              </p>
              <p className="text-md font-semibold">{formatTime(start_time)} - {formatTime(end_time)}</p>
            </div>
          </div>

          <div className="flex flex-1 gap-3 items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-5 w-5 text-purple-600" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
            <div>
              <h3 className="text-muted text-sm">Ubicación</h3>
              <p className="text-md font-semibold">{place}</p>
            </div>
          </div>

          <div className="flex flex-1 gap-3 items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round h-5 w-5 text-pink-600" aria-hidden="true"><path d="M18 20a6 6 0 0 0-12 0"></path><circle cx="12" cy="10" r="4"></circle><circle cx="12" cy="12" r="10"></circle></svg></div>
            <div>
              <h3 className="text-muted text-sm">Organizador</h3>
              <p className="text-md font-semibold">{id_creator?.first_name} {id_creator?.last_name}</p>
            </div>
          </div>
          </div>

        </div>

        <div className="row-start-3 px-6 py-5 bg-card-background rounded-2xl border  shadow-lg gap-3 flex flex-col">
          <h2 className="text-xl font-semibold">Descripción</h2>

          <p className="text-lg">{description}</p>
          <div>

          </div>
        </div>

        {/* Sección de participantes */}
        <div className="row-start-4">
          <ParticipantsSection eventId={numericId} isOrganizer={isOrganizer} />
        </div>

        {/* Sección de comentarios y calificación */}
        <div className="row-start-5">
          <EventFeedback eventId={numericId} userId={user?.id} />
        </div>

      </div>
      </>
      
    </Main>
  );
};

export default EventDetail;