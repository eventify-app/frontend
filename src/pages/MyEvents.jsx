import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import EventCard from "../components/EventCard";

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Simulación de carga de eventos
    setEvents([
      {
        id: 1,
        title: "Concierto de Rock",
        description: "Una noche inolvidable con las mejores bandas.",
        place: "Auditorio Central",
        start_date: "2025-11-15",
        start_time: "19:00",
        end_date: "2025-11-15",
        end_time: "22:00",
        image: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229",
      },
      {
        id: 2,
        title: "Festival de Comida",
        description: "Degusta lo mejor de la gastronomía local.",
        place: "Plaza de Eventos",
        start_date: "2025-12-01",
        start_time: "11:00",
        end_date: "2025-12-01",
        end_time: "18:00",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      },
    ]);
  }, []);

  const handleEdit = (event) => {
    navigate("/create-event", { state: { eventToEdit: event } });
  };

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleCreate = () => {
    navigate("/create-event");
  };

  return (
    <Main>
      <div className="w-full max-w-6xl mx-auto px-3 mb-6">
        {/* Contenedor del título y botón */}
        <h1 className="text-2xl font-bold mb-4 text-center">Mis Eventos</h1>
        <div className="mb-6">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Crear Evento
          </button>
        </div>

        {/* Grid de eventos */}
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
                showOwnerActions={true} // 🔹 Esto habilita Editar y Eliminar
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
