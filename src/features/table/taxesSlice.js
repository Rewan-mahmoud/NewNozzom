import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFulfilled,
  fetchPend,
  fetchRejected,
  postFulfilled,
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

export const fetchTaxes = createAsyncThunk(
  "taxes/fetchTaxes",
  async ({page, token}) => {
    let query = `${apiUrl}taxes`;
    if (page) {
      query = `${apiUrl}taxes?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data.taxes);
  }
);

export const postTaxes = createAsyncThunk(
  "taxes/postTaxes",
  async ({body, token}) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_taxes`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

export const updateTaxes = createAsyncThunk(
  "taxes/updateTaxes",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_tax/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

const categorySlice = createSlice({
  name: "taxes",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTaxes.pending, fetchPend);
    builder.addCase(fetchTaxes.fulfilled, fetchFulfilled);
    builder.addCase(fetchTaxes.rejected, fetchRejected);
    //post
    builder.addCase(postTaxes.pending, postPend);
    builder.addCase(postTaxes.fulfilled, postFulfilled);
    builder.addCase(postTaxes.rejected, postRejected);
    //update
    builder.addCase(updateTaxes.pending, updatePend);
    builder.addCase(updateTaxes.fulfilled, updateFulfilled);
    builder.addCase(updateTaxes.rejected, updateRejected);
  },
});

export default categorySlice.reducer;
