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

export const fetchBranches = createAsyncThunk(
  "branch/fetchBranches",
  async ({ page, token }) => {
    let query = `${apiUrl}branches`;
    if (page) {
      query = `${apiUrl}branches?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      
    };
   
    // console.log(token, page)
    return axios.post(query, {}, { headers }).then((res) => {
    
      return res.data.data.Branches;
    });
  }
);

export const postBranch = createAsyncThunk(
  "branch/postBranch",
  async ({ form, body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_branches`, form, { headers })
      .then((res) => {
        if (res.data.success) {
          return res.data;
        } else {
          throw new Error(res.data.message)
        }
      })
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);
export const updateBranch = createAsyncThunk(
  "branch/updateBranch",
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_branches/${id}`, form, { headers })
      .then((res) => res.data);
   
  }
);

const branchSlice = createSlice({
  name: "branch",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBranches.pending, fetchPend);
    builder.addCase(fetchBranches.fulfilled, fetchFulfilled);
    builder.addCase(fetchBranches.rejected, fetchRejected);
    //post
    builder.addCase(postBranch.pending, postPend);
    builder.addCase(postBranch.fulfilled, postFulfilled);
    builder.addCase(postBranch.rejected, postRejected);
    //update
    builder.addCase(updateBranch.pending, updatePend);
    builder.addCase(updateBranch.fulfilled, updateFulfilled);
    builder.addCase(updateBranch.rejected, updateRejected);
  },
});

export default branchSlice.reducer;
