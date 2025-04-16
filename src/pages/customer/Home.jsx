import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import "../../styles/customer.css"; // Import the customer.css file
import Navbar from '../../components/Customer/Navbar';


const Home = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  },);

  return (
    <div>
      <h1>Welcome to Our Store</h1>
    </div>
  );
};

export default Home;