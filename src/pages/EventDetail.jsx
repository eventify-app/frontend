import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { eventService } from "../api/services/eventService";
import ParticipantsSection from "../pages/ParticipantsSection";
import Main from "../layouts/Main";

const EventDetail = () => {
  const { id } = useParams();
  const numericId = parseInt(id);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <Main>
        <div className="text-center text-gray-600 py-20">Cargando evento...</div>
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
  } = event;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeStr) =>
    new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Main>
      <div className="max-w-5xl mx-auto">
        {/* Imagen principal */}
        <div
          className="w-full h-64 md:h-80 lg:h-96 rounded-xl bg-cover bg-center flex flex-col justify-end"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.6), transparent 40%), url(${cover_image})`,
          }}
        >
          <div className="p-6 md:p-8">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2">
            <p className="text-gray-700 leading-relaxed">{description}</p>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detalles del evento
              </h3>
              <div className="border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatDate(start_date)}
                    </dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Hora</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {formatTime(start_time)} - {formatTime(end_time)}
                    </dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Lugar</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{place}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500">Organizador</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {id_creator?.first_name} {id_creator?.last_name} ({id_creator?.username})
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-lg bg-white shadow-md p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  ¿Te interesa asistir?
                </h3>
                <button className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-primary text-white text-base font-bold shadow-lg hover:bg-primary/90 transition-all transform hover:scale-105">
                  Asistir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de participantes */}
        <div className="mt-12">
          <ParticipantsSection eventId={numericId} />
        </div>
      </div>
    </Main>
  );
};

export default EventDetail;