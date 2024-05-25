import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import NotificationPage from './pages/notifications/Notification.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
   <div className='flex max-w-6xl mx-auto'>
    <Sidebar/>
    <Routes>
    
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/login' element={<LoginPage/>}></Route>
      <Route path='/signup' element={<SignUpPage/>}></Route>
      <Route path='/notifications' element={<NotificationPage/>}></Route>
      <Route path='/profile/:username' element={<ProfilePage/>}></Route>

    </Routes>
<RightPanel/>
   
   </div>
    </>
  )
}

export default App
