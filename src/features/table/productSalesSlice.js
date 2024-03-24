import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { April } from "../../network/April";
import { fetchPend, fetchRejected } from "./builderCases";
import axios from "axios";

const initialState = {
  loading: true,
  postLoad: false,
  data: [],
  perPage: "",
  total: "",
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchProductsSales = createAsyncThunk(
  "productsales/fetchProductsSales",
  async ({ page, token }) => {
    let query = `${apiUrl}productandservices_sales`;
    if (page) {
      query = `${apiUrl}productandservices_sales?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data.Products)
  }
);



const productSalesSlice = createSlice({
  name: "productsales",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProductsSales.pending, fetchPend);
    builder.addCase(fetchProductsSales.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
      state.error = ''
      state.postLoad= false

    });
    builder.addCase(fetchProductsSales.rejected, fetchRejected);
  },
});

export default productSalesSlice.reducer;
