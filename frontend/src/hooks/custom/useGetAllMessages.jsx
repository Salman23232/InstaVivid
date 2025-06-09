import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "@/redux/Chatslice";

// useGetAllMessages.js
const useGetAllMessages = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/message/all/${userId}`);
        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };

    fetchMessages();
  }, [userId]);
};

export default useGetAllMessages;
