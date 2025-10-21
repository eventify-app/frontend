import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from "./layouts/Header";


import Home from './pages/Home'
import Login from './pages/Login'

import Registro from './pages/Register'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />

          <Route path="/register" element={<Registro />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App




