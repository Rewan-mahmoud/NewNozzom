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

export const fetchActiveCom = createAsyncThunk(
  "activeCompany/fetchActiveCom",
  async ({ page, token }) => {
    let query = `${apiUrl}all_companyActive`;
    if (page) {
      query = `${apiUrl}all_companyActive?page=${page}`;
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
  "activeCompany/postActiveCom",
  async ({ form, body, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(`${apiUrl}add_company`, {...body, modules: body.modules}, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);
export const updateActiveCom = createAsyncThunk(
  "activeCompany/updateActiveCom",
  async ({ form, body, id, token }) => {
    const headers = {
      Authorization: token,
    };
    return axios
      .post(
        `${apiUrl}update_companyByAdmin/${id}`,
        { ...body, modules: body.modules },
        { headers }
      )
      .then((res) => res.data);
  }
);
// export const deActivateCompany = createAsyncThunk(
//   "activeCompany/updateActiveCom",
//   async ({  id, token }) => {
//     const headers = {
//       Authorization: token,
//     };
//     return axios
//       .post(
//         `${apiUrl}active_company/${id}`,
//         {},
//         { headers }
//       )
//       .then((res) => res.data);
//   }
// );

const activeCompanySlice = createSlice({
  name: "activeCompany",
  initialState,
  reducers: {
    deactivated: (state, action) => {
      console.log(action.payload, 'deactive')
      state.data.push(action.payload.id)
    },
    deActivateCompany: (state, action) => {
      console.log(action.payload)
      state.data = state.data.filter(item => item.id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActiveCom.pending, fetchPend);
    builder.addCase(fetchActiveCom.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload;
  state.perPage = action.payload.per_page
  state.to = action.payload.to
  state.total = action.payload.total
  state.error = "";
});
    builder.addCase(fetchActiveCom.rejected, fetchRejected);
    //post
    builder.addCase(postActiveCom.pending, postPend);
    builder.addCase(postActiveCom.fulfilled, (state, action) => {
      state.postLoad = false;
      state.data.unshift({
        ...action.payload.data
      });
      state.error = "";
    });
    builder.addCase(postActiveCom.rejected, postRejected);
    //update
    builder.addCase(updateActiveCom.pending, updatePend);
    builder.addCase(updateActiveCom.fulfilled, updateFulfilled);
    builder.addCase(updateActiveCom.rejected, updateRejected);
    // builder.addCase(deActivateCompany.pending, updateRejected);
    // builder.addCase(deActivateCompany.fulfilled, updateRejected);
    // builder.addCase(deActivateCompany.rejected, updateRejected);
  },
});

export default activeCompanySlice.reducer;
export const { deActivateCompany, deactivated } = activeCompanySlice.actions;
