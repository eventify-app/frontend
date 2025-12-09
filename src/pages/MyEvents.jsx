import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import EventCard from "../components/EventCard";
import { eventService } from "../api/services/eventService";
import { ChartPieInteractive } from "../components/ChartPieInteractive";
import { ChartBarStacked } from "../components/ChartBarStacked";

const MyEvents = () => {
  const navigate = useNavigate();

  // Estadísticas
  const [myStats, setMyStats] = useState(null);
  const [attendeeStats, setAttendeeStats] = useState(null);

  const fetchStats = async () => {
    try {
      const stats = await eventService.getMyStats();
      const attendee = await eventService.getMyAttendeeStats();

      // NUEVO: attendees por categoría
      const categoryStats = await eventService.getAttendeesByCategory();

      setMyStats(stats);
      setAttendeeStats(attendee);

      setAttendeesByCategory(categoryStats);   // <<–– guardar datos

      const popular = await eventService.getMyPopularEvents();
      setPopularEvents(popular);
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    }
  };

  const [popularEvents, setPopularEvents] = useState([]);


  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Paginación
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);

  const [attendeesByCategory, setAttendeesByCategory] = useState([]);

  

  // 🔹 Modal eliminación
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Cargar eventos con paginación
  const fetchMyEvents = async (url = "/events/my-events/") => {
    try {
      const data = await eventService.list(url);

      setEvents(
        data.results.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          place: event.place,
          start_date: event.start_date,
          start_time: event.start_time,
          end_date: event.end_date,
          end_time: event.end_time,
          image: event.cover_image,
          max_capacity: event.max_capacity,
          participants_count: event.participants_count
        }))
      );

      setNextPage(data.next);
      setPrevPage(data.previous);
      setCount(data.count);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar tus eventos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
    fetchStats();
  }, []);

  const totalEvents = myStats?.total_events || 0;
  const totalAttendees = attendeeStats?.total_attendees || 0;

  const averageAttendees =
    totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;

  const eventsLastMonth = myStats?.events_last_month || 0;
  const attendeesLastMonth = attendeeStats?.attendees_last_month || 0;

    const eventsPercent = totalEvents > 0
    ? Math.round((eventsLastMonth / totalEvents) * 100)
    : 0;

  const attendeesPercent = totalAttendees > 0
    ? Math.round((attendeesLastMonth / totalAttendees) * 100)
    : 0;


  const handlePageChange = (url) => {
    if (url) {
      fetchMyEvents(url);
      // Scroll al elemento referenciado
      setTimeout(() => {
        window.scrollTo({
          top: 0, // 50px arriba del elemento
          behavior: 'smooth'
        });
    }, 100);
    }
  };

  // 🔹 Editar evento
  const handleEdit = (event) => {
    navigate("/create-event", { state: { eventToEdit: event } });
  };

  // 🔹 Eliminar evento
  const confirmDelete = (id) => {
    setEventToDelete(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (eventToDelete !== null) {
      try {
        await eventService.deleteEvent(eventToDelete);
        setEvents((prev) => prev.filter((e) => e.id !== eventToDelete));
      } catch (err) {
        console.error(err);
        alert("Error al eliminar el evento.");
      } finally {
        setEventToDelete(null);
        setShowModal(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
    setShowModal(false);
  };

  const handleCreate = () => {
    navigate("/create-event");
  };

  // 🔹 Loading
  if (loading) {
    return (
      <Main>
        <div className="text-center py-10">Cargando tus eventos...</div>
      </Main>
    );
  }

  // 🔹 Error
  if (error) {
    return (
      <Main>
        <div className="text-center text-red-600 py-10">{error}</div>
      </Main>
    );
  }

  return (
    <Main>
      

      <div className="w-full flex flex-col max-w-6xl h-full justify-center mx-auto gap-4 px-3">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 text-center">Mis Eventos</h1>
          <div className="mb-6 text-center">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary/70 transition cursor-pointer"
            >
              Crear Evento
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-card-background flex p-7 gap-3 border rounded-xl">
            <div>
              <p className="text-muted">Total de eventos</p>
              <p  className="text-3xl font-bold">{totalEvents}</p>

              <span data-slot="badge" class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&amp;]:hover:bg-primary/90 mt-3 bg-green-500 text-white">{eventsPercent}% este mes</span>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-6 w-6 text-indigo-600" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg></div>
          </div>

          <div className="bg-card-background flex p-7 gap-3 border rounded-xl">
            <div>
              <p className="text-muted">Total de asistentes</p>
              <p className="text-3xl font-bold">{totalAttendees}</p>

              <span data-slot="badge" class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;&gt;svg]:size-3 gap-1 [&amp;&gt;svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&amp;]:hover:bg-primary/90 mt-3 bg-green-500 text-white">{attendeesPercent}% este mes</span>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-6 w-6 text-purple-600" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg></div>
          </div>

          <div className="bg-card-background flex p-7 gap-3 border rounded-xl">
            <div>
              <p className="text-muted">Promedio por evento</p>
              <p  className="text-3xl font-bold">{averageAttendees}</p>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chart-column h-6 w-6 text-pink-600" aria-hidden="true"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg></div>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <ChartPieInteractive data={attendeesByCategory} />

          <ChartBarStacked data={popularEvents} />
        </div>
        
        {events.length === 0 ? (
          <p className="text-gray-500 flex-1 flex items-center justify-center h-full">
            No tienes eventos registrados.
          </p>
        ) : (
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.start_date}
                  location={event.place}
                  image={event.image}
                  showOwnerActions={true}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => confirmDelete(event.id)}
                  max_capacity={event.max_capacity}
                  participants={event.participants_count}
                />
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={!prevPage}
                onClick={() => handlePageChange(prevPage)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  prevPage
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                ← Anterior
              </button>

              <span className="text-sm text-gray-600">
                Mostrando {events.length} de {count} eventos
              </span>

              <button
                disabled={!nextPage}
                onClick={() => handlePageChange(nextPage)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  nextPage
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">
              ¿Deseas eliminar este evento?
            </h2>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
              >
                Sí, eliminar
              </button>
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Main>
  );
};

export default MyEvents;
