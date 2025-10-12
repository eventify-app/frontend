
const Hero = () => {
  return (
    <section className="flex items-center gap-x-20 gap-y-6 flex-col md:flex-row grow-0">
      <div className="flex flex-col gap-6 md:flex-1">
        <h2 className="font-bold text-4xl md:text-6xl">Descubre y crea eventos en el campus</h2>
        <p>Eventify es tu plataforma ideal para descubrir y organizar eventos universitarios. Conéctate con tus compañeros, explora actividades diversas y aprovecha al máximo la vida en el campus.</p>

        <div className="flex gap-3">
          <button className="cursor-pointer rounded-full font-bold bg-indigo-700 hover:bg-indigo-700/75 p-3 text-indigo-100">Explorar eventos</button>
          <button className="cursor-pointer rounded-full font-bold bg-indigo-100 hover:bg-indigo-200/80 p-3 text-indigo-700">Crear eventos</button>
        </div>
      </div>

      <img className="rounded-3xl hidden shadow-lg shadow-gray-800/40 max-w-full h-auto shrink overflow-hidden md:flex-1 md:inline" src="https://plus.unsplash.com/premium_photo-1663051303500-c85bef3f05f6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
    </section>
  )
}

export default Hero
