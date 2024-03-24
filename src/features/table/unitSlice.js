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

export const fetchUnit = createAsyncThunk(
  "unit/fetchUnit",
  async ({page, token}) => {
    let query = `${apiUrl}unite`;
    if (page) {
      query = `${apiUrl}unite?page=${page}`;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios
      .post(query,{}, { headers })
      .then((res) => {
        return res.data.data.Unites;
      });
  }
);

export const postUnit = createAsyncThunk(
  "unit/postUnit",
  async ({body, token}) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(body)
    return axios
      .post(`${apiUrl}add_unites`, { unit_id: body.id }, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

export const updateUnit = createAsyncThunk(
  "unit/updateUnit",
  async ({ body, token }) => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(body);
    return axios
      .post(`${apiUrl}update_unites`, { unit_id: body.id }, { headers })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

// export const activeUnit = createAsyncThunk(
//   "unit/activeUnit",
//   async ({ body, token }) => {
//     const headers = {
//       Authorization: token,
//     };
//     return axios
//       .post(`${apiUrl}add_unites`, body, { headers })
//       .then((res) => res.data)
//       .catch((err) => {
//         throw new Error(err.response.data.message);
//       });
//   }
// );

const unitSlice = createSlice({
  name: "unit",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUnit.pending, fetchPend);
    builder.addCase(fetchUnit.fulfilled, fetchFulfilled);
    builder.addCase(fetchUnit.rejected, fetchRejected);
    builder.addCase(postUnit.pending, postPend);
    builder.addCase(postUnit.fulfilled, (state, action) => {
      state.postLoad = false;
      const index = state.data.findIndex(
        (item) => item.id === action.meta.arg.body.id
      );
      // console.log(index, action)
      if (index !== -1) {
        state.data = [
          ...state.data.slice(0, index),
          { ...state.data[index], active : state.data[index].active ? 0 : 1  },
          ...state.data.slice(index + 1),
        ];
      }
      state.error = "";
    });
    builder.addCase(postUnit.rejected, postRejected);
    builder.addCase(updateUnit.pending, updatePend);
    builder.addCase(updateUnit.fulfilled, (state, action) => {
      state.postLoad = false;
      const index = state.data.findIndex(
        (item) => item.id === action.meta.arg.body.id
      );
      // console.log(index, action)
      if (index !== -1) {
        state.data = [
          ...state.data.slice(0, index),
          { ...state.data[index], active:  0  },
          ...state.data.slice(index + 1),
        ];
      }
      state.error = "";
    });
    builder.addCase(updateUnit.rejected, updateRejected);
  },
});

export default unitSlice.reducer;
