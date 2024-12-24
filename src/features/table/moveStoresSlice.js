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

export const fetchStoresTransfair = createAsyncThunk(
  "storeTransfair/fetchStoresTransfair",
  async ({page, token}) => {
    let query = `${apiUrl}storetransfair`;
    if (page) {
      query = `${apiUrl}storetransfair?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.post(query, {}, { headers }).then((res) => {
      console.log("resss" , res);
      return res.data.data.Transfair;
    });
  }
);

export const postStoreTransfair = createAsyncThunk("storetransfair/postStoreTransfair", async ({body, token}) => {
  const headers = {
    Authorization: token,
  };
  return axios
    .post(`${apiUrl}add_store_transfair`, body, { headers })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
});

export const updateStoreTransfair = createAsyncThunk(
  "storetransfair/StoreTransfair",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_store_transfair/${id}`, body, { headers })
      .then((res) => res.data);
  }
);



const moveStoresSlice = createSlice({
  name: "storeTransfair",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchStoresTransfair.pending, fetchPend);
    builder.addCase(fetchStoresTransfair.fulfilled, fetchFulfilled);
    builder.addCase(fetchStoresTransfair.rejected, fetchRejected);
    //post
    builder.addCase(postStoreTransfair.pending, postPend);  
    builder.addCase(postStoreTransfair.fulfilled, (state, action) => {
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    builder.addCase(postStoreTransfair.rejected, postRejected);
    //update
    builder.addCase(updateStoreTransfair.pending, updatePend);
    builder.addCase(updateStoreTransfair.fulfilled, (state, action) => {
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });

    builder.addCase(updateStoreTransfair.rejected, updateRejected);

  
  },



  
});


export default moveStoresSlice.reducer;
export const {handleConvert} = moveStoresSlice.actions