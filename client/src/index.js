import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Reports from "./pages/Reports/Reports";
import Diet from "./pages/Diet/Diet";
import Notifs from "./pages/Notifs/Notifs";
import SearchDocs from "./pages/SearchDocs/SearchDocs";
import Plans from "./pages/Plans/Plans";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Quiz from "./pages/Quiz/Quiz";
import Awards from "./pages/Awards/Awards";
import MalChat from "./pages/Chat/MalChat";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/quiz",
    element: <Quiz />,
  },
  {
    path: "/diet-plan",
    element: <Diet />,
  },
  {
    path: "/notifications",
    element: <Notifs />,
  },
  {
    path: "/search-doctors",
    element: <SearchDocs />,
  },
  {
    path: "/plans",
    element: <Plans />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/rewards",
    element: <Awards />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/malchat",
    element: <MalChat />
  },
]);
ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);