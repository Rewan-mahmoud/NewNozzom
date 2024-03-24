import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { April } from "../../network/April";
import { fetchFulfilled, fetchPend, fetchRejected, postPend, postRejected, updateFulfilled, updatePend, updateRejected } from "./builderCases";
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

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({page, token}) => {
    let query = `${apiUrl}productandservices`;
    if (page) {
      query = `${apiUrl}productandservices?page=${page}`;
    }
     const headers = {
       Authorization: `Bearer ${token}`,
     };
     return axios
       .post(query, {}, { headers })
       .then((res) => {
        // console.log( "productss" , res.data.data)
        return res.data.data.Products 
      });
  }
);

export const postProduct = createAsyncThunk(
  "product/postProduct",
  async ({form, body, token}) => {
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
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios

      .post(`${apiUrl}update_product/${id}`, body, { headers })
      .then((res) => res.data
      
      );
   

  }
);


const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, fetchPend);
    builder.addCase(fetchProducts.fulfilled, fetchFulfilled);
    builder.addCase(fetchProducts.rejected, fetchRejected);
    builder.addCase(postProduct.pending, postPend);
    builder.addCase(postProduct.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    
    builder.addCase(postProduct.rejected, postRejected);
    builder.addCase(updateProduct.pending, updatePend);
    // builder.addCase(updateProduct.fulfilled, updateFulfilled)
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });;
    builder.addCase(updateProduct.rejected, updateRejected);
  },
});

export default productSlice.reducer;
