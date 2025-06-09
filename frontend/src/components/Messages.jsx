import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { FaPaperPlane } from 'react-icons/fa';

import useGetAllMessages from '@/hooks/custom/useGetAllMessages';
import useGetRealTimeMessage from '@/hooks/custom/useGetRealTimeMessage';
import { setLastMessage, setMessages } from '@/redux/Chatslice';
import api from '@/api';

const Messages = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const bottomRef = useRef(null);

  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id;
  const { messages } = useSelector((state) => state.chat);

  // Fetch user info when selected user ID changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) return;
      try {
        const { data } = await api.get(`/user/profile/${id}`, {
          withCredentials: true,
        });
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err.message);
      }
    };
    fetchUserProfile();
  }, [id]);

  useGetAllMessages(id);
  useGetRealTimeMessage();

  // Filter messages between current user and selected user
  const chatMessages = useMemo(() => {
    if (!currentUserId || !user?._id) return [];
    return messages.filter(
      (msg) =>
        (msg.senderId?._id === currentUserId && msg.receiverId?._id === user._id) ||
        (msg.senderId?._id === user._id && msg.receiverId?._id === currentUserId)
    );
  }, [messages, currentUserId, user]);

  // Scroll to bottom when new messages arrive and set last message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (chatMessages.length) {
      dispatch(setLastMessage(chatMessages[chatMessages.length - 1]));
    }
  }, [chatMessages, dispatch]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?._id) return;

    try {
      const { data } = await api.post(
        `/message/send/${user._id}`,
        { message },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (data.success) {
        console.log(data);
        
        dispatch(setMessages([...messages, data.newMessage]));
        setMessage('');
      }
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const formatMsgTime = (time) => dayjs(time).format('h:mm A');

  return (
    <div className="flex flex-col h-[560px]">
      <div className="flex-1 overflow-y-scroll px-6 py-4 space-y-3 bg-chat-bg">
        {chatMessages.map((msg) => {
          const isSentByCurrentUser = msg.senderId?._id === currentUserId;
          return (
            <div key={msg._id} className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-5 py-3 rounded-2xl max-w-[80%] text-sm leading-tight shadow-md whitespace-pre-wrap break-words font-medium tracking-tight ${
                  isSentByCurrentUser ? 'bg-[#005c4b] text-white' : 'bg-[#f0f2f5] text-gray-900'
                }`}
              >
                <div>{msg.message}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {formatMsgTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-5 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border border-gray-300 dark:border-gray-600 px-5 py-2 rounded-full bg-gray-100 dark:bg-[#2a2a2a] dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="p-3 rounded-full bg-green-600 hover:bg-green-700 transition text-white"
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Messages;
