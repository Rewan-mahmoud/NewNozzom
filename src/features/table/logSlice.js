import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFulfilled, fetchPend, fetchRejected } from "./builderCases";
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

export const fetchLogs = createAsyncThunk(
  "log/fetchLogs",
  async ({ page, token }) => {
    let query = `${apiUrl}logs`;
    if (page) {
      query = `${apiUrl}logs?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`, 
    };
    return axios.post(query, {}, { headers }).then((res) => res.data.data);
  }
);

const logSlice = createSlice({
  name: "log",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLogs.pending, fetchPend);
    builder.addCase(fetchLogs.fulfilled, fetchFulfilled);
    builder.addCase(fetchLogs.rejected, fetchRejected);
  },
});

export default logSlice.reducer;
