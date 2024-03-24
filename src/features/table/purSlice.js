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

export const fetchPur = createAsyncThunk(
  "pur/fetchPur",
  async ({page, token}) => {
    let query = `${apiUrl}purchase`;
    if (page) {
      query = `${apiUrl}purchase?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.post(query, {}, { headers }).then((res) => {
      // console.log(res);
      return res.data.data.purchases;
    });
  }
);

export const postPur = createAsyncThunk(
  "pur/postPur",
  async ({body, token}) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_purchase`, body, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

export const updatePur = createAsyncThunk(
  "pur/updatePur",
  async ({ body, id, token }) => {
    console.log(body)
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}edit_purchase/${id}`, body, { headers })
      .then((res) => res.data);
  }
);

export const deletePur = createAsyncThunk(
  "pur/deletePur",
  async ({ id, token }) => {
    console.log(id)
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(`${apiUrl}destory_purchase/${id}`, { id: id }, { headers })
      .then((res) => res.data);
  }
); 
export const refundPur = createAsyncThunk(
  "pur/refundPur",
  async ({ body, token }) => {
    console.log(body)
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}refund_purchase`, body, { headers })
      .then((res) => res.data);
  }
);

const purSlice = createSlice({
  name: "pur",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchPur.pending, fetchPend);
    builder.addCase(fetchPur.fulfilled, fetchFulfilled);
    builder.addCase(fetchPur.rejected, fetchRejected);
    //post
    builder.addCase(postPur.pending, postPend);
    builder.addCase(postPur.fulfilled, (state, action) => {
      console.log(action.payload);
      state.postLoad = false;
      state.data.push(action.payload.data);
      state.error = "";
    });
    builder.addCase(postPur.rejected, postRejected);
    //update
    builder.addCase(updatePur.pending, updatePend);
    builder.addCase(updatePur.fulfilled, (state, action) => {
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
    builder.addCase(updatePur.rejected, updateRejected);
    builder.addCase(refundPur.pending, updatePend);
    builder.addCase(refundPur.fulfilled, (state, action) => {
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
    builder.addCase(refundPur.rejected, updateRejected);
    builder.addCase(deletePur.rejected, (state, action) => {
      console.log(action)
    })
    builder.addCase(deletePur.fulfilled, (state, action) => {

      // console.log(action.meta.arg.id)
      // const index = state.data.findIndex(
      //   (item) => item.id === action.meta.arg.id
      // );
      state.data = state.data.filter(ele => ele.id !== action.meta.arg.id)
    })
    builder.addCase(deletePur.pending, (state, action) => {
      console.log(action)
    })
  },
});

export default purSlice.reducer;
