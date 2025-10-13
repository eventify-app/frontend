
const Header = () => {
  return (
    <header className="fixed top-0 w-full px-3 py-4 bg-background border-b border-primary/10">
      <div className="max-w-7xl flex justify-between m-auto">

        <a className="flex items-center" href="">
          <svg className='h-9 text-primary' fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
          </svg>

          <h2 className="text-xl font-bold">Eventify</h2>
        </a>


        <div className="flex gap-5 items-center">
          <a href="#" className="font-bold text-primary hover:text-primary/75">Ingresar</a>
          <button className="cursor-pointer p-3 bg-primary transition-colors hover:bg-primary/80 font-bold shadow-lg shadow-primary/20 text-white rounded-full">Registrarse</button>
        </div>
      </div>
    </header>
  )
}

export default Header
