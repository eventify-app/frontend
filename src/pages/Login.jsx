import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../api/services/authService"
import { useAuth } from "../context/AuthContext"
import Main from "../layouts/Main"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { setToken, setUser } = useAuth()

  const validateForm = () => {
    const errors = {}

    if (!username.trim()) {
      errors.username = "El usuario es obligatorio"
    }

    if (!password.trim()) {
      errors.password = "La contraseña es obligatoria"
    } else if (password.length < 4) {
      errors.password = "La contraseña debe tener mínimo 4 caracteres"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!validateForm()) return

    try {
      setLoading(true)
      const data = await authService.login({ username, password })

      if (!data.access) {
        throw new Error("Token no recibido")
      }

      setToken(data.access)
      setUser(data.user)

      if (data.user?.is_admin) {
        navigate("/admin-dashboard")
      } else {
        navigate("/explorer")
      }
    } catch (err) {
      console.error("Error de login:", err)
      setError("Usuario o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main>
      <section className="p-5 md:p-8 bg-card-background shadow-lg rounded-4xl gap-8 w-full max-w-xl flex flex-col items-center">

        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center">
            Bienvenido a <span className="text-primary">Eventify</span>
          </h1>
          <p className="text-sm text-muted">Inicia sesión para continuar</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium text-center">{error}</p>
        )}

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          
          {/* USERNAME */}
          <div className="flex flex-col gap-1">
            <input
              className={`w-full border bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary ${
                fieldErrors.username ? "border-red-500" : "border-transparent"
              }`}
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setFieldErrors((prev) => ({ ...prev, username: null }))
              }}
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-xs">{fieldErrors.username}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <input
              className={`w-full border bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary ${
                fieldErrors.password ? "border-red-500" : "border-transparent"
              }`}
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFieldErrors((prev) => ({ ...prev, password: null }))
              }}
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-xs">{fieldErrors.password}</p>
            )}
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 px-4 text-white bg-primary rounded-2xl transition-colors font-bold text-lg cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/80"
            }`}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </section>
    </Main>
  )
}

export default Login
