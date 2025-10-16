import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Main from "../layouts/Main"
import axiosInstance from "../api/axiosInstance"


const Register = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [datosFormulario, setDatosFormulario] = useState({
        nombre: "",
        apellido: "",
        usuario: "",
        correo: "",
        contraseña: "",
        confirmarContraseña: "",
        fechaNacimiento: "",
        telefono: "",
        terminos: false,
        privacidad: false,
    })

    const [errores, setErrores] = useState({})
    const [registroExitoso, setRegistroExitoso] = useState(false)
    const [enviando, setEnviando] = useState(false)

    const limpiarFormulario = () => {
        setDatosFormulario({
            nombre: "",
            apellido: "",
            usuario: "",
            correo: "",
            contraseña: "",
            confirmarContraseña: "",
            fechaNacimiento: "",
            telefono: "",
            terminos: false,
            privacidad: false,
        })
        setErrores({})
    }

    const validarCampo = (nombre, valor, datosActualizados = datosFormulario) => {
        switch (nombre) {
            case "nombre":
            case "apellido":
            case "usuario":
                return valor.trim() ? "" : "Este campo es obligatorio"
            case "correo":
                return /\S+@\S+\.\S+/.test(valor) ? "" : "Correo inválido"
            case "contraseña":
                return valor.length >= 6 ? "" : "Mínimo 6 caracteres"
            case "confirmarContraseña":
                return valor === datosActualizados.contraseña ? "" : "Las contraseñas no coinciden"
            case "fechaNacimiento":
                return valor ? "" : "La fecha es obligatoria"
            case "telefono":
                return valor && !/^(\+57)?\d{10}$/.test(valor)
                    ? "Número inválido. Debe tener 10 dígitos (puede iniciar con +57)"
                    : ""
            case "terminos":
                return valor ? "" : "Debes aceptar los términos y condiciones"
            case "privacidad":
                return valor ? "" : "Debes aceptar la política de privacidad"
            default:
                return ""
        }
    }


    const validar = () => {
        const nuevosErrores = {}
        for (const campo in datosFormulario) {
            const error = validarCampo(campo, datosFormulario[campo])
            if (error) nuevosErrores[campo] = error
        }
        setErrores(nuevosErrores)
        return Object.keys(nuevosErrores).length === 0
    }

    const manejarCambio = (e) => {
        const { name, value, type, checked } = e.target
        const nuevoValor = type === "checkbox" ? checked : value

        const datosActualizados = { ...datosFormulario, [name]: nuevoValor }
        setDatosFormulario(datosActualizados)

        const error = validarCampo(name, nuevoValor, datosActualizados)
        const erroresActualizados = { ...errores, [name]: error }

        if (name === "contraseña" || name === "confirmarContraseña") {
            erroresActualizados.confirmarContraseña = validarCampo(
                "confirmarContraseña",
                datosActualizados.confirmarContraseña,
                datosActualizados
            )
        }

        setErrores(erroresActualizados)
    }

    const manejarEnvio = async (e) => {
        e.preventDefault()
        if (!validar()) return
        setEnviando(true)

        try {
            const datos = {
                first_name: datosFormulario.nombre,
                last_name: datosFormulario.apellido,
                username: datosFormulario.usuario,
                email: datosFormulario.correo,
                password: datosFormulario.contraseña,
                date_of_birth: datosFormulario.fechaNacimiento,
                phone: datosFormulario.telefono,
            }

            const respuesta = await axiosInstance.post("/users/register/", datos)
            console.log("Registro exitoso:", respuesta)

            limpiarFormulario()
            setRegistroExitoso(true)

            setTimeout(() => {
                navigate("/login")
            }, 2000)
        } catch (error) {
            const backendErrors = error?.response?.data
            if (backendErrors) {
                const nuevosErrores = { ...errores }
                if (backendErrors.email) {
                    nuevosErrores.correo = Array.isArray(backendErrors.email)
                        ? backendErrors.email[0]
                        : backendErrors.email
                }
                if (backendErrors.username) {
                    nuevosErrores.usuario = Array.isArray(backendErrors.username)
                        ? backendErrors.username[0]
                        : backendErrors.username
                }
                if (backendErrors.phone) {
                    nuevosErrores.telefono = Array.isArray(backendErrors.phone)
                        ? backendErrors.phone[0]
                        : backendErrors.phone
                }
                setErrores(nuevosErrores)
            } else {
                console.error("Error inesperado:", error?.message || error)
                setErrores(prev => ({ ...prev, general: "No se pudo completar el registro" }))
            }
        } finally {
            setEnviando(false)
        }
    }

    return (
        <Main>
            <section className="p-5 md:p-8 bg-white shadow-lg rounded-4xl gap-8 w-full max-w-4xl flex flex-col items-center">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-gray-900 text-center">
                        Bienvenido a <span className="text-primary">Eventify</span>
                    </h1>
                    <p className="text-sm text-gray-600">Crea tu cuenta para comenzar</p>
                </div>

                {registroExitoso && (
                    <div className="flex flex-col items-center gap-2 text-green-600 text-center font-semibold animate-fade-in">
                        <p>¡Registro exitoso!</p>
                        <p>Redirigiendo al login...</p>
                        <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin mt-2"></div>
                    </div>
                )}

                {errores.general && (
                    <p className="text-red-500 text-sm mt-1">{errores.general}</p>
                )}

                <form className="w-full flex flex-col gap-6" onSubmit={manejarEnvio}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { nombre: "nombre", tipo: "text", etiqueta: "Nombre" },
                            { nombre: "apellido", tipo: "text", etiqueta: "Apellido" },
                            { nombre: "usuario", tipo: "text", etiqueta: "Usuario" },
                            { nombre: "correo", tipo: "email", etiqueta: "Correo electrónico" },
                            { nombre: "contraseña", tipo: "password", etiqueta: "Contraseña" },
                            { nombre: "confirmarContraseña", tipo: "password", etiqueta: "Confirmar contraseña" },
                            { nombre: "fechaNacimiento", tipo: "date", etiqueta: "Fecha de nacimiento" },
                            { nombre: "telefono", tipo: "tel", etiqueta: "Teléfono (opcional)" },
                        ].map((campo) => (
                            <div key={campo.nombre}>
                                <input
                                    type={campo.tipo}
                                    name={campo.nombre}
                                    placeholder={campo.etiqueta}
                                    value={datosFormulario[campo.nombre]}
                                    onChange={manejarCambio}
                                    className="w-full border-0 bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary"
                                />
                                {errores[campo.nombre] && (
                                    <p className="text-red-500 text-sm mt-1">{errores[campo.nombre]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 items-center text-center">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="terminos"
                                checked={datosFormulario.terminos}
                                onChange={manejarCambio}
                                className="w-5 h-5 text-primary focus:ring-primary rounded"
                            />
                            Acepto los{" "}
                            <Link to="/terminos" target="_blank" className="text-primary underline">
                                Términos y Condiciones
                            </Link>
                        </label>
                        {errores.terminos && <p className="text-red-500 text-sm">{errores.terminos}</p>}

                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="privacidad"
                                checked={datosFormulario.privacidad}
                                onChange={manejarCambio}
                                className="w-5 h-5 text-primary focus:ring-primary rounded"
                            />
                            Acepto la{" "}
                            <Link to="/privacidad" target="_blank" className="text-primary underline">
                                Política de Privacidad
                            </Link>
                        </label>
                        {errores.privacidad && <p className="text-red-500 text-sm">{errores.privacidad}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={enviando}
                        className={`w-full max-w-sm mx-auto py-3 px-4 border text-white cursor-pointer rounded-2xl font-bold text-lg transition-colors ${enviando ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/80"
                            }`}
                    >
                        {enviando ? "Registrando..." : "Registrarse"}
                    </button>
                </form>
            </section>
        </Main>
    )
}

export default Register
