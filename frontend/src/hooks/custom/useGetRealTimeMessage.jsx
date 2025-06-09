import { setMessages } from "@/redux/Chatslice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

 const useGetRealTimeMessage = () =>{
    const {messages} = useSelector(state=>state.chat)
    const {socket} = useSelector(state=>state.socket)
    const dispatch = useDispatch()
useEffect(() => {
  socket?.on('newMessage', (newMessage) => {
    dispatch(setMessages([...messages, newMessage])); // 🔴 This causes stale state
  });
}, [messages]);

}

export default useGetRealTimeMessage