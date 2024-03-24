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

export const fetchNonActiveCom = createAsyncThunk(
  "nonActiveCompany/fetchNonActiveCom",
  async ({ page, token }) => {
    let query = `${apiUrl}all_companyNOActive`;
    if (page) {
      query = `${apiUrl}all_companyNOActive?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // console.log(token, page)
    return axios.post(query, {}, { headers }).then((res) => {
      return res.data.data;
    });
  }
);

export const postActiveCom = createAsyncThunk(
  "nonActiveCompany/postActiveCom",
  async ({ form, body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_customer`, form, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);
export const updateActiveCom = createAsyncThunk(
  "nonActiveCompany/updateActiveCom",
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_customer/${id}`, form, { headers })
      .then((res) => res.data);
  }
);

const nonActiveCompanySlice = createSlice({
  name: "nonActiveCompany",
  initialState,
  reducers: {
    activated: (state, action) => {
      console.log(action.payload)
      state.data.push(action.payload.id);
    },
    activateCompany: (state, action) => {
      console.log(action.payload)
      state.data = state.data.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNonActiveCom.pending, fetchPend);
    builder.addCase(fetchNonActiveCom.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.perPage = action.payload.per_page;
      state.to = action.payload.to;
      state.total = action.payload.total;
      state.error = "";
    });
    builder.addCase(fetchNonActiveCom.rejected, fetchRejected);
    //post
    builder.addCase(postActiveCom.pending, postPend);
    builder.addCase(postActiveCom.fulfilled, postFulfilled);
    builder.addCase(postActiveCom.rejected, postRejected);
    //update
    builder.addCase(updateActiveCom.pending, updatePend);
    builder.addCase(updateActiveCom.fulfilled, updateFulfilled);
    builder.addCase(updateActiveCom.rejected, updateRejected);
  },
});

export default nonActiveCompanySlice.reducer;
export const { activated, activateCompany } = nonActiveCompanySlice.actions;
