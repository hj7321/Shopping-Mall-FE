import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", { email, password });
      // 성공 -> 로그인 페이지에서 처리
      // 토큰 저장 장소: 1) 로컬 스토리지 2) 세션 스토리지
      sessionStorage.setItem("token", response.data.token);
      api.defaults.headers["authorization"] = "Bearer " + response.data.token;
      dispatch(
        showToastMessage({
          message: "로그인에 성공했습니다.",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      // 실패 -> 실패 시 생긴 에러값을 reducer에 저장
      dispatch(
        showToastMessage({
          message: "이메일 또는 비밀번호가 일치하지 않습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/google", { token });
      sessionStorage.setItem("token", response.data.token);
      api.defaults.headers["authorization"] = "Bearer " + response.data.token;
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = () => (dispatch) => {
  sessionStorage.removeItem("token");
  delete api.defaults.headers["authorization"];
  dispatch(clearState());
  dispatch(
    showToastMessage({ message: "로그아웃 되었습니다.", status: "success" })
  );
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      // 성공
      // 1. 성공 토스트 메시지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입에 성공했습니다.",
          status: "success",
        })
      );
      // 2. 로그인 페이지로 리다이렉트
      navigate("/login");
      return response.data.data;
    } catch (error) {
      // 실패
      // 1. 실패 토스트 메시지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다.",
          status: "error",
        })
      );
      // 2. 에러값 저장하기
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      dispatch(logout());
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearState: (state) => {
      state.user = null;
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registrationError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(loginWithToken.rejected, (state) => {
        state.user = null;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});
export const { clearState } = userSlice.actions;
export default userSlice.reducer;
