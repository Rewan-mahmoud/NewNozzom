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

export const fetchEmployees = createAsyncThunk(
  "emplyee/fetchEmployees",
  async ({ page, token }) => {
    let query = `${apiUrl}employees`;
    if (page) {
      query = `${apiUrl}employees?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // console.log(token, page)
    return axios
      .post(query, {}, { headers })
      .then((res) => {
        return res.data.data.employee;
      });
  }
);

export const postEmployees = createAsyncThunk(
  "emplyee/postEmployees",
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
export const updateEmployees = createAsyncThunk(
  "client/updateEmployees",
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_customer/${id}`, form, { headers })
      .then((res) => res.data);
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.pending, fetchPend);
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload
      state.error = ''
      state.total = ''
    });
    builder.addCase(fetchEmployees.rejected, fetchRejected);
    //post
    builder.addCase(postEmployees.pending, postPend);
    builder.addCase(postEmployees.fulfilled, postFulfilled);
    builder.addCase(postEmployees.rejected, postRejected);
    //update
    builder.addCase(updateEmployees.pending, updatePend);
    builder.addCase(updateEmployees.fulfilled, updateFulfilled);
    builder.addCase(updateEmployees.rejected, updateRejected);
  },
});

export default employeeSlice.reducer;
