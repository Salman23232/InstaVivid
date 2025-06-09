import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Home,
  Search,
  MessageCircle,
  Heart,
  Clapperboard,
  PlusSquare,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { debounce } from "lodash";
import { BsInstagram } from "react-icons/bs";

import { setAuthUser } from "@/redux/Authslice";
import { Toaster } from "./ui/sonner";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { likeNotifications } = useSelector((state) => state.notification);

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (!query) return setSearchResults([]);
      try {
        const res = await axios.get(
          `https://instavivid.onrender.com/api/v1/user/all?query=${query}`
        );
        setSearchResults(res.data.users || []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    }, 300)
  ).current;

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm]);

  const handleNavigation = (label) => {
    switch (label) {
      case "Home": return navigate("/");
      case "Search":
        setSearchOpen((prev) => !prev);
        setSearchTerm("");
        setSearchResults([]);
        return;
      case "Reels": return navigate("/video");
      case "Message": return navigate("/chat");
      case "Notifications": return;
      case "Create": return setOpen(true);
      case "Profile": return navigate("/profile");
      case "Logout": return handleLogout();
      default: return;
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get("https://instavivid.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        Toaster.success(res.data.message);
      }
    } catch (err) {
      Toaster.error(err?.response?.data?.message || "Logout failed");
    }
  };

  const sidebarItems = [
    { icon: <Home size={22} />, label: "Home" },
    { icon: <Search size={22} />, label: "Search" },
    { icon: <Clapperboard size={22} />, label: "Reels" },
    { icon: <MessageCircle size={22} />, label: "Message" },
    {
      icon: <Heart size={22} />,
      label: "Notifications",
      hasNotification: likeNotifications.length > 0,
    },
    { icon: <PlusSquare size={22} />, label: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage
            src={user?.profilePicture}
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ),
      label: "Profile",
    },
    { icon: <LogOut size={22} />, label: "Logout" },
  ];

  const goToUserProfile = (id) => {
    setSearchOpen(false);
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/profile/${id}`);
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[62px] md:w-[16%] bg-white dark:bg-zinc-900 text-black dark:text-white border-r border-gray-200 dark:border-zinc-700 shadow-lg dark:shadow-zinc-800 rounded-r-2xl z-20 transition-all">
      <div className="flex flex-col h-full px-2 md:px-5 py-6">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center md:justify-start">
          <BsInstagram className="text-3xl md:hidden drop-shadow-glow text-black dark:text-white" />
          <h1 className="text-2xl hidden md:block font-bold satisfy-regular drop-shadow-glow text-black dark:text-white">
            Instavivid
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {sidebarItems.map(({ icon, label, hasNotification }, idx) => {
            if (label === "Search") {
              return (
                <Popover key={idx} open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition shadow-sm hover:shadow-md">
                      <span className="drop-shadow-glow">{icon}</span>
                      <span className="hidden md:block">{label}</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    side="right"
                    align="start"
                    className="w-[300px] mr-10 p-0 bg-white dark:bg-zinc-800 text-black dark:text-white"
                  >
                    <div className="flex flex-col">
                      <input
                        autoFocus
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border-b border-gray-300 dark:border-zinc-600 bg-transparent focus:outline-none"
                      />
                      <div className="max-h-64 overflow-y-auto">
                        {searchResults.length ? (
                          searchResults.map((user) => (
                            <div
                              key={user._id}
                              onClick={() => goToUserProfile(user._id)}
                              className="flex gap-3 items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700"
                            >
                              <img
                                src={user.profilePicture || "/default-avatar.png"}
                                className="w-16 h-16 rounded-full object-cover"
                                alt={user.username}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm">{user.username}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  followers: {user.follower.length}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="p-3 text-sm text-gray-400">
                            {searchTerm ? "No users found." : "Type to search users."}
                          </p>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <div
                key={idx}
                onClick={() => handleNavigation(label)}
                className="relative flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer shadow-sm hover:shadow-md transition"
              >
                <span className="drop-shadow-glow">{icon}</span>
                <span className="hidden md:block">{label}</span>

                {label === "Notifications" && hasNotification && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        className="absolute left-6 bottom-6 h-5 w-5 bg-red-500 text-white text-xs rounded-full shadow"
                      >
                        {likeNotifications.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4 bg-white dark:bg-zinc-900 text-black dark:text-white">
                      <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto">
                        {likeNotifications.map((notif, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-700"
                          >
                            <img
                              src={notif?.by?.profilePicture}
                              className="w-10 h-10 rounded-full object-cover"
                              alt="profile"
                            />
                            <p className="text-sm">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            );
          })}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="mt-6 flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition shadow-sm hover:shadow-md" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          <span className="hidden md:block">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-10 text-xs text-gray-400 dark:text-gray-500 text-center">
          © {new Date().getFullYear()} Instavivid
        </footer>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </aside>
  );
};

export default LeftSidebar;
