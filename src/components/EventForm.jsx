import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventService } from "../api/services/eventService";
import Main from "../layouts/Main";

const EventForm = ({ isEditMode = false }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // id del evento si estamos editando

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    place: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Si es modo edición, cargar datos del evento
  useEffect(() => {
    if (isEditMode && id) {
      const fetchEvent = async () => {
        try {
          const data = await eventService.getEventById(id);
          setFormData({
            title: data.title,
            description: data.description,
            place: data.place,
            start_date: data.start_date,
            start_time: data.start_time,
            end_date: data.end_date,
            end_time: data.end_time,
          });
          if (data.cover_image) setPreview(data.cover_image);
        } catch (err) {
          console.error(err);
          setError("Error al cargar el evento");
        }
      };
      fetchEvent();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (coverImage) {
        data.append("cover_image", coverImage);
      }

      if (isEditMode && id) {
        await eventService.updateEvent(id, data);
      } else {
        await eventService.createEvent(data);
      }

      navigate("/my-events");
    } catch (err) {
      console.error(err);
      setError("Error al guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          {isEditMode ? "Editar evento" : "Crear nuevo evento"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 space-y-6"
        >
          <div>
            <label htmlFor="title" className="block font-semibold mb-2">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ej: Charla sobre IA"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Describe el evento..."
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="place" className="block font-semibold mb-2">
              Lugar
            </label>
            <input
              id="place"
              type="text"
              value={formData.place}
              onChange={handleChange}
              required
              placeholder="Ej: Auditorio central"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          {/* Imagen */}
          <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-primary transition-colors cursor-pointer">
            <label
              htmlFor="cover_image"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Vista previa"
                  className="rounded-xl max-h-64 object-cover"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="mt-2 font-semibold text-gray-700">
                    Subir imagen o banner
                  </p>
                  <p className="text-sm text-gray-500">
                    Arrastra o haz clic para subir
                  </p>
                </>
              )}
            </label>
            <input
              id="cover_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block font-semibold mb-2">
                Fecha de inicio
              </label>
              <input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="start_time" className="block font-semibold mb-2">
                Hora de inicio
              </label>
              <input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block font-semibold mb-2">
                Fecha de finalización
              </label>
              <input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block font-semibold mb-2">
                Hora de finalización
              </label>
              <input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-center text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-60"
          >
            {loading
              ? isEditMode
                ? "Guardando cambios..."
                : "Publicando..."
              : isEditMode
              ? "Guardar cambios"
              : "Publicar evento"}
          </button>
        </form>
      </div>
    </Main>
  );
};

export default EventForm;
