import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { April } from "../../network/April";
import axios from "axios";
import {
  // clearError,
  fetchFulfilled,
  fetchPend,
  fetchRejected,
  // postFulfilled,
  postPend,
  // postRejected,
  updateFulfilled,
  updatePend,
  // updateRejected,
} from "./builderCases";

const initialState = {
  loading: true,
  postLoad: false,
  data: [],
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchStocks = createAsyncThunk(
  "stock/fetchStocks",
  async ({ page, token }) => {
    let query = `${apiUrl}stockopeningballance`;
    if (page) {
      query = `${apiUrl}stockopeningballance?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data.Opening);
  }
);

export const postStock = createAsyncThunk(
  "stock/postStock",
  async ({ body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_opening_balances`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
        throw new Error(JSON.stringify(err.response.data.errors));
      });
  }
);
export const updateStocks = createAsyncThunk(
  "stock/updateStocks",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_opening_balances/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

const stockSlise = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = ''
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStocks.pending, fetchPend);
    builder.addCase(fetchStocks.fulfilled, fetchFulfilled);
    builder.addCase(fetchStocks.rejected, fetchRejected);
    builder.addCase(postStock.pending, postPend);
    builder.addCase(postStock.fulfilled, (state, action) => {
      console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    builder.addCase(postStock.rejected, (state) => {
      // console.log(action.error.message);
      state.postLoad = false;
      state.error = "تم ادخال هذا الصنف في سند سابق";
    });
    builder.addCase(updateStocks.pending, updatePend);
    builder.addCase(updateStocks.fulfilled, updateFulfilled);
    builder.addCase(updateStocks.rejected, (state) => {
      // console.log(action.error.message);
      state.postLoad = false;
      state.data;
      state.error = "تم ادخال هذا الصنف في سند سابق";
    });
  },
});

export default stockSlise.reducer;
export const {clearError} = stockSlise.actions
