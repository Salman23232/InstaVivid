import { createSlice } from "@reduxjs/toolkit";

const Authslice = createSlice({
    name:'auth',
    initialState:{
        user:null
    },
    reducers:{
        setAuthUser : (state, action) =>{
            state.user = action.payload
        }
    }
})
export const {setAuthUser} = Authslice.actions

export default Authslice.reducer