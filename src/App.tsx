import './App.css'
import React, { useEffect } from 'react'
import Home from './Pages/Home/Home'
import Doctor from './Pages/Doctor/Doctor'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import PageNotFound from './Pages/PageNotFound/PageNotFound'
import Signup from './Pages/Signup/Signup'
import Login from './Pages/Login/Login'
import Loading from './components/Loading/loading'
import { useSelector } from 'react-redux'
import ProtectedRoute from './auth/protectedRoute'

function App() {
  const { isloading } = useSelector((state: any) => state.loading)
  const { isAuthenticated } = useSelector((state: any) => state.auth)
  
  return (
    <Routes>
        {isloading && <Loading />}
        <Route path='/' element={<Home />} />
        <Route path='doctors' element={
          <ProtectedRoute>
            <Doctor />
          </ProtectedRoute>
        } />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login/>}  />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
  )
}

export default App
