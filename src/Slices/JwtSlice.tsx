import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("token") || "";

const jwtSlice = createSlice({
  name: "jwt",
  initialState,
  reducers: {
    setJwt: (state, action) => {
      localStorage.setItem("token", action.payload);
      return action.payload; // new token becomes state
    },
    clearJwt: () => {
      localStorage.removeItem("token");
      return ""; // reset to empty string
    }
  }
});

export const { setJwt, clearJwt } = jwtSlice.actions;
export default jwtSlice.reducer;

