// redux/Notificationslice.js
import { createSlice } from "@reduxjs/toolkit";

const Notificationslice = createSlice({
  name: "notification",
  initialState: {
    likeNotifications: [],
  },
  reducers: {
    setLikeNotifications: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotifications.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotifications = state.likeNotifications.filter(
          (item) => item.by?._id !== action.payload.by?._id
        );
      }
    },
  },
});

export const { setLikeNotifications } = Notificationslice.actions;
export default Notificationslice.reducer;
