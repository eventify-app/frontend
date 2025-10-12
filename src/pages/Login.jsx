import Main from "../layouts/Main"

const Login = () => {
  return (
    <Main>
      <section className="p-5 md:p-8 bg-white shadow-lg rounded-4xl gap-8 w-full max-w-xl flex flex-col items-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Bienvenido a <span className="text-primary">Eventify</span></h1>
          <p className="text-sm text-gray-600">Inicia sesión para continuar</p>
        </div>

        <form className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <label className="sr-only">Usuario</label>
            <input className="w-full border-0 bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary"
              type="text"
              name="user"
              placeholder="Usuario"  
            />

            <label className="sr-only">Contraseña</label>
            <input className="w-full border-0 bg-background p-4 rounded-2xl placeholder-gray-500 focus:outline-primary"
              type="password"
              name="user"
              placeholder="Contraseña"  
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
