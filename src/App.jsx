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
import MyProfile from "./pages/MyProfile";
import EventDetail from "./pages/EventDetail";
import { useEffect } from "react";
import VerifyEmail from "./pages/VerifyEmail";
import CalendarioEventos from "./pages/Calendario";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  
  if (mediaQuery.matches) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  mediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  });
}, []);

  return (
    <>
      <BrowserRouter>
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

          {/* Mis eventos (solo visible al usuario logueado) */}
          <Route path="/my-events" element={<MyEvents />} />

          <Route path="/profile" element={<MyProfile />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/calendar" element={<CalendarioEventos />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
