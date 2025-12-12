import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import { eventService } from "../api/services/eventService";
import EventCard from "../components/EventCard";
import { format } from "date-fns";
import { Input } from "@/components/ui/input"; // ShadCN
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // ShadCN Calendar

const ExploreEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    place: "",
    from_date: "",
    to_date: "",
    category: "All",
  });

  const navigate = useNavigate();
  const topRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (url = "/events/", params = {}) => {
    try {
      const data = await eventService.list(url, params);
      setEvents(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setCount(data.count);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    const query = {};
    if (filters.title) query.search = filters.title;
    if (filters.place) query.place = filters.place;
    if (filters.from_date) query.from_date = filters.from_date;
    if (filters.to_date) query.to_date = filters.to_date;
    if (filters.category && filters.category !== "All")
      query.category = filters.category;

    fetchEvents("/events/", query);
  };

  const categories = [
    { label: "Todos", value: "All", color: "bg-gray-700 text-white" },
    { label: "Deportes", value: "Sports", color: "bg-green-100 text-green-800" },
    { label: "Cultura", value: "Culture", color: "bg-purple-100 text-purple-800" },
    { label: "Académico", value: "Academic", color: "bg-blue-100 text-blue-800" },
    { label: "Social", value: "Social", color: "bg-pink-100 text-pink-800" },
    { label: "Tecnología", value: "Tech", color: "bg-indigo-100 text-indigo-800" },
    { label: "Arte", value: "Art", color: "bg-yellow-100 text-yellow-800" },
  ];

  return (
    <Main>
      <div className="w-full h-full">

      <h1 ref={topRef} className="text-3xl font-bold self-start mb-4">
        Descubre eventos
      </h1>

      <div className="flex flex-col gap-4 mb-6 w-full">
        {/* Barra de búsqueda */}

        <div className="flex gap-5">
          <div className="relative w-full">
          <Input
            placeholder="Buscar eventos por nombre..."
            value={filters.title}
            name="title"
            onChange={handleChange}
            className="pl-10"
          />
        </div>

        <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
          Filtros
        </Button>
        </div>
        
        {/* Filtros */}
{showFilters && (
  <div className="p-4 bg-card-background border rounded-xl gap-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Lugar */}
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground mb-1">Lugar</span>
        <Input
          placeholder="Campus, ciudad..."
          name="place"
          value={filters.place}
          onChange={handleChange}
        />
      </div>

      {/* Categoría */}
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground mb-1">Categoría</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {categories.map((cat) => {
            const isActive = filters.category === cat.value;
            return (
              <Button
                key={cat.value}
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, category: cat.value }))
                }
              >
                {cat.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Fecha Desde */}
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground mb-1">Desde</span>
        <Calendar
          mode="single"
          selected={
            filters.from_date
              ? new Date(filters.from_date + "T00:00:00")
              : undefined
          }
          onSelect={(date) =>
            setFilters((prev) => ({
              ...prev,
              from_date: date ? format(date, "yyyy-MM-dd") : "",
            }))
          }
        />
      </div>

      {/* Fecha Hasta */}
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground mb-1">Hasta</span>
        <Calendar
          mode="single"
          selected={
            filters.to_date
              ? new Date(filters.to_date + "T00:00:00")
              : undefined
          }
          onSelect={(date) =>
            setFilters((prev) => ({
              ...prev,
              to_date: date ? format(date, "yyyy-MM-dd") : "",
            }))
          }
        />
      </div>

      {/* Botón */}
      <div className="col-span-full mt-2">
        <Button className="w-full" onClick={handleApplyFilters}>
          Aplicar filtros
        </Button>
      </div>
    </div>
  </div>
)}

      </div>

      {/* Lista de eventos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-gray-600 text-center col-span-3">
            No se encontraron eventos.
          </p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              description={event.description}
              date={event.start_date}
              hour={event.start_time}
              date_end={event.end_date}
              hour_end={event.end_time}
              location={event.place}
              image={event.cover_image}
              onJoin={() => navigate(`/event/${event.id}`)}
              participants={event.participants_count}
              is_enrolled={event.is_enrolled}
              max_capacity={event.max_capacity}
              creator={event.id_creator.username}
              creator_id={event.id_creator.id}
            />
          ))
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <Button disabled={!prevPage} onClick={() => prevPage && fetchEvents(prevPage)}>
          ← Anterior
        </Button>
        <span className="text-sm text-gray-600">
          Mostrando {events.length} de {count} eventos
        </span>
        <Button disabled={!nextPage} onClick={() => nextPage && fetchEvents(nextPage)}>
          Siguiente →
        </Button>
      </div>
      </div>

    </Main>
  );
};

export default ExploreEventsPage;
