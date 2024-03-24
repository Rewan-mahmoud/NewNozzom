import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { April } from "../../network/April";
import {
//   fetchFulfilled,
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
  name: '',
  data: [],
  opening_balancess: '',
  total_sales: '',
  total_purchers: '',
  total_purchers_return: '',
  total_sales_return: '',
  totall: '',
  perPage: "",
  total: "",
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchProduct = createAsyncThunk(
  "sproduct/fetchProduct",
  async ({id, token}) => {
    let query = `${apiUrl}show_product`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.post(query, {id}, { headers }).then((res) => {
      console.log(res.data.data)
      return res.data.data;
    });
  }
);

export const postProduct = createAsyncThunk(
  "product/postProduct",
  async ({body, token}) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_product`, body, { headers })
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

const SProductSlice = createSlice({
  name: "sproduct",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, fetchPend);
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
  // console.log(action)
  state.loading = false;
  state.name = action.payload.Products.ar_name
  state.data = action.payload.StoreProduct;
  state.opening_balancess = action.payload.opening_balancess;
  state.total_purchers = action.payload.total_purchers;
  state.total_purchers_return = action.payload.total_purchers_return;
  state.total_sales_return = action.payload.total_sale_return;
  state.total_sales = action.payload.total_sales
  state.totall = action.payload.total
//   state.perPage = action.payload.per_page
//   state.to = action.payload.to
//   state.total = action.payload.total
//   state.error = "";
});
    builder.addCase(fetchProduct.rejected, fetchRejected);
    builder.addCase(postProduct.pending, postPend);
    builder.addCase(postProduct.fulfilled, postFulfilled);
    builder.addCase(postProduct.rejected, postRejected);
    builder.addCase(updateProduct.pending, updatePend);
    builder.addCase(updateProduct.fulfilled, updateFulfilled);
    builder.addCase(updateProduct.rejected, updateRejected);
  },
});

export default SProductSlice.reducer;
