import { createSlice } from "@reduxjs/toolkit";

const Authslice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        suggestedUsers:[],
        selectedUser:null,
        followings:[],
        followers:[],
        isFollowing:false
    },
    reducers:{
        setAuthUser : (state, action) =>{
            state.user = action.payload

        },
        setSuggestedUsers:(state,action) =>{
            state.suggestedUsers = action.payload
        },
        setSelectedUser:(state,action) =>{
            state.selectedUser = action.payload
        },

        setIsFollowing:(state,action)=>{
          state.isFollowing = action.payload
        },
        setFollowings:(state,action)=>{
          state.followings = action.payload
        },
        setFollowers:(state,action)=>{
          state.followers = action.payload
        },
    }
})
export const {setAuthUser,
  setIsFollowing,setFollowers, 
setFollowings, setSelectedUser,setSuggestedUsers} = Authslice.actions

export default Authslice.reducer
