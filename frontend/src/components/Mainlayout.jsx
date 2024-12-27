import React from 'react'
import { Outlet } from 'react-router-dom'
import idebar from './LeftSidebar'

const Mainlayout = () => {
  return (
    <div>
      <LeftSidebar/>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default Mainlayout
