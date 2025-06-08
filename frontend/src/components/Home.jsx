import React from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSidebar from './RightSidebar'

const Home = () => {
  return (
    <div className='flex'>
        <Feed/>
                <RightSidebar />
    </div>
  )
}

export default Home
