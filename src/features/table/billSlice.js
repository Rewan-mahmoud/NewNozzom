import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFulfilled,
  fetchPend,
  fetchRejected,
} from "./builderCases"; 
import axios from "axios";

const initialState = {
  loading: true,
  postLoad: false,
  data: [],
  perPage: "",
  total: "",
  error: "",
};

export const apiUrl = import.meta.env.VITE_APP_API;

export const fetchBills = createAsyncThunk(
  "bill/fetchBills",
  async ({page, token}) => {
    let query = `${apiUrl}billpayment`;
    if (page) {
      query = `${apiUrl}billpayment?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data);
  }
);


const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    handleUpdate: (state, action) => {
      state.data.map((item) => {
        if(item.id === action.payload.id) {
          item["sadads_count"] = Number(item["sadads_count"]) + 1;
          item["sadads_sum"] =
            Number(item["sadads_sum"]) + Number(action.payload.price);
        }
      } );
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBills.pending, fetchPend);
    builder.addCase(fetchBills.fulfilled, fetchFulfilled);
    builder.addCase(fetchBills.rejected, fetchRejected);
  },
});

export default billSlice.reducer;
export const {handleUpdate} = billSlice.actions;