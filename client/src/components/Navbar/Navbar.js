import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiSolidReport, BiLogOut } from "react-icons/bi";

import { MdOutlineFoodBank } from "react-icons/md";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { BiSolidPhoneCall } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import { FaAward } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/Logo-main.png"
import { GroupIcon, HomeIcon, MalChatIcon, PlanIcon, ReportIcon, RewardIcon, SearchIcon } from "../Icons/Icons";
const navigations = [
  {
    id: 1,
    name: "Home",
    path: "/home",
    Icon: ({ color }) => <HomeIcon  />,
  },
  {
    id: 8,
    name: "Chat in Malayalam",
    path: "/malchat",
    Icon: ({ color }) => <MalChatIcon />
  ,
  },
  // {
  //   id: 2,
  //   name: "Plans",
  //   path: "/plans",
  //   Icon: ({ color }) => <PlanIcon color= {color}/>,
  // },
  // {
  //   id: 3,
  //   name: "Reports",
  //   path: "/reports",
  //   Icon: ({ color }) => <ReportIcon color= {color}/>,
  // },
  // {
  //   id: 4,
  //   name: "Search Doctors",
  //   path: "/search-doctors",
  //   Icon: ({ color }) => <SearchIcon />,
  // },
  // {
  //   id: 5,
  //   path: "/diet-plan",
  //   name: "Diet Plan",
  //   Icon: ({ color }) => <MdOutlineFoodBank size={30} className="font-light " />,
  // },
  // {
  //   id: 6,
  //   path: "/chat",
  //   name: "Support Group",
  //   Icon: ({ color }) => <GroupIcon />
  // },
  // {
  //   id: 8,
  //   path: "/rewards",
  //   name: "Rewards",
  //   Icon: ({ color }) => <RewardIcon />,
  // },
  // {
  //   id: 7,
  //   name: "Emergency Call",
  //   Icon: ({ color }) => <BiSolidPhoneCall size={25} color={color} />,
  // },
  
];
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    // console.log(location.pathname);
  }, [location]);
  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    console.log("Token removed from localStorage");
    localStorage.removeItem("user");
    console.log("User removed from localStorage");
    localStorage.removeItem('chats');
    console.log("Chats removed from localStorage");
    navigate("/");
    console.log("Navigated to /");
};

  return (
    <div className="py-6 px-4 h-screen overflow-y-auto w-1/4 shadow-lg">
      <ToastContainer />
      <div className="flex items-center gap-2 pb-2 ">
          <img src={logo} className="w-10" />
          <h1 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r to-sky-600 from-sky-400 font-bold">MentalHealth.ai</h1>
      </div>
      <div className="mt-4">
        <div>
        {navigations.map((nav) => (
          <Link
            onClick={() => {
              if (nav.id === 7) {
                toast("Hold Tight! Help Being Sent");
              }
            }}
            to={nav.path}
            key={nav.id}
          >
            <div
              className={`flex flex-row items-center py-4 px-2 rounded-md ${
                location.pathname === nav.path ? "bg-opacity-50 bg-gradient-to-r to-sky-400 from-sky-200" : ""
              } `}
            >
              <nav.Icon
                color={location.pathname === nav.path ? "#115E59" : "#5A5A5A"}
              />
              <h1
                className={`text-lg ml-2  ${
                  location.pathname === nav.path
                    ? "text-teal-800 font-semibold"
                    : "text-gray-700"
                }`}
                >
                  {nav.name}
                </h1>
              </div>
            </Link>
          ))}
        </div>
        <button onClick={() => logout()} >
          <div className="flex flex-row items-center py-4 px-2 rounded-md text-red-500">
            <BiLogOut size={25} className="text-red-500" />
            <h1
              className='text-lg ml-2 text-red-500'
            >
              Logout
            </h1>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
