import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";

const PopularEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get("/analytics/top-events/");
        setEvents(res.data.slice(0, 3)); // solo 3 primeros
      } catch (error) {
        console.error("Error cargando eventos populares:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-bold">Eventos destacados</h2>
        <Link to="/events" className="text-primary">
          Ver todos
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-muted">Cargando...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-muted">No hay eventos populares disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((item) => {
            const e = item.event;

            return (
              <EventCard
                key={e.id}
                id={e.id}
                title={e.title}
                description={e.description}
                location={e.place}
                date={e.start_date}
                hour={e.start_time?.slice(0, 5)}
                date_end={e.end_date}
                hour_end={e.end_time?.slice(0, 5)}
                image={e.cover_image}
                participants={item.enrollments}
                max_capacity={e.max_capacity}
                creator={`${e.id_creator.first_name} ${e.id_creator.last_name}`}
                creator_id={e.id_creator.id}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PopularEvents;
