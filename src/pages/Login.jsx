import { useState } from "react"
import { authService } from "../api/services/authService"
import { useNavigate } from "react-router-dom"
import Main from "../layouts/Main"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = await authService.login({ username, password })
      navigate("/explorer")
    } catch (err) {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <Main>
      <section className="p-5 md:p-8 bg-white shadow-lg rounded-4xl gap-8 w-full max-w-xl flex flex-col items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Bienvenido a <span className="text-primary">Eventify</span></h1>
          <p className="text-sm text-gray-600">Inicia sesión para continuar</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium text-center">{error}</p>
        )}

        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <label className="sr-only">Usuario</label>
            <input className="w-full border-0 bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary"
              type="text"
              name="user"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="sr-only">Contraseña</label>
            <input className="w-full border-0 bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary"
              type="password"
              name="user"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a href="" className="font-medium text-primary hover:text-primary/80 self-end">¿Olvidaste la contraseña?</a>

          <button className="w-full py-3 cursor-pointer px-4 border text-white rounded-2xl bg-primary hover:bg-primary/80 transition-colors font-bold text-lg">Iniciar sesión</button>
        </form>
      </section>
    </Main>
  )
}

export default Login
