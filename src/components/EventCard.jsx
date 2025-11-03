import React from "react";

const EventCard = ({
  title,
  description,
  location,
  date,
  image,
  onJoin,
  onEdit,
  onDelete,
  showOwnerActions = false, // 🔹 Prop para saber si mostrar botones de dueño
}) => {
  const defaultImage =
    image && image.trim() !== ""
      ? image
      : "https://via.placeholder.com/400x250?text=Evento+sin+imagen";

  const formattedDate =
    date && !isNaN(new Date(date).getTime())
      ? new Date(date).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Próximamente";

  return (
    <article className="overflow-hidden flex flex-col flex-1 bg-white rounded-3xl gap-4 pb-6 shadow-sm hover:shadow-lg transition-all">
      <header>
        <img
          src={defaultImage}
          alt={title || "Evento"}
          className="h-44 w-full object-cover md:block rounded-t-2xl"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/400x250?text=Imagen+no+disponible")
          }
        />
      </header>

      <div className="px-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="bg-gradient-to-r from-teal-800 to-teal-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            {title || "Evento"}
          </span>

          <div className="flex gap-2 items-center">
            <img
              className="w-6 rounded-full"
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
              alt="Creador"
            />
            <span className="text-sm">Organizador</span>
          </div>
        </div>

        <div>
          <h1 className="font-bold text-xl text-gray-900">{title || "Sin título"}</h1>
          <p className="text-gray-700 line-clamp-3">
            {description || "Sin descripción disponible."}
          </p>
        </div>
      </div>

      <footer className="flex justify-center gap-7 text-gray-600">
        <div className="flex gap-1">
          <svg
            className="h-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="calendar-days"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"
            ></path>
          </svg>
          <small>{formattedDate}</small>
        </div>

        {location && (
          <div className="flex gap-1">
            <svg
              className="h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="location-dot"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
              ></path>
            </svg>
            <small>{location || "Lugar no definido"}</small>
          </div>
        )}
      </footer>

      {/* Botones solo si showOwnerActions es true */}
      {showOwnerActions ? (
        <div className="flex justify-center gap-4 mt-3">
          <button
            className="bg-yellow-600 text-white px-5 py-2 rounded-lg font-medium hover:shadow-md hover:bg-yellow-600/80 transition-all"
            onClick={onEdit}
          >
            Editar
          </button>
          <button
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:shadow-md hover:bg-red-600/80 transition-all"
            onClick={onDelete}
          >
            Eliminar
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-3">
          <button
            className="bg-teal-800 text-white px-5 py-2 rounded-lg font-medium hover:shadow-md hover:bg-teal-800/80 transition-all"
            onClick={onJoin}
          >
            Unirse
          </button>
        </div>
      )}
    </article>
  );
};

export default EventCard;
