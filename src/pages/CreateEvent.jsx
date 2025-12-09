import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { eventService } from "../api/services/eventService";
import Main from "../layouts/Main";
import { CalendarInput } from "../components/CalendarInput";

const categoryColorsById = {
  1: "bg-green-100 text-green-800 border-green-300",
  2: "bg-purple-100 text-purple-800 border-purple-300",
  3: "bg-blue-100 text-blue-800 border-blue-300",
  4: "bg-pink-100 text-pink-800 border-pink-300",
  5: "bg-indigo-100 text-indigo-800 border-indigo-300",
  6: "bg-yellow-100 text-yellow-800 border-yellow-300",
};

const normalizeDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const normalizeTime = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[1]?.slice(0, 5) || "";
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    place: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    max_capacity: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======= PRE-CARGA DE EDICIÓN =======
  useEffect(() => {
    const eventToEdit = location.state?.eventToEdit;

    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        description: eventToEdit.description || "",
        place: eventToEdit.place || "",
        start_date: normalizeDate(eventToEdit.start_date),
        start_time: eventToEdit.start_time ?? normalizeTime(eventToEdit.start_date),
        end_date: normalizeDate(eventToEdit.end_date),
        end_time: normalizeTime(eventToEdit.end_date),
        max_capacity: eventToEdit.max_capacity || "",
      });

      if (eventToEdit.image) setPreview(eventToEdit.image);

      if (eventToEdit.categories) {
        setSelectedCategories(eventToEdit.categories.map((c) => String(c.id)));
      }
    }
  }, [location.state]);

  // ======= CARGAR CATEGORÍAS =======
  useEffect(() => {
    eventService.getCategories().then((data) => setCategories(data || []));
  }, []);

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

  const toggleCategory = (id) => {
    const idStr = String(id);
    setSelectedCategories((prev) =>
      prev.includes(idStr)
        ? prev.filter((c) => c !== idStr)
        : [...prev, idStr]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedCategories.length === 0) {
      setError("Debes seleccionar al menos una categoría");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value ?? "");
      });

      selectedCategories.forEach((id) => {
        data.append("categories_ids", id);
      });

      if (coverImage) data.append("cover_image", coverImage);

      const editing = location.state?.eventToEdit;

      if (editing) {
        await eventService.updateEvent(editing.id, data);
      } else {
        await eventService.createEvent(data);
      }

      navigate("/my-events");
    } catch (err) {
      setError(err?.response?.data?.detail || "Error al guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">
          {location.state?.eventToEdit ? "Editar evento" : "Crear nuevo evento"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-card-background p-8 rounded-2xl shadow-md border border-gray-200 space-y-6"
        >
          {/* Título */}
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
              className="w-full p-3 border border-gray-300 rounded-lg bg-background"
            />
          </div>

          {/* Descripción */}
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
              className="w-full p-3 border border-gray-300 rounded-lg bg-background"
            />
          </div>

          {/* Lugar */}
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
              className="w-full p-3 border border-gray-300 rounded-lg bg-background"
            />
          </div>

          {/* Capacidad */}
          <div>
            <label htmlFor="max_capacity" className="block font-semibold mb-2">
              Capacidad máxima
            </label>
            <input
              id="max_capacity"
              type="number"
              min="1"
              value={formData.max_capacity}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-background"
            />
          </div>

          {/* Imagen */}
          <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-background cursor-pointer">
            <label htmlFor="cover_image" className="cursor-pointer">
              {preview ? (
                <img src={preview} alt="Vista previa" className="rounded-xl max-h-64 object-cover" />
              ) : (
                <p className="text-muted">Subir imagen</p>
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

          {/* Categorías */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(String(cat.id));
              const colors = categoryColorsById[cat.id] || "";

              return (
                <span
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`
                    inline-flex items-center rounded-md px-3 py-1 text-sm font-medium 
                    cursor-pointer transition-all border
                    ${
                      isSelected
                        ? `${colors} scale-105 shadow-md border-transparent`
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  {cat.type}
                </span>
              );
            })}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CalendarInput
              dateValue={formData.start_date}
              timeValue={formData.start_time}
              onChange={({ date, time }) =>
                setFormData((prev) => ({
                  ...prev,
                  start_date: date,
                  start_time: time,
                }))
              }
            />

            <CalendarInput
              dateValue={formData.end_date}
              timeValue={formData.end_time}
              onChange={({ date, time }) =>
                setFormData((prev) => ({
                  ...prev,
                  end_date: date,
                  end_time: time,
                }))
              }
            />
          </div>

          {error && <p className="text-center text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading
              ? "Guardando..."
              : location.state?.eventToEdit
              ? "Actualizar evento"
              : "Publicar evento"}
          </button>
        </form>
      </div>
    </Main>
  );
};

export default CreateEvent;
