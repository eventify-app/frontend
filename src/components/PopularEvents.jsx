import EventCard from "./EventCard"

const PopularEvents = () => {
  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-bold">Eventos destacados</h2>
        <a href="" className="text-primary">Ver todos</a>
      </div>
      <div className="flex flex-col w-full justify-center gap-4 md:flex-row">
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </section>
  )
}

export default PopularEvents