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

function App() {
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

          {/* Información */}
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />

          {/* Eventos */}
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events/create" element={<EventForm />} />
          <Route path="/events/edit/:id" element={<EventForm isEditMode />} />

          {/* Mis eventos (solo visible al usuario logueado) */}
          <Route path="/my-events" element={<MyEvents />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
