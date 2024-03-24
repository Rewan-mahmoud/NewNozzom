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
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;

export const fetchOffer = createAsyncThunk(
  "salesOffer/fetchOffer",
  async ({page, token}) => { 
    let query = `${apiUrl}quotations`;
    if (page) {
      query = `${apiUrl}quotations?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data.priceoffer);
  }
);

export const postOffer = createAsyncThunk(
  "salesOffer/postOffer",
  async ({form, body, token}) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_quotations`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
      
  }

);

export const updateOffer = createAsyncThunk(
  "salesOffer/updateOffer",
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_quotations/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

export const deleteOffer = createAsyncThunk(
  "salesOffer/deleteOffer",
  async ({ id, token }) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(`${apiUrl}destroy_quotations`, { id }, { headers })
      .then((res) => res.data);
  }
);

const salesOfferSlice = createSlice({
  name: "salesOffer",
  initialState,
  reducers: {
    handleTranfiree: (state, action) => {
      // console.log(action.payload)
      state.data.map(item => item.id === action.payload && (item.tranfire = 1))
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOffer.pending, fetchPend);
    builder.addCase(fetchOffer.fulfilled, fetchFulfilled);
    builder.addCase(fetchOffer.rejected, fetchRejected);
    //post
    builder.addCase(postOffer.pending, postPend);
    builder.addCase(postOffer.fulfilled, (state, action) => {
  console.log(action.payload);
  state.postLoad = false;
  state.data.push(action.payload.data);
  state.error = "";
});
    builder.addCase(postOffer.rejected, postRejected);
    //update
    builder.addCase(updateOffer.pending, updatePend);
    builder.addCase(updateOffer.fulfilled, (state, action) => {
      console.log(action.payload.data)
      state.postLoad = false;
      const index = state.data.findIndex(
        (item) => item.id === action.meta.arg.id
      );
      console.log(index)
      if (index !== -1) {
        state.data[index] = { ...action.payload.data };
      }
      state.error = "";
    });
    builder.addCase(updateOffer.rejected, updateRejected);
    builder.addCase(deleteOffer.rejected, (state, action) => {
      console.log(action);
    });
    builder.addCase(deleteOffer.fulfilled, (state, action) => {
      // console.log(action.meta.arg.id)
      // const index = state.data.findIndex(
      //   (item) => item.id === action.meta.arg.id
      // );
      state.data = state.data.filter((ele) => ele.id !== action.meta.arg.id);
    });
    builder.addCase(deleteOffer.pending, (state, action) => {
      console.log(action);
    });
  },
});

export default salesOfferSlice.reducer;
export const {handleTranfiree} = salesOfferSlice.actions