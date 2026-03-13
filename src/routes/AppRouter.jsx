import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { HomePage } from '../home/pages/HomePage'
import { LoginScreen } from '../home/pages/LoginScreen'
//import { LoginScreen } from '../home/pages/LoginScreen'
//import { HomePage } from '../home/pages/HomePage'

export const AppRouter = () => {
  return (
    <>
        <BrowserRouter>

            <Routes>

                <Route path='/login' element={<LoginScreen/>}/>
                <Route path='/home' element={<HomePage/>}/>
                <Route path='/' element={<HomePage/>}/>

            </Routes>

        </BrowserRouter>
    </>
  )
}
