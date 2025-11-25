import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import EventCard from "../components/EventCard";
import { eventService } from "../api/services/eventService";

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);

  // 🔹 Cargar eventos personales con paginación
  const fetchMyEvents = async (url = "events/my-events/") => {
    try {
      const data = await eventService.list(url);
      const formatted = data.results.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        place: event.place,
        start_date: event.start_date,
        start_time: event.start_time,
        end_date: event.end_date,
        end_time: event.end_time,
        image: event.cover_image,
      }));
      setEvents(formatted);
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
  }, []);

  const handlePageChange = (url) => {
    if (url) fetchMyEvents(url);
  };

  const handleEdit = (event) => {
    navigate("/create-event", { state: { eventToEdit: event } });
  };

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

  if (loading) {
    return (
      <Main>
        <div className="text-center py-10">Cargando tus eventos...</div>
      </Main>
    );
  }

  if (error) {
    return (
      <Main>
        <div className="text-center text-red-600 py-10">{error}</div>
      </Main>
    );
  }

  return (
    <Main>
      <div className="w-full max-w-6xl mx-auto px-3 mb-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Mis Eventos</h1>
        <div className="mb-6 text-center">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Crear Evento
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-500 text-center">
            No tienes eventos registrados.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={event.start_date}
                  location={event.place}
                  image={event.image}
                  showOwnerActions={true}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => confirmDelete(event.id)}
                />
              ))}
            </div>

            {/* 🔹 Paginación */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={!prevPage}
                onClick={() => handlePageChange(prevPage)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  prevPage
                    ? "bg-primary text-white hover:bg-primary/90"
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
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🔹 Modal de confirmación */}
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