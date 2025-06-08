import { createSlice } from "@reduxjs/toolkit";

const Chatslice = createSlice({
    name:'chat',
    initialState:{
        onlineUsers:[],
        messages:[],
        lastMessage:null
    },
    reducers:{
        setOnlineUsers : (state, action) =>{
            state.onlineUsers = action.payload
        },
        setMessages : (state, action) =>{
            state.messages = action.payload
        },
        setLastMessage:(state,action) =>{
            state.lastMessage = action.payload
        }
    }
})
export const {setOnlineUsers,setMessages, setLastMessage} = Chatslice.actions

export default Chatslice.reducer