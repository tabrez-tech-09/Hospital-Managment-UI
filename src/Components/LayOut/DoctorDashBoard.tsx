import React from 'react'
import SideBar from '../Doctor/SideBar'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'

const DoctorDashBoard = () => {
  return (
    <div className='flex'>
        <SideBar/>
        <div className='w-full overflow-hidden flex flex-col h-[1600px]'>
          <Header/>
          
          <Outlet/>
        </div>
    </div>
  )
}

export default DoctorDashBoard