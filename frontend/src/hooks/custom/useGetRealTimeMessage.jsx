import { setMessages } from "@/redux/Chatslice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

 const useGetRealTimeMessage = () =>{
    const {messages} = useSelector(state=>state.chat)
    const {socket} = useSelector(state=>state.socket)
    const dispatch = useDispatch()
    useEffect(() => {
    const fetchMessages = async () => {
        socket?.on('newMessage',(newMessage)=>{
            dispatch(setMessages([...messages,newMessage]))
        })
    };

  fetchMessages();
}, [messages,setMessages]); // track ID changes

}

export default useGetRealTimeMessage