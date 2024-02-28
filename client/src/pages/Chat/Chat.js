import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { AiOutlineSend } from "react-icons/ai";
import { db } from "../../firbase";
import {
  addDoc,
  serverTimestamp,
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { SendIcon } from "../../components/Icons/Icons";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);


  const userData = localStorage.getItem("data"); 
  const username = JSON.parse(userData).name;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const sendMessage = async () => {
    
    console.log("Hello");
    console.log(username); 
    
    await addDoc(collection(db, "messages"), {
      message: message,
      username: username,
      createdAt: serverTimestamp(),
    });
    setMessage("");
  };
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      console.log(sortedMessages);
      setMessages(sortedMessages);
    });
   
    return () => unsubscribe;
    
  }, []);
  return (
    <div className="flex">
      <Navbar/>
      <div className="w-3/4 m-0  h-screen overflow-clip">
        <div className="flex flex-row items-center px-6 py-4 bg-teal-100 w-full h-fit shadow-lg">
          <h1 className="ml-4 text-3xl font-semibold text-teal-800 ">
            Support Group
          </h1>
        </div>
        <div className="flex flex-col px-4 py-1 h-[470px]  overflow-scroll ">
          {messages?.map((message) => (
            <div
              key={message?.id}
              className={` ${message?.username === username ? "self-end" : ""}`}
            >
              {message?.username !== username ? (
                <div className="flex flex-row items-center">
                  <img
                    className="w-[30px] h-[30px] rounded-full"
                    src="https://htmlstream.com/preview/unify-v2.6/assets/img-temp/400x450/img5.jpg"
                  />
                  <h1 className="self-end ml-2">{message?.username}</h1>
                </div>
              ) : null}

              <div
                className={`mb-4 ml-8 px-4 py-2 rounded-lg max-w-[350px] ${
                  message?.username === username
                    ? "self-end bg-teal-200 text-teal-800"
                    : "bg-white shadow w-fit text-gray-700"
                } `}
              >
                <h1 className="text-xl font-semibold">{message?.message}</h1>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}> </div>
        </div>
        
        <div className="bottom-4 pt-1 px-8 w-full flex flex-row items-center">
          <div className="p-2 w-full border-2 border-gray-200 shadow-md rounded">
            <input
              type="text"
              className="text-lg w-full outline-none"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                  scrollToBottom();
                }
              }}
            />
          </div>
          
          <div className="ml-4 cursor-pointer" 
                onClick = {(e)=>{
                  sendMessage();
                  scrollToBottom();
                }} >
           <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
