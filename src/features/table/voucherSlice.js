import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFulfilled,
  fetchPend,
  fetchRejected,
  // postFulfilled,
  postPend,
  postRejected,
  updateFulfilled,
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
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchVoucher = createAsyncThunk(
  "voucher/fetchVoucher",
  async ({page, token}) => {
    let query = `${apiUrl}receipt`;
    if (page) {
      query = `${apiUrl}receipt?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data.voucher);
  }
);

export const postVoucher = createAsyncThunk("voucher/postVoucher", async ({body, token}) => {
  const headers = {
    Authorization: token,
  };
  return axios
    .post(`${apiUrl}add_receipt`, body, { headers })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
});

export const updateVouchers = createAsyncThunk(
  "voucher/updateVouchers",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}edit_receipt/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchVoucher.pending, fetchPend);
    builder.addCase(fetchVoucher.fulfilled, fetchFulfilled);
    builder.addCase(fetchVoucher.rejected, fetchRejected);
    //post
    builder.addCase(postVoucher.pending, postPend);
    builder.addCase(postVoucher.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    builder.addCase(postVoucher.rejected, postRejected);
    //update
    builder.addCase(updateVouchers.pending, updatePend);
    builder.addCase(updateVouchers.fulfilled, updateFulfilled);
    builder.addCase(updateVouchers.rejected, updateRejected);
  },
});

export default voucherSlice.reducer;
