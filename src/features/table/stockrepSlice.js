import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  postLoad: false,
  data: {},
  perPage: "",
  total: "",
  error: "",
};

const stockRepSlice = createSlice({
  name: "stockRep",
  initialState,
  reducers: {
    addTaxRep: (state, action) => {
      //   console.log(action);
      state.data = action.payload;
    },
  },
});

export default stockRepSlice.reducer;
export const { addStockRep } = stockRepSlice.actions;
