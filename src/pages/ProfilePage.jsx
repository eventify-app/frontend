import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Main from "../layouts/Main";
import EventCard from "../components/EventCard";
import { userService } from "../api/services/userService";
import { eventService } from "../api/services/eventService";
import { ImageCropper } from "../components/ImageCropper";

const ProfilePage = ({ isCurrentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("creados");

  // States para ImageCropper
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);

  // Helper para formatear eventos
  const formatEventsForCard = (eventsArray) =>
    eventsArray.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.start_date,
      location: event.place,
      image: event.cover_image,
      max_capacity: event.max_capacity,
      participants: event.participants_count,
    }));

  // Editar evento (solo perfil propio)
  const handleEdit = (event) => {
    navigate("/create-event", { state: { eventToEdit: event } });
  };

  // Cargar perfil y eventos
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isCurrentUser) {
          const res = await userService.getMyProfileEvents();
          setCreatedEvents(formatEventsForCard(res.creados || []));
          setRegisteredEvents(formatEventsForCard(res.inscritos || []));

          const user = JSON.parse(localStorage.getItem("user"));
          setProfile(user);
        } else {
          const userId = parseInt(id);
          const res = await userService.getUserById(userId);
          setProfile(res);

          setCreatedEvents(formatEventsForCard(res.events_created || []));
          setRegisteredEvents(formatEventsForCard(res.events_registered || []));
        }
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isCurrentUser]);

  // Dropzone para seleccionar avatar
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    setSelectedFile(fileWithPreview);
    setIsCropDialogOpen(true); // abrir modal
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  if (loading)
    return (
      <Main>
        <div className="text-center py-20">Cargando perfil...</div>
      </Main>
    );

  if (error || !profile)
    return (
      <Main>
        <div className="text-center py-20 text-red-500">{error}</div>
      </Main>
    );

  const { first_name, last_name, email, profile_photo, joined_at } = profile;

  return (
    <Main>
      <div className="w-full max-w-5xl mx-auto h-full py-8 md:py-12">
        {/* Header del perfil */}
        <div className="bg-card-background w-full rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8">
          <div {...getRootProps()} className="relative w-32 h-32 cursor-pointer">
            <input {...getInputProps()} />
            {/* Avatar */}
            <div
              className="w-32 h-32 rounded-full bg-cover bg-center ring-4 ring-white dark:ring-background-dark"
              style={{
                backgroundImage: `url(${
                  selectedFile?.preview || profile_photo || "/assets/avatar-profile.png"
                })`,
              }}
            />

            {/* Overlay hover */}
            <div className="absolute inset-0 rounded-full bg-black/50 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <span className="text-white font-semibold text-sm text-center">
                Cambiar avatar
              </span>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">
              {first_name} {last_name}
            </h2>
            <p className="text-primary mt-1">{email}</p>
            {/* <p className="text-sm text-muted mt-2">
              Joined in {new Date(joined_at).getFullYear()}
            </p> */}
          </div>
        </div>

        {/* Tabs para creados e inscritos */}
        <div className="mt-8 flex gap-4 border-b">
          <button
            className={`pb-2 font-semibold ${
              activeTab === "creados"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("creados")}
          >
            Eventos Creados
          </button>
          <button
            className={`pb-2 font-semibold ${
              activeTab === "inscritos"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("inscritos")}
          >
            Eventos Inscritos
          </button>
        </div>

        {/* Grid de eventos */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "creados" ? createdEvents : registeredEvents).length ? (
            (activeTab === "creados" ? createdEvents : registeredEvents).map((event) => (
              <EventCard
                key={event.id}
                {...event}
                showOwnerActions={isCurrentUser && activeTab === "creados"}
                onEdit={() => handleEdit(event)}
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500">
              No hay eventos {activeTab === "creados" ? "creados" : "inscritos"} aún.
            </p>
          )}
        </div>
      </div>

      {/* ImageCropper modal */}
      {selectedFile && (
        <ImageCropper
          dialogOpen={isCropDialogOpen}
          setDialogOpen={setIsCropDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onCropComplete={(backendAvatarUrl) => {
            // Actualiza el estado
            setProfile((prev) => ({ ...prev, profile_photo: backendAvatarUrl }));

            // Actualiza el localStorage.user
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser) {
              const updatedUser = { ...storedUser, profile_photo: backendAvatarUrl };
              localStorage.setItem("user", JSON.stringify(updatedUser));

              // 🔥 Notificar a toda la app que el avatar cambió
              window.dispatchEvent(new Event("user-updated"));
            }
          }}
        />

      )}
    </Main>
  );
};

export default ProfilePage;
