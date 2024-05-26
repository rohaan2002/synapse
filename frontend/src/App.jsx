import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import NotificationPage from './pages/notifications/Notification.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'

function App() {
  const {data: authUser, isLoading,  error, isError} = useQuery({
    queryKey:["authUser"],
    retry: false,
    queryFn: async()=>{
      try{
        const res = await fetch("/api/auth/getme"); // no further specification of method and body as it's a GET request
        const data =await res.json();
				if(data.error) return null;

        if(!res.ok) throw new Error(data.error|| "Something wrong in fetching current user")

          console.log("Auth user is here");
          console.log((data));
          return data;
      }catch(error){
        throw new Error(error)
      }
    }
  })

  if(isLoading){
    return(
      <div className='h-screen flex items-center justify-center'>
        <LoadingSpinner/>
      </div>
    );
  }
  
  return (
    <>
   <div className='flex max-w-6xl mx-auto'>
   { authUser?<Sidebar/>: ""}
    <Routes>
    
      <Route path='/' element={authUser?<HomePage/>:<Navigate to ='/login'/>}></Route>
      <Route path='/login' element={authUser?<Navigate to='/' />:<LoginPage/>}></Route>
      <Route path='/signup' element={authUser?<Navigate to='/'/>:<SignUpPage/>}></Route>
      <Route path='/notifications' element={!authUser?<Navigate to='/login' />:<NotificationPage/>}></Route>
      <Route path='/profile/:username' element={!authUser?<Navigate to='/login' />:<ProfilePage/>}></Route>

    </Routes>
    { authUser?<RightPanel/>: ""}
    <Toaster/>
   
   </div>
    </>
  )
}

export default App
