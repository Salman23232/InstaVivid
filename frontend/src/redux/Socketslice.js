import { createSlice } from "@reduxjs/toolkit";

const Socketslice = createSlice({
    name:'socket',
    initialState:{
        socket:null
    },
    reducers:{
        setSocket : (state, action) =>{
            state.socket = action.payload
        }
    }
})
export const {setSocket} = Socketslice.actions

export default Socketslice.reducer