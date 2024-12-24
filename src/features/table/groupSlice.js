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

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async ({ page, token }) => {
    let query = `${apiUrl}group_branches`;
    if (page) {
      query = `${apiUrl}group_branches?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // console.log(token, page)
    return axios.post(query, {}, { headers }).then((res) => {
      return res.data.data.Groupbrances;
    });
  }
);

export const postGroup = createAsyncThunk(
  "groups/postGroup",
  async ({ form, body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_group_branches`, form, { headers })
      .then((res) => {
        if (res.data.success) {
          return res.data;
        } else {
          console.log(res.data.message)
          throw new Error(res.data.message);
        }
      })
      .catch((err) => {

        throw new Error(err.response.data.message);
      });
  }
);
export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_group_branches/${id}`, form, { headers })
      .then((res) => res.data);
  }
);

const branchSlice = createSlice({
  name: "groups",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.pending, fetchPend);
    builder.addCase(fetchGroups.fulfilled, fetchFulfilled);
    builder.addCase(fetchGroups.rejected, fetchRejected);
    //post
    builder.addCase(postGroup.pending, postPend);
    builder.addCase(postGroup.fulfilled, postFulfilled);
    builder.addCase(postGroup.rejected, postRejected);
    //update
    builder.addCase(updateGroup.pending, updatePend);
    builder.addCase(updateGroup.fulfilled, updateFulfilled);
    builder.addCase(updateGroup.rejected, updateRejected);
  },
});

export default branchSlice.reducer;
