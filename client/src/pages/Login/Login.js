import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import wallpaper from "../../assets/login_wallp.png";
import { MdEmail, MdPassword } from "react-icons/md";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [logging, setLogging] = useState(false);
  const login = () => {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        localStorage.setItem("token", response.data.tokens.access.token);
        localStorage.setItem("data", JSON.stringify(response.data.user));
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="w-full h-screen flex">
      <div className="flex flex-col px-36 py-6 flex-grow max-w-[60vw]">
        <div className="mt-32 max-w-[600px]">
          <h1 className="text-5xl leading-tight font-semibold mt-4 text-transparent bg-clip-text bg-gradient-to-r to-sky-600 from-sky-400">
          MentalEase.AI
          </h1>
          <h1 className="mt-4 text-2xl font-normal ">
            Where AI Meets Empathy: Your Mental Health Chat Companion
          </h1>
        </div>
        <img src={wallpaper} className="w-[450px]" />
      </div>
      <div className="flex justify-between flex-grow bg-[#02203c] text-sky-300">
        <div className="p-8 w-full min-h-[300px] px-24 self-center">
          <div
            className="flex flex-col justify-center gap-6"
            // onSubmit={(e) => login(e)}
          >
            <h1 className="text-3xl font-semibold">Login</h1>
            <p className="text-md font-medium">
              Open the Door to Mental Wellness.
            </p>
            <div className="bg-sky-900 shadow p-2 flex items-center rounded-md">
              <MdEmail className="text-sky-500 mr-2" size={18} />
              <input
                type="text"
                placeholder="Enter email"
                className="p-1 w-full text-sm outline-none bg-inherit"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="bg-sky-900 shadow p-2 flex items-center rounded-md">
              <MdPassword className="text-sky-500 mr-2" size={18} />
              <input
                type="password"
                placeholder="Enter password"
                className="p-1 text-sm w-full outline-none bg-inherit"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>

            <button
              onClick={() => login()}
              className="bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md"
            >
              {logging ? "Logging in..." : "Login"}
            </button>
            <Link to="/signup" className="text-sky-600 mt-4 font-medium">
              Do not have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
