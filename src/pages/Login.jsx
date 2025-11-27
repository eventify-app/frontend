import { useState } from "react"
import { authService } from "../api/services/authService"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Main from "../layouts/Main"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { setToken } = useAuth() // << importa el contexto

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const data = await authService.login({ username, password })
      
      // 👇 Ajusta según tu backend
      const token = data.token || data.access

      if (!token) throw new Error("Token no recibido")

      // Guardar en localStorage y en contexto
      localStorage.setItem("token", token)
      setToken(token)

      // Redirigir
      navigate("/explorer")
    } catch (err) {
      console.error("Error de login:", err)
      setError("Usuario o contraseña incorrectos")
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

        {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            className="w-full border-0 bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="w-full border-0 bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-3 px-4 text-white bg-primary rounded-2xl hover:bg-primary/80 transition-colors font-bold text-lg cursor-pointer">
            Iniciar sesión
          </button>
        </form>
      </section>
    </Main>
  )
}

export default Login
