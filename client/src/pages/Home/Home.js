import React from "react";
import ChatBot from "../../components/ChatBot/ChatBot";
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
      <ChatBot />
    </div>
  );
};

export default Home;
