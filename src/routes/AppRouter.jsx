import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { HomePage } from '../home/pages/HomePage'
import { LoginScreen } from '../home/pages/LoginScreen'
import ProtectedRoute from './ProtectedRoute'
import { CarritoPage } from '../components/CarritoPage'
import { RegisterScreen } from '../home/pages/RegisterScreen'

export const AppRouter = () => {
  return (
    <>
        <BrowserRouter>

            <Routes>
                
                <Route path='/login' element={<LoginScreen/>}/>
                <Route path='/register' element={<RegisterScreen/>}/>

                <Route element={<ProtectedRoute/>}>
                    <Route path='/home' element={<HomePage/>}/>
                    <Route path='/' element={<HomePage/>}/>
                    <Route path='/carrito' element={<CarritoPage/>}/>
                </Route>
                

                {/* <Route path='/home' element={<HomePage/>}/>
                <Route path='/' element={<HomePage/>}/> */}

            </Routes>

        </BrowserRouter>
    </>
  )
}
