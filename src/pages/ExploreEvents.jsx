import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import { eventService } from "../api/services/eventService";

const ExploreEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);

  const [filters, setFilters] = useState({
    title: "",
    place: "",
    date: "",
    category: "All",
  });

  const navigate = useNavigate();

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
    if (filters.date) query.start_date = filters.date;
    if (filters.category && filters.category !== "All")
      query.category = filters.category;
    fetchEvents("/events/", query);
  };

  const handlePageChange = (url) => {
    if (url) fetchEvents(url);
  };

  return (
    <Main>
      <div className="w-full flex flex-col lg:flex-row gap-10">
        {/* Sidebar de filtros */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="p-6 rounded-xl bg-white shadow-sm border border-primary/10">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Filtros
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Buscar por nombre
                </label>
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={handleChange}
                  placeholder="Nombre del evento"
                  className="mt-1 block w-full pl-3 pr-4 py-2 border border-primary/20 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 border border-primary/20 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option>All</option>
                  <option>Music</option>
                  <option>Tech</option>
                  <option>Art</option>
                  <option>Sports</option>
                  <option>Career</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-4 py-2 border border-primary/20 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lugar
                </label>
                <input
                  type="text"
                  name="place"
                  value={filters.place}
                  onChange={handleChange}
                  placeholder="Campus, ciudad..."
                  className="mt-1 block w-full pl-3 pr-4 py-2 border border-primary/20 rounded-md focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <button
                onClick={handleApplyFilters}
                className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </aside>

        {/* Listado de eventos */}
        <section className="flex-1">
          {events.length === 0 ? (
            <p className="text-gray-600 text-center">
              No se encontraron eventos.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-primary/10"
                  >
                    <div
                      className="w-full h-48 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${event.cover_image || "/default-event.jpg"})`,
                      }}
                    ></div>
                    <div className="p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-primary font-semibold">
                          {event.category || "General"}
                        </p>
                        <h3 className="text-lg font-bold mt-1">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {event.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(event.start_date).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="mt-4 bg-primary text-white text-sm font-medium py-2 rounded-md hover:bg-primary/90 transition"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
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
        </section>
      </div>
    </Main>
  );
};

export default ExploreEventsPage;