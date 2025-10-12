
const EventCard = () => {
  return (
    <article className="overflow-hidden flex flex-col flex-1 bg-white rounded-3xl gap-4 pb-6 shadow-sm hover:shadow-lg transition-all">
      <header className="">
        <img className="h-44 hidden object-cover w-full md:block" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d2a01870de-0819ea0b4fe5416e4932.png" alt="" />
      </header>
      
      <div className="px-3 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="bg-gradient-to-r from-teal-800 to-teal-700 text-white px-3 py-1 rounded-full text-sm font-medium" >Juegos</span>

          <div className="flex gap-2 items-center">
            <img className="w-6 rounded-full" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg" alt="" />
            <span className="text-sm">Japeto</span>
          </div>
        </div>

        <div>
          <h1 className="font-bold text-xl text-gray-900">Torneo de FIFA</h1>
          <p className="text-gray-700">El ganador se lleva un six pack.</p>
        </div>
      </div>

      <footer className="flex justify-center gap-7 text-gray-600">
        <div className="flex gap-1">
          <svg className="h-4" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="calendar-days" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
            <path fill="currentColor" d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"></path>
          </svg>
          <small>15 Nov, 2025</small> 
        </div>

        <div className="flex gap-1">
          <svg className="h-4" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg="">
            <path fill="currentColor" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
          </svg>
          <small>B13 - auditorio 2</small>
        </div>
      </footer>

      <button className="bg-teal-800 text-white px-5 py-2 rounded-lg font-medium hover:shadow-md hover:bg-teal-800/80 transition-all flex-none cursor-pointer self-center">Unirse</button>

    </article>
  )

}

export default EventCard