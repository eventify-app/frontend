import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({
  id,
  title,
  description,
  location,
  date,
  image,
  onJoin,
  onEdit,
  onDelete,
  showOwnerActions = false,
  hour,
  participants,
  is_enrolled,
  max_capacity,
  creator
}) => {
  const defaultImage =
    image && image.trim() !== ""
      ? image
      : "https://via.placeholder.com/400x250?text=Evento+sin+imagen";

    const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Próximamente";

  return (
    <article className="overflow-hidden flex flex-col flex-1 bg-card-background dark: rounded-xl gap-4 pb-6 shadow-sm hover:shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">

      
      <header>
        <img
          src={defaultImage}
          alt={title || "Evento"}
          className="h-56 w-full object-cover md:block rounded-t-2xl"
          onError={(e) =>
            (e.target.src =
              "https://via.placeholder.com/400x250?text=Imagen+no+disponible")
          }
          style={{viewTransitionName: `event-image-${id}`}}
        />
      </header>

      <div className="px-6 flex-1 flex flex-col gap-4 text-muted">

          <h1 className="font-bold text-lg text-primary" style={{viewTransitionName: `event-title-${id}`}}>{title || "Sin título"}</h1>

          <div className="flex flex-col gap-1">

            <div className="flex gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar h-4 w-4 text-primary" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
              <small className="text-sm">{formattedDate} - {hour}</small>
            </div>

            {location && (
              <div className="flex gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin h-4 w-4 text-primary" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <small className="text-sm">{location || "Lugar no definido"}</small>
              </div>
            )}

            <div className="flex gap-1 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users h-4 w-4 text-primary" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>

              <small className="text-sm"> {participants} / {max_capacity} asistentes</small>
            </div>
          </div>


          <p className="line-clamp-3">
            {description || "Sin descripción disponible."}
            
          </p>

          { !showOwnerActions && (
            <div>
              <hr className="border-gray-300" />
              <small className="text-sm">Organiza: </small>
              <small className="text-primary text-sm">{creator}</small>
            </div>
          ) }
          

                  {showOwnerActions ? (
          <div className="flex items-end flex-1 justify-center gap-4">
            <button
              className="text-yellow-600 flex items-center border border-yellow-600 bg-yellow-50 px-5 py-2 rounded-lg font-medium hover:scale-110 transition-all cursor-pointer"
              onClick={onEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen h-4 w-4 mr-2" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path></svg>
              Editar
            </button>
            <button
              className="bg-red-50 flex items-center text-red-600 border border-red-600 px-5 py-2 rounded-lg font-medium hover:shadow-md hover:scale-110 transition-all cursor-pointer"
              onClick={onDelete}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

              Eliminar
            </button>
          </div>
        ) : (
            <Link
              to={`/event/${id}`}
              state={{ from: location }}
              className="bg-background text-center text-primary px-5 py-2 rounded-lg text-sm border border-gray-300 font-medium hover:shadow-md hover:bg-indigo-600 hover:text-white cursor-pointer transition-all"
                onClick={() => {
                  if (!document.startViewTransition) return onJoin();

                  document.startViewTransition(() => {
                    onJoin();
                  });
                }}
            >
              Ver detalles
            </Link>
        )}
      </div>

    </article>
  );
};

export default EventCard;
