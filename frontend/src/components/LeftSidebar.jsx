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
import React from "react";

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
          src="https://github.com/shadcn.png"
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

const LeftSidebar = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-[16%] h-screen border-r-2 border-gray-200 shadow-lg">
        <div className="flex flex-col p-5">
          <h1 className="satisfy-regular pt-6 pb-12 text-3xl">Instavivid</h1>
          {sidebarItems.map((items, index) => {
            return (
              <div className="flex gap-3 mb-6 items-center text-start" key={index}>
                {items.icon}
                <span>{items.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
