import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  postLoad: false,
  data: {},
  perPage: "",
  total: "",
  error: "",
};

const stSuSlice = createSlice({
  name: "stSu",
  initialState,
  reducers: {
    addStSu: (state, action) => {
      //   console.log(action);
      state.data = action.payload;
    },
  },
});

export default stSuSlice.reducer;
export const { addStSu } = stSuSlice.actions;
