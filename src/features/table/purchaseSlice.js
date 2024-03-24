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

export const fetchPurchase = createAsyncThunk(
  "purchase/fetchPurchase",
  async ({page, token}) => {
    let query = `${apiUrl}purchaseorder`;
    if (page) {
      query = `${apiUrl}purchaseorder?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.post(query, {}, { headers }).then((res) => {
      // console.log(res);
      return res.data.data;
    });
  }
);

export const postPurchase = createAsyncThunk("purchase/postPurchase", async ({body, token}) => {
  const headers = {
    Authorization: token,
  };
  return axios
    .post(`${apiUrl}add_purchaseorder`, body, { headers })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
});

export const updatePurchase = createAsyncThunk(
  "purchase/updatePurchase",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}edit_purchaseorder/${id}`, body, { headers })
      .then((res) => res.data);
  }
);
export const deletePurchase = createAsyncThunk(
  "purchase/deletePurchase",
  async ({ id, token }) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(`${apiUrl}destory_purchaseorder`, {id}, { headers })
      .then((res) => res.data);
  }
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    handleConvert: (state, action) => {
      // console.log(action.payload);
      state.data.map(
        (item) => item.id === action.payload && (item.tranfire = 1)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPurchase.pending, fetchPend);
    builder.addCase(fetchPurchase.fulfilled, fetchFulfilled);
    builder.addCase(fetchPurchase.rejected, fetchRejected);
    //post
    builder.addCase(postPurchase.pending, postPend);
    builder.addCase(postPurchase.fulfilled, (state, action) => {
      console.log(action.payload);
      state.postLoad = false;
      state.data.push(action.payload.data);
      state.error = "";
    });
    builder.addCase(postPurchase.rejected, postRejected);
    //update
    builder.addCase(updatePurchase.pending, updatePend);
    builder.addCase(updatePurchase.fulfilled, (state, action) => {
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
    builder.addCase(updatePurchase.rejected, updateRejected);
    builder.addCase(deletePurchase.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(deletePurchase.fulfilled, (state, action) => {
      // console.log(action.meta.arg.id)
      // const index = state.data.findIndex(
      //   (item) => item.id === action.meta.arg.id
      // );
      state.data = state.data.filter((ele) => ele.id !== action.meta.arg.id);
    });
    builder.addCase(deletePurchase.pending, (state, action) => {
      console.log(action);
    });
  },
});

export default purchaseSlice.reducer;
export const {handleConvert} = purchaseSlice.actions