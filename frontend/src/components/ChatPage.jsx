import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "@/redux/Authslice";
import Messages from "./Messages";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FaComments } from "react-icons/fa";
import api from "@/api";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { suggestedUsers, selectedUser } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/all", {
          withCredentials: true,
        });
        setUsers(res.data);
    console.log(res.data);

      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userId && users.length > 0) {
      const foundUser = users.find((user) => user._id === userId);
      if (foundUser) dispatch(setSelectedUser(foundUser));
    }
  }, [userId, users]);

  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, [dispatch]);

  const handleBack = () => {
    dispatch(setSelectedUser(null));
    navigate("/chat");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#eae6df] dark:bg-[#0e0e0e] md:ml-0 ml-[14%] transition-all">
      {/* Sidebar */}
      <aside
        className={`w-full md:w-[360px] border-r bg-white dark:bg-[#1f1f1f] overflow-y-auto transition-all ${
          selectedUser ? "hidden md:block" : "block"
        }`}
      >
        <header className="p-4 text-xl font-bold border-b sticky top-0 z-10 bg-white dark:bg-[#1f1f1f] dark:border-gray-700 shadow">
          Chats
        </header>

        {loading ? (
          <p className="p-4 text-gray-400 dark:text-gray-500">Loading...</p>
        ) : suggestedUsers.length === 0 ? (
          <p className="p-4 text-gray-400 dark:text-gray-500">No users found</p>
        ) : (
          suggestedUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isActive = selectedUser?._id === user._id;

            return (
              <div
                key={user._id}
                onClick={() => {
                  navigate(`/chat/${user._id}`);
                  dispatch(setSelectedUser(user));
                }}
                className={`flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition hover:bg-gray-100 dark:hover:bg-[#2c2c2c] ${
                  isActive ? "bg-blue-100 dark:bg-blue-900/20" : ""
                } dark:border-gray-700`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.profilePicture} alt={user.username} />
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#1f1f1f] rounded-full" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{user.username}</div>
                  <div className={`text-sm ${isOnline ? "text-green-500" : "text-red-500"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </aside>

      {/* Chat Area */}
      <section
        className={`flex-1 flex flex-col bg-[#efeae2] dark:bg-[#121212] ${
          selectedUser ? "block" : "hidden md:block"
        }`}
      >
        {selectedUser ? (
          <>
            <div className="p-5 flex items-center gap-3 border-b bg-[#f7f7f7] dark:bg-[#1a1a1a] dark:border-gray-700 shadow-sm">
              <button onClick={handleBack} className="md:hidden text-gray-600 dark:text-gray-300">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.profilePicture} alt={selectedUser.username} />
                <AvatarFallback>{selectedUser.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedUser.username}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <Messages />
          </>
        ) : (

<div className=" flex flex-col items-center h-screen justify-center text-gray-400 dark:text-gray-500 px-4">
  <FaComments className="text-6xl mb-4" />
  <p className="text-lg font-semibold">Select a chat to start messaging</p>
</div>

        )}
      </section>
    </div>
  );
};

export default ChatPage;
