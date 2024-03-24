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

export const fetchReceipt = createAsyncThunk("receipt/fetchReceipt", async ({page, token}) => {
  let query = `${apiUrl}debitnote`;
  if (page) {
    query = `${apiUrl}debitnote?page=${page}`;
  }
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios.post(query, {}, { headers }).then((res) => {
    // console.log(res);
    return res.data.data;
  });
});

export const postReceipt = createAsyncThunk("receipt/postReceipt", async ({body, token}) => {
  const headers = {
    Authorization: token,
  };
  return axios
    .post(`${apiUrl}add_debitnote`, body, { headers })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
});

export const updateReceipt = createAsyncThunk(
  "receipt/updateReceipt",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}edit_debitnote/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

export const deleteReceipt = createAsyncThunk('receipt/deleteReceipt', async ({id, token}) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  return axios
    .post(`${apiUrl}destory_debitnote/${id}`, { id }, { headers })
    .then((res) => res.data);
})

const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchReceipt.pending, fetchPend);
    builder.addCase(fetchReceipt.fulfilled, fetchFulfilled);
    builder.addCase(fetchReceipt.rejected, fetchRejected);
    //post
    builder.addCase(postReceipt.pending, postPend);
    builder.addCase(postReceipt.fulfilled, (state, action) => {
      console.log(action.payload);
      state.postLoad = false;
      state.data.push(action.payload.data);
      state.error = "";
    });
    builder.addCase(postReceipt.rejected, postRejected);
    //update
    builder.addCase(updateReceipt.pending, updatePend);
    builder.addCase(updateReceipt.fulfilled, (state, action) => {
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
    builder.addCase(updateReceipt.rejected, updateRejected);
    builder.addCase(deleteReceipt.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(deleteReceipt.fulfilled, (state, action) => {
      // console.log(action.meta.arg.id)
      // const index = state.data.findIndex(
      //   (item) => item.id === action.meta.arg.id
      // );
      state.data = state.data.filter((ele) => ele.id !== action.meta.arg.id);
    });
    builder.addCase(deleteReceipt.pending, (state, action) => {
      console.log(action);
    });
  },
});

export default receiptSlice.reducer;
