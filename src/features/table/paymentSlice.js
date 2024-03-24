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

export const fetchPayment = createAsyncThunk(
  "payment/fetchPayment",
  async ({page, token}) => {
    let query = `${apiUrl}payment`;
    if (page) {
      query = `${apiUrl}payment?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data.cashing);
  }
);

export const postPayment = createAsyncThunk(
  "payment/postPayment",
  async ({body, token}) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_payment`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}edit_payment/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPayment.pending, fetchPend);
    builder.addCase(fetchPayment.fulfilled, fetchFulfilled);
    builder.addCase(fetchPayment.rejected, fetchRejected);
    //post
    builder.addCase(postPayment.pending, postPend);
    builder.addCase(postPayment.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    builder.addCase(postPayment.rejected, postRejected);
    //update
    builder.addCase(updatePayment.pending, updatePend);
    builder.addCase(updatePayment.fulfilled, updateFulfilled);
    builder.addCase(updatePayment.rejected, updateRejected);
  },
});

export default paymentSlice.reducer;
