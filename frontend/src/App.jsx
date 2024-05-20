import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <div className='flex max-w-6xl mx-auto'>
    <Routes>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/signup' element={<SignUpPage/>}></Route>
    </Routes>
   
   </div>
    </>
  )
}

export default App
