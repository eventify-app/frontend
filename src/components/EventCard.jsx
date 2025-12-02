import React from "react";

const EventCard = ({
  id,
  title,
  description,
  location,
  date,
  image,
  organizerName = "Organizador",
  organizerAvatar = "https://via.placeholder.com/50?text=Avatar",
  onJoin,
  onEdit,
  onDelete,
  showOwnerActions = false,
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
    <article className="overflow-hidden flex flex-col flex-1 bg-card-background rounded-xl gap-4 pb-6 shadow-sm hover:shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
      <header>
        <img
          src={defaultImage}
          alt={title || "Evento"}
          className="h-56 w-full object-cover md:block rounded-t-2xl"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/400x250?text=Imagen+no+disponible")
          }
          style={{ viewTransitionName: `event-image-${id}` }}
        />
      </header>

      <div className="px-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="bg-gradient-to-r from-teal-800 to-teal-700 text-white px-3 py-1 rounded-full text-sm font-medium">
            {title || "Evento"}
          </span>

          <div className="flex gap-2 items-center">
            <img
              className="w-6 h-6 rounded-full"
              src={organizerAvatar}
              alt={organizerName}
            />
            <span className="text-sm">{organizerName}</span>
          </div>
        </div>

        <p className="line-clamp-3 text-gray-700">
          {description || "Sin descripción disponible."}
        </p>
      </div>

      <footer className="flex justify-center gap-7 text-gray-600">
        <div className="flex gap-1 items-center">
          <svg
            className="h-4"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7..."
            ></path>
          </svg>
          <small>{formattedDate}</small>
        </div>

        {location && (
          <div className="flex gap-1 items-center">
            <svg
              className="h-4"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M215.7 499.2C267 435 384 279.4..."
              ></path>
            </svg>
            <small>{location || "Lugar no definido"}</small>
          </div>
        )}
      </footer>

      {showOwnerActions ? (
        <div className="flex justify-center gap-4 mt-3">
          <button
            className="bg-yellow-600 text-white px-5 py-2 rounded-lg font-medium hover:shadow-md hover:bg-yellow-600/80 transition-all cursor-pointer"
            onClick={onEdit}
          >
            Editar
          </button>
          <button
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium hover:shadow-md hover:bg-red-600/80 transition-all cursor-pointer"
            onClick={onDelete}
          >
            Eliminar
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-3">
          <button
            className="bg-teal-800 text-white px-5 py-2 rounded-lg font-medium hover:shadow-md hover:bg-teal-800/80 transition-all cursor-pointer"
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