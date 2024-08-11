import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    suggesteduser: [],
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setsuggestedUser: (state, action) => {
      state.suggesteduser = action.payload;
    },
  },
});
export const { setAuthUser,setsuggestedUser } = authSlice.actions;
export default authSlice.reducer;
