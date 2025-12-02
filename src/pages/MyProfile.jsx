import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../layouts/Main";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { eventService } from "../api/services/eventService";
import EventCard from "../components/EventCard";

export default function MyProfile() {
  const [created, setCreated] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvents() {
      try {
        const createdData = await eventService.getMyProfileEvents();
        const subscribedData = await eventService.getMyEvents();

        // ✅ ahora usamos results porque el servicio devuelve {results, count, next, previous}
        setCreated(createdData.results || []);
        setEnrolled(subscribedData.results || []);
      } catch (err) {
        setError("Error al cargar eventos: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  async function handleUnenroll(id) {
    try {
      await eventService.cancelSubscription(id);
      setEnrolled((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError("Error al cancelar inscripción: " + err.message);
    }
  }

  return (
    <Main>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && (
          <Tabs defaultValue="creados" className="w-full">
            <TabsList>
              <TabsTrigger value="creados">Creados</TabsTrigger>
              <TabsTrigger value="inscritos">Inscritos</TabsTrigger>
            </TabsList>

            {/* Eventos creados */}
            <TabsContent value="creados">
              {created.length === 0 ? (
                <p className="text-gray-500 mt-4">No has creado eventos aún.</p>
              ) : (
                created.map((ev) => (
                  <EventCard
                    key={ev.id}
                    title={ev.title}
                    description={ev.description}
                    location={ev.place}
                    date={ev.start_date}
                    image={ev.cover_image}
                    organizerName={`${ev.id_creator?.first_name || ""} ${ev.id_creator?.last_name || ""}`}
                    organizerAvatar={ev.id_creator?.avatar || "https://via.placeholder.com/50?text=Avatar"}
                    onDetail={() => navigate(`/eventos/${ev.id}`)}
                    showOwnerActions
                    onEdit={() => navigate("/create-event", { state: { eventToEdit: ev } })}
                    onDelete={() => console.log("Eliminar", ev.id)}
                  />
                ))
              )}
            </TabsContent>

            {/* Eventos inscritos */}
            <TabsContent value="inscritos">
              {enrolled.length === 0 ? (
                <p className="text-gray-500 mt-4">No estás inscrito en ningún evento.</p>
              ) : (
                enrolled.map((ev) => (
                  <EventCard
                    key={ev.id}
                    title={ev.title}
                    description={ev.description}
                    location={ev.place}
                    date={ev.start_date}
                    image={ev.cover_image}
                    organizerName={`${ev.id_creator?.first_name || ""} ${ev.id_creator?.last_name || ""}`}
                    organizerAvatar={ev.id_creator?.avatar || "https://via.placeholder.com/50?text=Avatar"}
                    onDetail={() => navigate(`/eventos/${ev.id}`)}
                    onCancel={() => handleUnenroll(ev.id)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Main>
  );
}