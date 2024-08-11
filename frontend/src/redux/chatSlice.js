import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineuser: [],
    message:[],
    // refresh:false
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineuser = action.payload;
    },
    setMessage:(state,action)=>{
      state.message=action.payload
    },
    // setRefresh:(state,action)=>{
    //   state.refresh = !state.refresh;
    // }
  },
});
export const { setOnlineUsers ,setMessage} = chatSlice.actions;
export default chatSlice.reducer;
