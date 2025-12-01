import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAxios } from "../../../api/publicAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// VERIFY OTP (for user / tutor / admin)
export const verifyOtp = createAsyncThunk(
  "otp/verifyOtp",
  async ({ email, otp, role }, { rejectWithValue }) => {
    try {
      const res = await publicAxios.post(`/${role}/auth/verify-otp`, {
        email,
        otp,
      });
      return res.data;// { user, accessToken }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// RESEND OTP
export const resendOtp = createAsyncThunk(
  "otp/resendOtp",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const res = await publicAxios.post(`/${role}/auth/resend-otp`, {
        email,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  verifying: false,
  resending: false,
};

// ======================================================
// SLICE
// ======================================================

const otpSlice = createSlice({
  name: "otp",
  initialState,

  extraReducers: (builder) => {
    // ===========================
    // VERIFY OTP
    // ===========================
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.verifying = true;
        
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifying = false;
        
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifying = false;
      
      });

    // ===========================
    // RESEND OTP
    // ===========================
    builder
      .addCase(resendOtp.pending, (state) => {
        state.resending = true;
      
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resending = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resending = false;
     
      });
  },
});

// ======================================================
// EXPORTS
// ======================================================


export const selectOtpVerifying = (state) => state.otp.verifying;
export const selectOtpResending = (state) => state.otp.resending;

export default otpSlice.reducer;
