import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { April } from "../../network/April";
import {
  //   fetchFulfilled,
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
  name: "",
  data: [],
  perPage: "",
  total: "",
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchFatorah = createAsyncThunk(
  "fatorah/fetchFatorah",
  async ({id, token}) => {
    let query = `${apiUrl}show_dillpayment/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // console.log(query)
    return axios.post(query, {  }, { headers }).then((res) => {
      console.log(res.data.data);
      return res.data.data;
    });
  }
);

export const postBill = createAsyncThunk(
  "fatorah/postBill",
  async ({body, token}) => {
    const headers = {
      Authorization: token,
    };
    // console.log(token)
    return axios
      .post(`${apiUrl}add_dillpayment`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_product/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

export const deleteFatorah = createAsyncThunk(
  "receipt/deleteFatorah",
  async ({ id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}destroy_dillpayment/${id}`, { id }, { headers })
      .then((res) => res.data);
  }
);

const fatorahSlice = createSlice({
  name: "fatorah",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchFatorah.pending, fetchPend);
    builder.addCase(fetchFatorah.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.loading = false;
    //   state.name = action.payload.Products.ar_name;
    state.data = action.payload.sadads;
    //   !state.data.includes(action.payload) && state.data.push(action.payload)
      //   state.perPage = action.payload.per_page
      //   state.to = action.payload.to
      //   state.total = action.payload.total
      //   state.error = "";
    });
    builder.addCase(fetchFatorah.rejected, fetchRejected);
    builder.addCase(postBill.pending, postPend);
    builder.addCase(postBill.fulfilled, (state, action) => {
      state.data.push(action.payload.data)
    });
    builder.addCase(postBill.rejected, postRejected);
    builder.addCase(updateProduct.pending, updatePend);
    builder.addCase(updateProduct.fulfilled, updateFulfilled);
    builder.addCase(updateProduct.rejected, updateRejected);
    builder.addCase(deleteFatorah.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(deleteFatorah.fulfilled, (state, action) => {
      // console.log(action.meta.arg.id)
      // const index = state.data.findIndex(
      //   (item) => item.id === action.meta.arg.id
      // );
      state.data = state.data.filter((ele) => ele.id !== action.meta.arg.id);
    });
    builder.addCase(deleteFatorah.pending, (state, action) => {
      console.log(action);
    });
  },
});

export default fatorahSlice.reducer;
