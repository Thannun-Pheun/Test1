import React from 'react'
import { Navigate } from 'react-router-dom'

import SideBar from '../layouts/SideBar'

const Protected = () => {
  if(sessionStorage.getItem('email') && sessionStorage.getItem('password')) {
    return <SideBar/>
  }
  return <Navigate  to={"/"} replace /> 
}

export default Protected