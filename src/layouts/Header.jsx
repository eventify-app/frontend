import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/services/authService";
import ThemeToggle from "../components/ThemeToggle";
import { HiMenu, HiX } from "react-icons/hi";
import { Bell } from "lucide-react";
import { notificationService } from "../api/services/notificationService";

const Header = () => {
  const { token, user, setToken } = useAuth();

  const avatar = user?.profile_photo || "/assets/avatar-profile.png";
  const userId = user?.id;
  const isAdmin = user?.is_admin === true;

  const [openAvatarMenu, setOpenAvatarMenu] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const menuRef = useRef();
  const mobileMenuRef = useRef();
  const navigate = useNavigate();

  // -----------------------
  // 🔔 NOTIFICATIONS
  // -----------------------
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef();

  // Fetch notificaciones al abrir
  useEffect(() => {
    if (openNotifications) {
      notificationService.getNotifications().then((data) => {
        setNotifications(data.results);
      });
    }
  }, [openNotifications]);

  // Auto recarga cada 1 minuto SOLO si está abierto
  useEffect(() => {
    if (!openNotifications) return;

    const interval = setInterval(() => {
      notificationService.getNotifications().then((data) => {
        setNotifications(data.results);
      });
    }, 60000); // 60s

    return () => clearInterval(interval);
  }, [openNotifications]);

  const handleReadNotification = async (id) => {
    await notificationService.markAsRead(id);

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
      )
    );
  };

  // -----------------------
  // Cerrar al hacer clic fuera
  // -----------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenAvatarMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest(".mobile-menu-button")
      ) {
        setOpenMobileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    navigate("/");
  };

  return (
    <header className="fixed top-0 my-3 w-full rounded-2xl max-w-340 px-4 md:px-8 py-4 bg-card-background/75 border z-50">
      <div className="max-w-7xl flex justify-between m-auto items-center relative">
        
        {/* Mobile Menu Button (solo usuarios comunes) */}
        {!isAdmin && (
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
              className="mobile-menu-button p-2 focus:outline-none"
            >
              {openMobileMenu ? (
                <HiX className="h-6 w-6 text-primary" />
              ) : (
                <HiMenu className="h-6 w-6 text-primary" />
              )}
            </button>
          </div>
        )}

        {/* Logo */}
        <div className={`flex items-center justify-center ${token ? "md:justify-start" : ""}`}>
          <a className="flex items-center gap-2" href="/">
            <svg className="h-8 md:h-9 text-indigo-500" fill="none" viewBox="0 0 48 48">
              <path
                d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                fill="currentColor"
              ></path>
            </svg>
            <h2 className="text-lg md:text-xl font-bold">Eventify</h2>
          </a>
        </div>

        {/* Desktop menu (no admin) */}
        {token && !isAdmin && (
          <nav className="hidden md:flex items-center gap-2 text-sm font-bold text-primary flex-1 justify-center">
            <NavLink
              to="/explorer"
              className={({ isActive }) =>
                `hover:bg-amber-100 rounded-lg px-4 py-2 ${
                  isActive ? "bg-indigo-600 text-white hover:text-primary" : ""
                }`
              }
            >
              Explorar
            </NavLink>

            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `hover:bg-amber-100 rounded-lg px-4 py-2 ${
                  isActive ? "bg-indigo-600 text-white hover:text-primary" : ""
                }`
              }
            >
              Calendario
            </NavLink>

            <NavLink
              to="/my-events"
              className={({ isActive }) =>
                `hover:bg-amber-100 rounded-lg px-4 py-2 ${
                  isActive ? "bg-indigo-600 text-white hover:text-primary" : ""
                }`
              }
            >
              Mis eventos
            </NavLink>
          </nav>
        )}

        {/* Right */}
        <div className="flex gap-3 items-center">

          <ThemeToggle />

          {/* 🔔 NOTIFICATION ICON — AHORA TAMBIÉN PARA ADMIN */}
          {token && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setOpenNotifications(!openNotifications)}
                className="relative p-2 hover:bg-primary/10 rounded-full transition"
              >
                <Bell className="h-6 w-6 text-primary" />

                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full"></span>
                )}
              </button>

              {openNotifications && (
                <div
                  className="
                    absolute right-0 mt-2 w-80 bg-card-background rounded-xl 
                    shadow-lg border z-50 p-3 max-h-96 overflow-y-auto
                    animate-slideFade
                  "
                >
                  <h4 className="text-sm font-bold mb-2">Notificaciones</h4>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No tienes notificaciones</p>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleReadNotification(item.id)}
                        className={`
                          w-full text-left p-3 rounded-lg mb-2 transition 
                          ${item.read ? "text-gray-500" : "bg-primary/10"}
                          hover:bg-primary/20
                        `}
                      >
                        <p className="text-sm font-medium">{item.notification.description}</p>
                        <span className="text-xs opacity-70">
                          {new Date(item.notification.created_at).toLocaleString()}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ADMIN OR USER AVATAR */}
          {token && isAdmin ? (
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-red-600">Admin</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          ) : token ? (
            <>
              {/* Avatar desktop */}
              <div className="hidden md:block relative" ref={menuRef}>
                <button onClick={() => setOpenAvatarMenu(!openAvatarMenu)}>
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-8 w-8 cursor-pointer rounded-full border-2 border-primary"
                  />
                </button>

                {openAvatarMenu && (
                  <div className="absolute right-0 mt-2 w-44 bg-card-background rounded-md shadow-lg z-50 py-2">
                    {userId && (
                      <NavLink
                        to={`/profile/${userId}`}
                        onClick={() => setOpenAvatarMenu(false)}
                        className="block px-4 py-2 text-sm hover:bg-primary"
                      >
                        Ver perfil
                      </NavLink>
                    )}

                    <NavLink
                      to="/edit-account"
                      onClick={() => setOpenAvatarMenu(false)}
                      className="block px-4 py-2 text-sm hover:bg-primary"
                    >
                      Editar cuenta
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 cursor-pointer py-2 text-sm hover:bg-primary"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar móvil */}
              <div className="md:hidden">
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full border-2 border-primary"
                />
              </div>
            </>
          ) : (
            <div className="hidden md:flex gap-4 items-center">
              <a href="/login" className="font-bold text-primary hover:text-primary/75">
                Ingresar
              </a>
              <a href="/register">
                <button className="p-3 bg-primary hover:bg-primary/70 text-white font-bold rounded-full">
                  Registrarse
                </button>
              </a>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {openMobileMenu && token && !isAdmin && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 w-full mt-2 bg-card-background rounded-2xl shadow-lg border z-40"
          >
            <div className="py-4 px-4 space-y-2 flex flex-col">
              <NavLink to="/explorer" onClick={() => setOpenMobileMenu(false)}>
                Explorar
              </NavLink>
              <NavLink to="/calendar" onClick={() => setOpenMobileMenu(false)}>
                Calendario
              </NavLink>
              <NavLink to="/my-events" onClick={() => setOpenMobileMenu(false)}>
                Mis eventos
              </NavLink>

              <div className="border-t pt-3 mt-2 flex flex-col">
                {userId && (
                  <NavLink
                    to={`/profile/${userId}`}
                    onClick={() => setOpenMobileMenu(false)}
                  >
                    Ver perfil
                  </NavLink>
                )}

                <NavLink
                  to="/edit-account"
                  onClick={() => setOpenMobileMenu(false)}
                >
                  Editar cuenta
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}

        {!token && openMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-lg border z-40"
          >
            <div className="py-4 px-4 space-y-2 text-center">
              <a
                href="/login"
                className="block w-full py-2 text-primary font-semibold hover:text-primary/70"
                onClick={() => setOpenMobileMenu(false)}
              >
                Ingresar
              </a>

              <a href="/register" onClick={() => setOpenMobileMenu(false)}>
                <button className="w-full py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/70">
                  Registrarse
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
