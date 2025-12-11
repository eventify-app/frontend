import { useState, useRef, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { authService } from "../api/services/authService"
import ThemeToggle from "../components/ThemeToggle"

const Header = () => {
  const { token, setToken } = useAuth()
  const [openMenu, setOpenMenu] = useState(false)
  const [avatar, setAvatar] = useState("/assets/avatar-profile.png")
  const menuRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const updateAvatar = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.profile_photo) {
        setAvatar(storedUser.profile_photo);
      }
    };

    // Escucha cuando ProfilePage dispara el evento
    window.addEventListener("user-updated", updateAvatar);

    // Cleanup
    return () => {
      window.removeEventListener("user-updated", updateAvatar);
    };
  }, []);


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

  // Leer avatar del storage al montar el componente
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser && storedUser.profile_photo) {
      setAvatar(storedUser.profile_photo)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setToken(null)
    navigate("/")
  }

  return (
    <header className="fixed top-0 my-3 w-full rounded-2xl max-w-340 px-8 py-4 bg-card-background/75 border z-50">
      <div className="max-w-7xl flex justify-between m-auto items-center">

        {/* Logo */}
        <a className="flex items-center gap-2" href="/">
          <svg className='h-9 text-indigo-500' fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
          </svg>
          <h2 className="text-xl font-bold">Eventify</h2>
        </a>

        {
          token
          && (
            <div className="hidden md:flex items-center gap-2 text-sm font-bold text-primary">
              <NavLink to="/explorer" className={
                ({ isActive }) => `hover:bg-amber-100 rounded-lg px-4 py-2 flex items-center
                ${ isActive ? "bg-indigo-600 hover:bg-indigo-600/90 text-white" : ""}` }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" id="mdi-calendar-search" fill="currentColor" stroke="none" className="h-5 mr-2" viewBox="0 0 24 24"><path d="M15.5,12C18,12 20,14 20,16.5C20,17.38 19.75,18.21 19.31,18.9L22.39,22L21,23.39L17.88,20.32C17.19,20.75 16.37,21 15.5,21C13,21 11,19 11,16.5C11,14 13,12 15.5,12M15.5,14A2.5,2.5 0 0,0 13,16.5A2.5,2.5 0 0,0 15.5,19A2.5,2.5 0 0,0 18,16.5A2.5,2.5 0 0,0 15.5,14M19,8H5V19H9.5C9.81,19.75 10.26,20.42 10.81,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V13.03C20.5,12.22 19.8,11.54 19,11V8Z"/></svg>
                  Explorar
              </NavLink>
              <NavLink to="/calendar" className={
                ({ isActive }) => `hover:bg-amber-100 rounded-lg px-4 py-2 flex items-center
                ${ isActive ? "bg-indigo-600 hover:bg-indigo-600/90 text-white" : "text-primary"}` }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar h-5 w-5 mr-2" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                  Calendario
              </NavLink>
              <NavLink to="/my-events" className={
                ({ isActive }) => `hover:bg-amber-100 rounded-lg px-4 py-2 flex items-center
                ${ isActive ? "bg-indigo-500 hover:bg-indigo-600/90 text-white" : "text-primary "}` }
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" className="h-5 mr-2" id="mdi-calendar-edit-outline" viewBox="0 0 24 24"><path d="M21.7 13.35L20.7 14.35L18.65 12.35L19.65 11.35C19.85 11.14 20.19 11.13 20.42 11.35L21.7 12.63C21.89 12.83 21.89 13.15 21.7 13.35M12 18.94V21H14.06L20.12 14.88L18.07 12.88L12 18.94M5 19H10V21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3H6V1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5V9H5V19M5 5V7H19V5H5Z"/></svg>
                  Mis eventos
              </NavLink>
            </div>
          )
        }

        <div className="flex gap-3 items-center">
          <ThemeToggle />

          {token ? (
            <div className="relative top-0.5" ref={menuRef}>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="focus:outline-none"
              >
                <img
                  src={avatar || "/assets/avatar-profile.png"}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full border-2 border-primary"
                />
              </button>

              {openMenu && (
                <div className="absolute -left-16 mt-2 w-44 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2">
                    <NavLink
                      to="/my-profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Ver perfil
                    </NavLink>
                    <NavLink
                      to="/edit-account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Editar cuenta
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <a href="/login" className="font-bold text-primary hover:text-primary/75">Ingresar</a>
              <a href="/register">
                <button className="cursor-pointer p-3 bg-primary transition-colors hover:bg-primary/70 font-bold shadow-lg shadow-primary/20 text-white rounded-full">Registrarse</button>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
