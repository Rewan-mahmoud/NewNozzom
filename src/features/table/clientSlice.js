import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { April } from "../../network/April";
import { fetchFulfilled, fetchPend, fetchRejected, postFulfilled, postPend, postRejected, updateFulfilled, updatePend, updateRejected } from "./builderCases";
import axios from "axios";

const initialState = {
  loading: true,
  postLoad: false,
  data: [],
  perPage: '',
  total: '',
  query: '',
  error: "",
};

const apiUrl = import.meta.env.VITE_APP_API;



export const fetchClients = createAsyncThunk(
  "client/fetchClients",
  async ({page, token}) => {
    let query = `${apiUrl}customersandvendors`;
    if (page) {
      query = `${apiUrl}customersandvendors?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // console.log(token, page)
    return axios
      .post(query, {}, { headers })
      .then((res) => {
        // console.log("clientsss" , res.data.data.customer)
        return res.data.data.customer;
      });
  }
);

export const postClients = createAsyncThunk(
  "client/postClients",
  async ({form, body, token}) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_customer`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);
export const updateClients = createAsyncThunk(
  "client/updateClients",
  async ({form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_customer/${id}`, form, { headers })
      .then((res) => res.data);
  }
);


const clientSlice = createSlice({
  name: "client",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchClients.pending, fetchPend);
    builder.addCase(fetchClients.fulfilled, fetchFulfilled);
    builder.addCase(fetchClients.rejected, fetchRejected);
    //post

    
    builder.addCase(postClients.pending, postPend);
    // builder.addCase(postClients.fulfilled, postFulfilled);

    builder.addCase(postClients.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });



    builder.addCase(postClients.rejected, postRejected);
    //update
    builder.addCase(updateClients.pending, updatePend);

    // builder.addCase(updateClients.fulfilled, updateFulfilled);
    builder.addCase(updateClients.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });

    builder.addCase(updateClients.rejected, updateRejected);
  },
});

export default clientSlice.reducer;
