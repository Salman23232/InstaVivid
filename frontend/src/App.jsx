// App.jsx
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/Socketslice";
import { setOnlineUsers } from "./redux/Chatslice";
import { setLikeNotifications } from "./redux/Notificationslice";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Mainlayout from "./components/Mainlayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ChatPage from "./components/ChatPage";
import Video from "./components/Video";
import ProtectRoutes from "./components/ProtectRoutes";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectRoutes />, // Protect here
    children: [
      {
        path: "/",
        element: <Mainlayout />, // Main layout inside ProtectRoutes
        children: [
          { path: "/", element: <Home /> },
          { path: "/profile", element: <Profile /> },
          { path: "/chat", element: <ChatPage /> },
          { path: "/chat/:id", element: <ChatPage /> },
          { path: "/profile/:userId", element: <Profile /> },
          { path: "/video", element: <Video /> },
        ],
      },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8000", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotifications(notification));
      });



      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
};

export default App;
