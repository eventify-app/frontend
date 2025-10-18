import Main from "../layouts/Main"
import { Link } from "react-router-dom"

const Privacidad = () => {
  return (
    <Main>
      <section className="p-4 sm:p-6 md:p-10 bg-white shadow-lg rounded-3xl w-full max-w-3xl mx-auto my-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">
          Política de Privacidad
        </h1>

        <p className="text-gray-700 mb-4 text-justify">
          En <span className="font-semibold text-primary">Eventify</span> respetamos tu privacidad y protegemos tus datos
          personales conforme a las leyes vigentes. Esta política explica cómo recopilamos, usamos y protegemos tu
          información.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          1. Información que recopilamos
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          Recopilamos los datos que proporcionas al registrarte, como nombre, correo electrónico, fecha de nacimiento,
          número de teléfono y credenciales de acceso. También podemos recopilar información técnica, como la dirección
          IP y datos del dispositivo.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          2. Uso de la información
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          Utilizamos tus datos para crear y administrar tu cuenta, ofrecer soporte, personalizar la experiencia y
          mejorar los servicios de Eventify. No compartimos tu información con terceros sin tu consentimiento, salvo por
          obligación legal.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          3. Protección de datos
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          Aplicamos medidas de seguridad técnicas y organizativas para proteger tus datos contra pérdida, robo o acceso
          no autorizado. Sin embargo, ningún sistema es completamente seguro, por lo que recomendamos mantener la
          confidencialidad de tus credenciales.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          4. Derechos del usuario
        </h2>
        <p className="text-gray-700 mb-4 text-justify">
          Puedes acceder, actualizar o eliminar tu información personal en cualquier momento desde tu cuenta o
          contactándonos al correo{" "}
          <a href="mailto:privacidad@eventify.com" className="text-primary underline">
            privacidad@eventify.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          5. Cambios en la política
        </h2>
        <p className="text-gray-700 mb-6 text-justify">
          Eventify podrá actualizar esta política en cualquier momento. Te notificaremos sobre cambios importantes por
          correo electrónico o mediante la plataforma.
        </p>

        <p className="text-gray-600 text-sm text-center">
          Fecha de última actualización: <span className="font-medium">15 de octubre de 2025</span>
        </p>


      </section>
    </Main>
  )
}

export default Privacidad
