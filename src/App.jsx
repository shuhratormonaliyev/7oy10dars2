import React, {useEffect,useState} from 'react'
import MainLayout from './Layouts/MainLayout'
import { Route, Routes } from 'react-router-dom'
import Like from "./pages/Like"
import Home from "./pages/Home"
import Details from "./pages/Details"
import http from './axios'
function App() {  
 
  return (
    <div className='w-full'>
      <MainLayout>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/like' element={<Like></Like>}></Route>
          <Route path='/details/:id' element={<Details></Details>}></Route>
        </Routes>
      </MainLayout>
    </div>
  )
}

export default App