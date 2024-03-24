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

export const fetchSubs = createAsyncThunk(
  "sub/fetchSubs",
  async ({ page, token, id }) => {
    let query = `${apiUrl}subscription_admin/${id}`;
    if (page) {
      query = `${apiUrl}subscription_admin/${id}?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data);
  }
);

export const postSubs = createAsyncThunk(
  "sub/postSubs",
  async ({ body, id, token }) => {
    // console.log(body, id)
    const headers = {
      Authorization: token,
    };
    return axios
      .post(
        `${apiUrl}add_subscription`,
        { ...body },
        { headers }
      )
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

export const updateSubs = createAsyncThunk(
  "sub/updateSubs",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_subscription/${id}`, {...body, company_id: id}, { headers })
      .then((res) => res.data);
  }
);

const subSlice = createSlice({
  name: "sub",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSubs.pending, fetchPend);
    builder.addCase(fetchSubs.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload;
  state.perPage = action.payload.per_page
  state.to = action.payload.to
  state.total = action.payload.total
  state.error = "";
});
    builder.addCase(fetchSubs.rejected, fetchRejected);
    //post
    builder.addCase(postSubs.pending, postPend);
    builder.addCase(postSubs.fulfilled, postFulfilled);
    builder.addCase(postSubs.rejected, postRejected);
    //update
    builder.addCase(updateSubs.pending, updatePend);
    builder.addCase(updateSubs.fulfilled, updateFulfilled);
    builder.addCase(updateSubs.rejected, updateRejected);
  },
});

export default subSlice.reducer;
