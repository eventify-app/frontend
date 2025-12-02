import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import { eventService } from "../api/services/eventService";
import EventCard from "../components/EventCard";
import DatePicker from "../components/DatePicker";
import { format } from "date-fns";

const ExploreEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    title: "",
    place: "",
    date: "",
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
      setEvents(data.results || []);
      setNextPage(data.next || null);
      setPrevPage(data.previous || null);
      setCount(data.count || 0);
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
    if (filters.date) query.start_date = filters.date;
    if (filters.category && filters.category !== "All") query.category = filters.category;

    fetchEvents("/events/", query);
  };

  function parseLocalDateString(yyyy_mm_dd) {
    const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
    return new Date(y, m - 1, d, 12, 0, 0); // mediodía local
  }

  const categories = [
    { label: "Todos", value: "All", color: "bg-gray-700 text-white border-transparent" },
    { label: "Deportes", value: "Sports", color: "bg-green-100 text-green-800 border-green-300" },
    { label: "Cultura", value: "Culture", color: "bg-purple-100 text-purple-800 border-purple-300" },
    { label: "Académico", value: "Academic", color: "bg-blue-100 text-blue-800 border-blue-300" },
    { label: "Social", value: "Social", color: "bg-pink-100 text-pink-800 border-pink-300" },
    { label: "Tecnología", value: "Tech", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
    { label: "Arte", value: "Art", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  ];

  const handleFilter = (e) => {
    e.preventDefault();
    handleApplyFilters();
  };

  const handlePageChange = (url) => {
    if (url) {
      fetchEvents(url);
      setTimeout(() => {
        if (topRef.current) {
          const elementPosition = topRef.current.offsetTop;
          window.scrollTo({ top: elementPosition - 20, behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <Main>
      <h1 ref={topRef} className="text-3xl font-bold self-start">Descubre eventos</h1>

      {/* Filtros */}
      <aside className="w-full flex flex-col gap-3">
        <form onSubmit={handleFilter}>
          <div className="flex gap-3 relative items-center">
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>

            <input
              type="text"
              name="title"
              placeholder="Buscar eventos por nombre..."
              className="w-full pl-12 pr-4 py-3 border-2 bg-background border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
              value={filters.title}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-primary text-primary bg-primary/10 rounded-xl hover:scale-110 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-filter w-5 h-5"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span className="font-medium">Filtros</span>
          </button>

          {/* Panel de filtros */}
          <div className={`transition-all duration-300 overflow-hidden ${showFilters ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <div className="p-6 rounded-xl bg-card-background shadow-sm border border-gray-200 flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Filtros</h3>

              <div className="flex gap-4 flex-wrap">
                {/* Categorías */}
                <div className="flex items-center gap-2 text-muted-foreground flex-wrap">
                  <span className="text-sm">Categoría:</span>
                  {categories.map((cat) => {
                    const isActive = filters.category === cat.value;
                    return (
                      <span
                        key={cat.value}
                        onClick={() => setFilters((prev) => ({ ...prev, category: cat.value }))}
                        className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium cursor-pointer transition-all border ${
                          isActive ? `${cat.color} scale-105 shadow-md` : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {cat.label}
                      </span>
                    );
                  })}
                </div>

                {/* Fecha */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Fecha:</span>
                  <DatePicker
                    date={filters.date ? parseLocalDateString(filters.date) : undefined}
                    setDate={(d) => {
                      if (!d) {
                        setFilters((prev) => ({ ...prev, date: "" }));
                        return;
                      }
                      const adjusted = new Date(d);
                      adjusted.setHours(12, 0, 0, 0);
                      setFilters((prev) => ({ ...prev, date: format(adjusted, "yyyy-MM-dd") }));
                    }}
                  />
                </div>

                {/* Lugar */}
                <div className="flex items-center gap-2 text-muted-foreground w-full">
                  <span className="text-sm">Lugar:</span>
                  <input
                    type="text"
                    name="place"
                    value={filters.place}
                    onChange={handleChange}
                    placeholder="Campus, ciudad..."
                    className="block w-full pl-3 pr-4 py-1.5 border border-primary/20 rounded-md"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="w-full bg-primary hover:bg-primary/75 text-white py-2 rounded-lg cursor-pointer"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </form>
      </aside>

      {/* Lista de eventos */}
      <div className="w-full flex flex-1 flex-col lg:flex-row gap-10">
        <section className="flex-1">
          {events.length === 0 ? (
            <p className="text-gray-600 text-center">No se encontraron eventos.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.start_date}
                    hour={event.start_time}
                    location={event.place}
                    image={event.cover_image}
                    organizerName={`${event.id_creator?.first_name || ""} ${event.id_creator?.last_name || ""}`}
                    organizerAvatar={event.id_creator?.avatar || "https://via.placeholder.com/50?text=Avatar"}
                    onJoin={() => navigate(`/eventos/${event.id}`)}
                    participants={event.participants_count}
                    is_enrolled={event.is_enrolled}
                    max_capacity={event.max_capacity}
                    creator={event?.id_creator?.username}
                  />
                ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  disabled={!prevPage}
                  onClick={() => handlePageChange(prevPage)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    prevPage ? "bg-primary text-white hover:bg-primary/90 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  ← Anterior
                </button>

                <span className="text-sm text-gray-600">Mostrando {events.length} de {count} eventos</span>

                <button
                  disabled={!nextPage}
                  onClick={() => handlePageChange(nextPage)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    nextPage ? "bg-primary text-white hover:bg-primary/90 cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </Main>
  );
};

export default ExploreEventsPage;