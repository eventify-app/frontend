import Main from "../layouts/Main"
import { Link } from "react-router-dom"

const Terminos = () => {
  return (
    <Main>
      <section className="p-4 sm:p-6 md:p-10 bg-white shadow-lg rounded-3xl w-full max-w-3xl mx-auto my-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">
          Términos y Condiciones
        </h1>

        <p className="text-gray-700 mb-4 text-justify">
          Bienvenido a <span className="font-semibold text-primary">Eventify</span>. Al registrarte y usar nuestra
          plataforma, aceptas cumplir con los siguientes términos y condiciones. Te recomendamos leerlos
          cuidadosamente antes de continuar.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          1. Uso del servicio
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          Eventify es una plataforma para la gestión de eventos. No se permite el uso del servicio para fines ilícitos,
          fraudulentos o que infrinjan los derechos de terceros. Nos reservamos el derecho de suspender o eliminar
          cuentas que incumplan estos términos.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          2. Registro de usuario
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          Al registrarte, aceptas proporcionar información veraz, completa y actualizada. Eres responsable de mantener
          la confidencialidad de tu cuenta y contraseña, así como de todas las actividades realizadas bajo tu perfil.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          3. Propiedad intelectual
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          Todos los derechos sobre el contenido, el diseño, las marcas y los recursos visuales de Eventify pertenecen
          a sus respectivos propietarios. No está permitido reproducir, distribuir o modificar ningún elemento sin
          autorización previa por escrito.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          4. Responsabilidad del usuario
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          El usuario se compromete a hacer un uso adecuado de la plataforma y de los servicios ofrecidos. Eventify no
          se hace responsable por los daños o perjuicios derivados de un uso indebido de la aplicación.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          5. Modificaciones
        </h2>
        <p className="text-gray-700 mb-6 text-justify">
          Eventify se reserva el derecho de modificar estos términos en cualquier momento. Las actualizaciones serán
          publicadas en esta misma página, y el uso continuado de la plataforma implicará la aceptación de los nuevos
          términos.
        </p>

        <p className="text-gray-600 text-sm text-center">
          Si tienes dudas sobre estos Términos y Condiciones, puedes contactarnos a través del correo{" "}
          <a href="mailto:soporte@eventify.com" className="text-primary underline">
            soporte@eventify.com
          </a>
          
        </p>
        <br />
        <p className="text-gray-600 text-sm text-center">
          Fecha de última actualización: <span className="font-medium">15 de octubre de 2025</span>
        </p>


      </section>
    </Main>
  )
}

export default Terminos
