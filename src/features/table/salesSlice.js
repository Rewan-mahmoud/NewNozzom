import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFulfilled,
  fetchPend,
  fetchRejected,
  // postFulfilled,
  postPend,
  postRejected,
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
  to: '',
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchSales = createAsyncThunk(
  "sales/fetchSales",
  async ({page, token}) => {
    let query = `${apiUrl}sales`;
    if (page) {
      query = `${apiUrl}sales?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => {
        // console.log(res)
        return res.data.data
      }); 
  }
);

export const postSales = createAsyncThunk(
  "sales/postSales",
  async ({form, body, token}) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_sales`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

export const updateSales = createAsyncThunk(
  "sales/updateSales",
  async ({ form, body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}refund`, form, { headers })
      .then((res) => res.data);
  }
);
 
export const refundSales = createAsyncThunk("sales/refundSales", async ({ body, token }) => {
  // console.log(body);
  const headers = {
    Authorization: token,
  };
  return axios
    .post(`${apiUrl}refund`, body, { headers })
    .then((res) => res.data);
});

const salesSlice = createSlice({
  name: "sales",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSales.pending, fetchPend);
    builder.addCase(fetchSales.fulfilled, fetchFulfilled);
    builder.addCase(fetchSales.rejected, fetchRejected);
    //post
    builder.addCase(postSales.pending, postPend);
    builder.addCase(postSales.fulfilled, (state, action) => {
      console.log(action.payload);
      state.postLoad = false;
      state.data.push(action.payload.data);
      state.error = "";
    });
    builder.addCase(postSales.rejected, postRejected);
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

export default salesSlice.reducer;
