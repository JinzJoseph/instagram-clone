import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggesteduser: [],
    userProfile:null,
    selectedUser:null
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setsuggestedUser: (state, action) => {
      state.suggesteduser = action.payload;
    },
    setUserProfile:(state,action)=>{
      state.userProfile=action.payload
    },
    setSelecteduser:(state,action)=>{
      state.selectedUser=action.payload
    }
  },
});
export const { setAuthUser,setsuggestedUser ,setSelecteduser,setUserProfile} = authSlice.actions;
export default authSlice.reducer;
