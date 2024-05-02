import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import wallpaper from "../../assets/Logo-main.png";
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
     <div className="w-full h-screen flex overflow-hidden">
      <div className="w-2/5 bg-black flex justify-between text-white">
        <div className="p-8 w-full min-h-[300px] px-24 self-center">
          <div
            className="flex flex-col justify-center gap-6"
            // onSubmit={(e) => login(e)}
          >
            <h1 className="text-3xl font-semibold">Login</h1>
            <p className="text-md font-medium">
              Open the Door to Mental Wellness.
            </p>
            <div className="border border-opacity-30 shadow p-2 flex items-center rounded-full ">
              <MdEmail className="text-white mr-2" size={18} />
              <input
                type="text"
                placeholder="Enter Email"
                className="p-1 w-full text-sm outline-none bg-inherit"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <div className="border border-opacity-25 shadow p-2 flex items-center rounded-full   ">
              <MdPassword className="text-white mr-2" size={18} />
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
              className="bg-white hover:bg-gray-400 hover:text-white bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-black p-3 rounded-md"
            >
              {logging ? "Logging in..." : "Login"}
            </button>
            <Link to="/signup" className="text-white mt-4 font-medium">
              Do not have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-32 pl-5 w-3/5 ">
        <h1 class="text-5xl leading-tight font-semibold pt-2 mt-4 text-transparent bg-clip-text bg-gradient-to-r to-sky-600 from-sky-400 
                  sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl    ">
          MentalHealth.ai
        </h1>
        <h1 className="mt-4 text-2xl font-bold font-serif ">
             Your Mental Wellness Ally, Always by Your Side
        </h1>
        <div className=" pt-4 justify-center flex">
         <img src={wallpaper} className="w-[300px] animate-pulse  " />
        </div>
      </div>
    </div>
  );
};

export default Login;
