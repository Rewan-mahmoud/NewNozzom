import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { April } from "../../network/April";
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
  query: "",
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchStores = createAsyncThunk(
  "store/fetchStores",
  async ({ page, token }) => {
    let query = `${apiUrl}store`;
    if (page) {
      query = `${apiUrl}store?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // console.log(token, page)
    return axios.post(query, {}, { headers }).then((res) => {
      return res.data.data.store;
    });
  }
);

export const postStore = createAsyncThunk(
  "store/postStore",
  async ({ form, body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_store`, form, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);
export const updateStore = createAsyncThunk(
  "store/updateStore",
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_store/${id}`, form, { headers })
      .then((res) => res.data);
  }
  
);

const storeSlice = createSlice({
  name: "store",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchStores.pending, fetchPend);
    builder.addCase(fetchStores.fulfilled, fetchFulfilled);
    builder.addCase(fetchStores.rejected, fetchRejected);
    //post
    builder.addCase(postStore.pending, postPend);
    builder.addCase(postStore.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    builder.addCase(postStore.rejected, postRejected);
    //update
    builder.addCase(updateStore.pending, updatePend);
    builder.addCase(updateStore.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    // builder.addCase(updateStore.fulfilled, updateFulfilled);
    builder.addCase(updateStore.rejected, updateRejected);
  },
});

export default storeSlice.reducer;
