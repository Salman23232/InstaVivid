import React from "react";
import Signup from "./components/signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Mainlayout from "./components/Mainlayout";
import Home from "./components/Home";
import Profile from "./components/Profile";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/profile",
        element: <Profile/>,
      }
    ],
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login/>,
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={browserRouter}/>
    </div>
  );
};

export default App;
