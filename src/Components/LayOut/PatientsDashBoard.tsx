import React from 'react'
import SideBar from '../Patients/SideBar'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom'

const PatientsDashBoard = () => {
  return (
    <div className='flex'>
        <SideBar/>
        <div className='w-full flex flex-col h-[16000px]'>
          <Header/>
          <Outlet/>
        </div>
    </div>
  )
}

export default PatientsDashBoard