import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: [],
  },
  reducers: {
    setnotification: (state, action) => {
      if (action.payload.type === "Like") {
        state.notification.push(action.payload);
      }else if(action.payload.type==="Disike"){
        state.notification=state.notification.filter((item)=>item.userId!==action.payload.userId)
      }
    },
  },
});
export const { setnotification } = notificationSlice.actions;
export default notificationSlice.reducer;
