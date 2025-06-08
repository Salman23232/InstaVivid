import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const Mainlayout = () => {
  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1 flex justify-between">
        <div className="flex-1  md:ml-[16%]">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Mainlayout;
