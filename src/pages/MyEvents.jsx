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

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const data = await eventService.getMyEvents(); // ya devuelve results
        const formatted = data.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          place: event.place,
          start_date: event.start_date,
          start_time: event.start_time,
          end_date: event.end_date,
          end_time: event.end_time,
          image: event.cover_image, // asegúrate que sea la URL completa
        }));
        setEvents(formatted);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleEdit = (event) => {
    navigate("/create-event", { state: { eventToEdit: event } });
  };

  const handleDelete = async (id) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el evento");
    }
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
        <div className="mb-6">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Crear Evento
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-500 text-center">No tienes eventos registrados.</p>
        ) : (
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
                onDelete={() => handleDelete(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Main>
  );
};

export default MyEvents;
