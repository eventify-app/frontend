import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { eventService } from "../../api/services/eventService"

const WEEK_LABELS = ["L", "M", "M", "J", "V", "S", "D"]

// Mapa de estilos por categoría
const CATEGORY_STYLES = {
  Deportes: { dot: "bg-green-500", chip: "bg-green-100 text-green-800" },
  Cultura: { dot: "bg-purple-500", chip: "bg-purple-100 text-purple-800" },
  Académico: { dot: "bg-blue-500", chip: "bg-blue-100 text-blue-800" },
  Social: { dot: "bg-pink-500", chip: "bg-pink-100 text-pink-800" },
  Tecnología: { dot: "bg-indigo-500", chip: "bg-indigo-100 text-indigo-800" },
  Arte: { dot: "bg-yellow-500", chip: "bg-yellow-100 text-yellow-800" },
};


// Intenta leer categoría desde diferentes campos
const getCategory = (ev) => ev.category ?? ev.type ?? "Social";

export default function CalendarGrid() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  // Cargar eventos reales
  useEffect(() => {
    async function load() {
      try {
        const data = await eventService.getEvents()
        const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []
        setEvents(list)
      } catch (e) {
        console.error("Error cargando eventos:", e)
        setEvents([])
      }
    }
    load()
  }, [])

  // Parseo robusto de fechas
  const parseDate = (raw) => {
    if (!raw) return null
    const d = new Date(raw)
    return isNaN(d.getTime()) ? null : d
  }

  // Agrupar eventos por fecha YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = {}
    for (const ev of events) {
      const d = parseDate(ev.start_date ?? ev.date ?? ev.startDate)
      if (!d) continue
      const key = d.toISOString().slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(ev)
    }
    return map
  }, [events])

  // Datos del mes actual en vista
  const month = viewDate.getMonth()
  const year = viewDate.getFullYear()
  const monthName = viewDate.toLocaleString("es-ES", { month: "long", year: "numeric" })
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7 // Lunes inicio
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNumber = i - startOffset + 1
    const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth
    const date = inMonth ? new Date(year, month, dayNumber) : null
    return { inMonth, dayNumber: inMonth ? dayNumber : null, date }
  })

  const fmtISO = (d) => (d ? d.toISOString().slice(0, 10) : null)
  const todayISO = fmtISO(new Date())

  // Navegación de mes
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const goToday = () => {
    const now = new Date()
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDate(fmtISO(now))
  }

  return (
    <div className="w-full mx-auto max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna del calendario */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar de mes y chips de categorías */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1F2937]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-[#1F2937] capitalize">{monthName}</h3>

              <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1F2937]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button onClick={goToday} className="ml-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
                Hoy
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {Object.keys(CATEGORY_STYLES).map((cat) => (
                <div key={cat} className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${CATEGORY_STYLES[cat].chip}`}>
                  <span className={`w-2 h-2 rounded-full ${CATEGORY_STYLES[cat].dot}`} />
                  {cat}
                </div>
              ))}
            </div>
          </div>

          {/* Grid del calendario: blanco y responsive */}
          <div className="grid grid-cols-7 bg-white rounded-lg border border-gray-200 shadow-sm w-full">
            {WEEK_LABELS.map((label) => (
              <div key={label} className="text-center text-sm font-bold text-gray-500 p-3 border-b border-gray-200">
                {label}
              </div>
            ))}

            {cells.map((cell, idx) => {
              if (!cell.inMonth) {
                return <div key={idx} className="border-r border-b border-gray-200" />
              }

              const iso = fmtISO(cell.date)
              const hasEvents = !!eventsByDate[iso]
              const isToday = iso === todayISO
              const isSelected = selectedDate === iso

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(iso)}
                  className={`relative p-2 border-r border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50 hover:bg-blue-100" : ""
                  }`}
                  style={{ minHeight: "90px" }}
                >
                  {/* Número del día (negro, badge si hoy/seleccionado) */}
                  <div
                    className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                      isToday || isSelected ? "bg-blue-600 text-white" : "text-[#1F2937]"
                    }`}
                  >
                    {cell.dayNumber}
                  </div>

                  {/* Puntos de color por eventos del día */}
                  {hasEvents && (
                    <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                      {eventsByDate[iso].slice(0, 6).map((ev, i) => {
                        const cat = getCategory(ev)
                        const dot = CATEGORY_STYLES[cat]?.dot ?? "bg-gray-400"
                        return <span key={i} className={`w-2 h-2 rounded-full ${dot}`} />
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel lateral de eventos */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[#1F2937]">
            {selectedDate
              ? `Eventos del ${new Date(selectedDate).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}`
              : "Selecciona un día"}
          </h3>

          <div className="flex flex-col gap-4 overflow-y-auto">
            {selectedDate && eventsByDate[selectedDate] ? (
              eventsByDate[selectedDate].map((ev) => {
                const cat = getCategory(ev)
                const chip = CATEGORY_STYLES[cat]?.chip ?? "bg-gray-100 text-gray-700"
                return (
                  <div
                    key={ev.id ?? `${ev.title}-${ev.start_date ?? ev.date}`}
                    onClick={() => ev.id && navigate(`/eventos/${ev.id}`)}
                    className="flex flex-col gap-3 p-4 rounded-lg bg-gray-50 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-[#1F2937]">{ev.title ?? "Evento"}</p>
                      <p className="text-sm text-gray-500">
                        {(ev.start_time ?? ev.time) || ""} {ev.place ? `- ${ev.place}` : ""}
                      </p>
                    </div>
                    <div className="flex">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${chip}`}>
                        {cat}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <p className="font-bold text-[#1F2937]">No hay eventos programados</p>
                <p className="text-sm text-gray-500">¡Anímate y crea uno!</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}