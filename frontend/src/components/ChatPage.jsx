import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "@/redux/Authslice";
import Messages from "./Messages";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { suggestedUsers, selectedUser } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("https://instavivid.onrender.com/api/v1/user/all", { withCredentials: true });
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Set selected user based on URL param
  useEffect(() => {
    if (userId && users.length > 0) {
      const foundUser = users.find((user) => user._id === userId);
      if (foundUser) dispatch(setSelectedUser(foundUser));
    }
  }, [userId, users, dispatch]);

  // Cleanup selected user on unmount
  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, [dispatch]);

  const handleBack = () => {
    dispatch(setSelectedUser(null));
    navigate("/chat");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#eae6df] dark:bg-[#0e0e0e] ml-[14%] md:ml-0">
      {/* Sidebar */}
      <div
        className={`w-full md:w-[360px] border-r dark:border-gray-800 bg-white dark:bg-[#1f1f1f] overflow-y-auto
        ${selectedUser ? "hidden md:block" : "block"}`}
      >
        <div className="p-4 text-xl font-bold border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1f1f1f] z-10 shadow-sm">
          Chats
        </div>

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
                className={`flex items-center gap-3 p-4 border-b dark:border-gray-700 cursor-pointer transition
                hover:bg-gray-100 dark:hover:bg-[#2c2c2c] ${isActive ? "bg-blue-100 dark:bg-blue-900/20" : ""}`}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profilePicture} alt={user.username} />
                  <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-900 dark:text-white relative">
                      {user.username}
                      {isOnline && (
                        <span className="absolute w-2 h-2 rounded-full bg-green-500 -right-3 top-0"></span>
                      )}
                    </p>
                  </div>
                  <p className={`text-sm text-gray-600 dark:text-gray-400 truncate ${isOnline ? "text-green-500" : "text-red-500"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Box */}
      <div
        className={`flex-1 flex flex-col bg-[#efeae2] dark:bg-[#121212] relative 
        ${selectedUser ? "block" : "hidden md:block"}`}
      >
        {selectedUser ? (
          <>
            {/* Top bar with back button (mobile) */}
            <div className="p-4 border-b flex items-center gap-3 bg-[#f0f0f0] dark:bg-[#1a1a1a] dark:border-gray-700 shadow-sm">
              <button onClick={handleBack} className="md:hidden text-gray-600 dark:text-gray-300 mr-2">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.profilePicture} alt={selectedUser.username} />
                <AvatarFallback>{selectedUser.username?.[0]?.toUpperCase()}</AvatarFallback>
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
          <div className="flex-1 flex-col flex items-center justify-center text-gray-400 dark:text-gray-500 text-lg h-screen">
            <MessageCircle className="h-20 w-20" />
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
