import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axios from "axios";
const initialState = {
  loading: false,
  data: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {},
  ready: Cookies.get("token") ? true : false,
  token: Cookies.get("token") || "",
  role: Cookies.get("role") || "",
  zatacV2: Cookies.get("zatacV2") || "",
  permissions: Cookies.get("permissions")
    ? [...Cookies.get("permissions").split(",")]
    : [],
  error: "",
};


const apiUrl = import.meta.env.VITE_APP_API;

export const signup = createAsyncThunk(
  "auth/signup",
  async (body) => {
    return axios
      .post(`${apiUrl}login`, body)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response.data.message);
      });
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (body) => {
    return axios
      .post(`${apiUrl}login`, body)
      .then((res) => {
        if(res.data.status) {
          console.log("dataaaaaa looged" , res?.data)
          return res.data;
        } else {
          throw new Error('لا يوجد حساب بهذه البيانات')
        }
      });
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    phase: (state, action) => {
      state.zatacV2 = action.payload
      state.data = {...state.data, zatacV2:action.payload}
      Cookies.set("zatacV2", action.payload, { expires: 7 });
      Cookies.set("user", JSON.stringify(state.data), { expires: 7 });
    },
    logout: (state) => {
      state.data = {}
      state.ready= false
      state.loading= false
      state.token = ''
      state.zatacV2 = "";
      state.permissions = []
      Cookies.remove('token')
      Cookies.remove('role')
      Cookies.remove('user')
      Cookies.remove("permissions");
      Cookies.remove("zatacV2");
    }
  },
  extraReducers: (builder) => {
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      console.log(action.payload.user)
      state.loading = false;
      state.data = action.payload.user;
      state.token = action.payload.token;
      state.error = "";
    });
    builder.addCase(signup.rejected, (state, action) => {
      console.log(action);
      state.loading = false;
      state.data = "";
      state.token = "";
      state.error = "error";
    });
    builder.addCase(login.pending, (state) => {
        state.loading = true
        state.error = ''
    });
    builder.addCase(login.fulfilled, (state, action) => {
      // console.log(action.payload)
      console.log(action.payload.user)
        state.loading = false
        state.ready = true
        state.data = action.payload.user;
        state.role = action.payload.user.role
        state.zatacV2 = action.payload.user.zatacV2
        state.permissions = action.payload.user.permissions;
        state.token = action.payload.token;
        state.error = ''
        Cookies.set("token", action.payload.token, { expires: 7 });
        Cookies.set("user", JSON.stringify(action.payload.user), { expires: 7 });
        Cookies.set("role", action.payload.user.role, { expires: 7 });
        Cookies.set("zatacV2", action.payload.user.zatacV2, { expires: 7 });
        Cookies.set("permissions", action.payload.user.permissions, { expires: 7 });
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.data = '';
      state.token = '';
      state.role = ''
      state.error = action.error.message;
    });
  },
});

export default authSlice.reducer;
export const {logout, phase} = authSlice.actions
