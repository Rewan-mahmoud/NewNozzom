import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFulfilled,
  fetchPend,
  fetchRejected,
  // postFulfilled,
  postPend,
  postRejected,
  // updateFulfilled,
  updatePend,
  updateRejected,
} from "./builderCases";
import axios from "axios";

const initialState = {
  loading: true,
  postLoad: false,
  data: [],
  perPage: "",
  total: "",
  to: "",
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchSalesR = createAsyncThunk("sales/fetchSalesR", async ({page, token}) => {
  let query = `${apiUrl}creditnote`;
  if (page) {
    query = `${apiUrl}creditnote?page=${page}`;
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(query, {}, { headers }).then((res) => {
    // console.log(res);
    return res.data.data;
  });
});

export const postSalesR = createAsyncThunk("sales/postSalesR", async ({body, token}) => {
  const headers = {
    Authorization: token,
  };
  return axios
    .post(`${apiUrl}add_creditnote`, body, { headers })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
});

export const updateSales = createAsyncThunk(
  "sales/updateSales",
  async ({ body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}refund`, body, { headers })
      .then((res) => res.data);
  }
);

const salesRSlice = createSlice({
  name: "salesR",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSalesR.pending, fetchPend);
    builder.addCase(fetchSalesR.fulfilled, fetchFulfilled);
    builder.addCase(fetchSalesR.rejected, fetchRejected);
    //post
    builder.addCase(postSalesR.pending, postPend);
    builder.addCase(postSalesR.fulfilled, (state, action) => {
      console.log(action.payload);
      state.postLoad = false;
      state.data.push(action.payload.data);
      state.error = "";
    });
    builder.addCase(postSalesR.rejected, postRejected);
    //update
    builder.addCase(updateSales.pending, updatePend);
    builder.addCase(updateSales.fulfilled, (state, action) => {
      console.log(action.payload.data);
      state.postLoad = false;
      const index = state.data.findIndex(
        (item) => item.id === action.meta.arg.id
      );
      console.log(index);
      if (index !== -1) {
        state.data[index] = { ...action.payload.data };
      }
      state.error = "";
    });
    builder.addCase(updateSales.rejected, updateRejected);
  },
});

export default salesRSlice.reducer;
