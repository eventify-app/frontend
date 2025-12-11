import Main from "../layouts/Main"
import CalendarGrid from "../components/CalendarGrid"

export default function CalendarioEventos() {
  return (
    <Main>
      <div className="flex flex-col flex-1 p-4 sm:p-6 lg:p-8">
        {/* Encabezado */}
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-3xl font-bold">Calendario</h1>
          <p className="text-base">Descubre y únete a eventos dentro del campus.</p>
        </div>

        {/* Calendario dinámico */}
        <CalendarGrid />
      </div>
    </Main>
  )
}