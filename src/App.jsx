import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./layouts/Header";

// ✅ Páginas principales
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Register";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents"; // ✅ Importación agregada
import EventForm from "./components/EventForm"; // ✅ Si tu formulario está en components
import ExploreEvents from './pages/ExploreEvents'
import EventDetail from "./pages/EventDetail";
import { useEffect } from "react";
import VerifyEmail from "./pages/VerifyEmail";
import CalendarioEventos from "./pages/Calendario";
import ProfilePage from "./pages/ProfilePage";
import EditAccount from "./pages/EditAccount";

function App() {
  useEffect(() => {
    const root = document.documentElement;

    // 1️⃣ Revisar el almacenamiento primero
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      root.classList.toggle("dark", savedTheme === "dark");
      return;
    }

    // 2️⃣ Si no hay almacenamiento, usar el tema del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    root.classList.toggle("dark", mediaQuery.matches);

    // 3️⃣ Escuchar cambios del tema del sistema
    const handler = (e) => {
      // Solo cambiar si NO hay un theme guardado por el usuario
      const stored = localStorage.getItem("theme");
      if (!stored) {
        root.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <>
      <BrowserRouter viewTransition>
        <Header />
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Información */}
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />

          {/* Eventos */}
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events/create" element={<EventForm />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/events/edit/:id" element={<EventForm isEditMode />} />
          <Route path="/explorer" element={<ExploreEvents />} />
          <Route path="/calendar" element={<CalendarioEventos />} />

          {/* Perfil de usuario */}
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-profile" element={<ProfilePage isCurrentUser />} />
          <Route path="/edit-account" element={<EditAccount />} />



          {/* Mis eventos (solo visible al usuario logueado) */}
          <Route path="/my-events" element={<MyEvents />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
