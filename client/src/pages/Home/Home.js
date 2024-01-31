import React from "react";

import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from 'react-router-dom'
// import { PlaneBufferGeometry } from 'three';


const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  if (!token) {
    navigate("/")
  }
  return (
    <div className="flex flex-row">
      <Navbar />
      
    </div>
  );
};

export default Home;
