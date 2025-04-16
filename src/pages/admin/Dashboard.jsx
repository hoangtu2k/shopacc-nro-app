import React from 'react';
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";

const Dashboard = () => {

  const context = useContext(MyContext);

  useEffect(()=>{
      context.setisHideSidebarAndHeader(false);
      window.scrollTo(0,0);
  },[]);


  return (
    <div>
      
      <h1>Dashboard</h1>
      {/* Thêm nội dung dashboard ở đây */}
    </div>
  );
};

export default Dashboard;