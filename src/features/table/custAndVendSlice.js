import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  postLoad: false,
  data: {},
  perPage: "",
  total: "",
  error: "",
};

const custAndVendSlice = createSlice({
  name: "custAndVend",
  initialState,
  reducers: {
    addProReb: (state, action) => {
      // console.log(action)
      state.data = action.payload;
    },
  },
});

export default custAndVendSlice.reducer;
export const { addProReb } = custAndVendSlice.actions;
