
const Footer = () => {
  return (
    <footer className="w-full py-6 border-primary/10 border-t p-3">
      <div className="w-full max-w-7xl flex flex-col mx-auto justify-between gap-4 items-center md:flex-row">
        <div className="flex flex-col items-center text-muted gap-x-5 md:flex-row">
          <a className="hover:text-primary transition-colors" href="#">Politicas de servicio</a>
          <a className="hover:text-primary transition-colors" href="#">Politicas de privacidad</a>
          <a className="hover:text-primary transition-colors" href="#">Contacto</a>
        </div>

        <p className="text-center">© 2025 Eventify. Todos los derechos reservados.</p>
      </div>

    </footer>
  )
}

export default Footer
