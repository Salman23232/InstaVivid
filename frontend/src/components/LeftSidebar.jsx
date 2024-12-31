import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure to import axios
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/Authslice";
import CreatePost from "./CreatePost";



const LeftSidebar = () => {
  const navigate = useNavigate();
  const {user} = useSelector(store => store.auth)
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Message" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage
            src={user?.profilePicture}
            className="w-6 h-6 rounded-3xl"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  //createpost Handler
  const createPostHandler = ( ) =>{
    setOpen(true)
  }

  // Logout handler
  const logoutHandler = async (e) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(null))
        navigate('/login');
        toast.success(res.data.message); // Corrected variable from response to res
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed"); // Added fallback message
    }
  };
  const sidebarHandler = (text)=>{
    if (text === 'Logout') logoutHandler()
    if (text === 'Create') createPostHandler()
  }

  return (
    <div className="fixed top-0 left-0 w-[16%] h-screen border-r-2 border-gray-200 shadow-lg">
      <div className="flex flex-col p-5">
        <h1 className="satisfy-regular pt-6 pb-8 text-3xl">Instavivid</h1>
        {sidebarItems.map((items, index) => {
          // Only call logoutHandler when 'Logout' is clicked
          // const isLogout = items.text === "Logout";
          return (
            <div
              className="flex gap-3 pb-3 pt-3 pr-4 pl-4 rounded items-center text-start hover:bg-slate-200 cursor-pointer"
              onClick={()=>sidebarHandler(items.text)} // Only attach logout handler on Logout
              key={index}
            >
              {items.icon}
              <span>{items.text}</span>
            </div>
          );
        })}
      </div>


      <CreatePost open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeftSidebar;
