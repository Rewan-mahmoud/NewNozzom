import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  postLoad: false,
  data: {},
  perPage: "",
  total: "",
  error: "",
};

const productReportSlice = createSlice({
  name: "productReport",
  initialState,
  reducers: {
    addProReb: (state, action) => {
        // console.log(action)
        state.data = action.payload
    }
  }
});

export default productReportSlice.reducer;
export const {addProReb} = productReportSlice.actions