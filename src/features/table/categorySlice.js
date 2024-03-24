import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFulfilled, fetchPend, fetchRejected, postFulfilled, postPend, postRejected, updateFulfilled, updatePend, updateRejected } from "./builderCases";
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

export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async ({page, token}) => {
    let query = `${apiUrl}categories`;
    if (page) {
      query = `${apiUrl}categories?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query, {}, { headers })
      .then((res) => res.data.data.category);
  }
);

export const postCategory = createAsyncThunk("category/postCategory", async ({body, token}) => {
  const headers = {
    Authorization: token,
  };
  return axios
    .post(`${apiUrl}add_category`, body, { headers })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.response.data.message);
    });
});

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}update_category/${id}`, body, { headers })
      .then((res) => {
        if (!res.data.success ) {
          throw new Error(res.data.message);
        } else {
          return res.data;
          // console.log('err')
        }
      })
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCategory.pending, fetchPend);
    builder.addCase(fetchCategory.fulfilled, fetchFulfilled);
    builder.addCase(fetchCategory.rejected, fetchRejected);
    //post
    builder.addCase(postCategory.pending, postPend);   
    // builder.addCase(postCategory.fulfilled, (state, action) => {
    //   // console.log(action.payload);
    //   state.postLoad = false;
    //   state.data.unshift(action.payload.data);
    //   state.error = "";
    // });

    builder.addCase(postCategory.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });
    builder.addCase(postCategory.rejected, postRejected);
    //update
    builder.addCase(updateCategory.pending, updatePend);
    // builder.addCase(updateCategory.fulfilled, updateFulfilled);
//
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.postLoad = false;
      state.data.unshift(action.payload.data);
      state.error = "";
    });

    builder.addCase(updateCategory.rejected, updateRejected);
  },
});

export default categorySlice.reducer;