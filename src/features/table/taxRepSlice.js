import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  postLoad: false,
  data: {},
  perPage: "",
  total: "",
  error: "",
};

const taxRepSlice = createSlice({
  name: "taxReport",
  initialState,
  reducers: {
    addTaxRep: (state, action) => {
      // console.log(action);
      state.data = action.payload;
    },
  },
});

export default taxRepSlice.reducer;
export const { addTaxRep } = taxRepSlice.actions;
