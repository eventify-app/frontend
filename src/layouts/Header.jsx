import { useState, useRef, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { authService } from "../api/services/authService"

const Header = () => {
  const { token, setToken } = useAuth()
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef()
  const navigate = useNavigate()


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Función centralizada de logout
  const handleLogout = () => {
    authService.logout(); // llama al servicio que limpia el token
    setToken(null);       // limpia el contexto
    navigate("/");        // redirige al inicio (usando useNavigate)
  };

  return (
    <header className="fixed top-0 w-full px-3 py-4 bg-background border-b border-primary/10">
      <div className="max-w-7xl flex justify-between m-auto">

        <a className="flex items-center" href="">
          <svg className='h-9 text-primary' fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
          </svg>

          <h2 className="text-xl font-bold">Eventify</h2>
        </a>

        {
          token
          && (
            <div className="flex items-center gap-5 text-sm font-bold text-gray-600">
              <a className="hover:text-primary" href="/explorer">Explorar</a>
              <a className="hover:text-primary" href="/calendar">Calendario</a>
              <a className="hover:text-primary" href="/my-events">Mis eventos</a>
            </div>
          )
        }

        <div className="flex gap-5 items-center">
          {
            token
              ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="focus:outline-none"
                  >
                    <img
                      src="https://i.pravatar.cc/40"
                      alt="Avatar"
                      className="h-12 w-12 rounded-full border-2 border-primary"
                    />
                  </button>

                  {openMenu && (
                    <div className="absolute -left-16 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-2">
                        <NavLink
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Ver perfil
                        </NavLink>
                        <button
                          onClick={handleLogout} //  Usa la función centralizada
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
              : (
                <>
                  <a href="/login" className="font-bold text-primary hover:text-primary/75">Ingresar</a>
                  <a href="/register">
                    <button className="cursor-pointer p-3 bg-primary transition-colors hover:bg-primary/80 font-bold shadow-lg shadow-primary/20 text-white rounded-full">Registrarse</button>
                  </a>
                </>
              )
          }

        </div>
      </div>
    </header>
  )
}

export default Header
