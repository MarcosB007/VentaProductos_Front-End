import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { HomePage } from '../home/pages/HomePage'
import { LoginScreen } from '../home/pages/LoginScreen'
import ProtectedRoute from './ProtectedRoute'

export const AppRouter = () => {
  return (
    <>
        <BrowserRouter>

            <Routes>
                
                <Route path='/login' element={<LoginScreen/>}/>

                <Route element={<ProtectedRoute/>}>
                    <Route path='/home' element={<HomePage/>}/>
                    <Route path='/' element={<HomePage/>}/>
                </Route>
                

                {/* <Route path='/home' element={<HomePage/>}/>
                <Route path='/' element={<HomePage/>}/> */}

            </Routes>

        </BrowserRouter>
    </>
  )
}
