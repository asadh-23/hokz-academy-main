import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Request Email Change (for authenticated users)
export const requestEmailChange = createAsyncThunk(
  "emailChange/requestEmailChange",
  async ({ newEmail, role }, { rejectWithValue }) => {
    try {
      const axiosInstance = role === "user" ? userAxios : tutorAxios;
      const res = await axiosInstance.post("/request-email-change", {
        newEmail,
      });
      return res.data; // { success, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

// Verify Email Change OTP
export const verifyEmailChangeOtp = createAsyncThunk(
  "emailChange/verifyEmailChangeOtp",
  async ({ otpCode, email, role }, { rejectWithValue }) => {
    try {
      const axiosInstance = role === "user" ? userAxios : tutorAxios;
      const res = await axiosInstance.post("/verify-email-change", {
        otpCode,
        email,
      });
      return res.data; // { success, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// Resend Email Change OTP
export const resendEmailChangeOtp = createAsyncThunk(
  "emailChange/resendEmailChangeOtp",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const axiosInstance = role === "user" ? userAxios : tutorAxios;
      const res = await axiosInstance.post("/resend-email-change-otp", {
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
  requestLoading: false,
  verifyLoading: false,
  resendLoading: false,
};

// ======================================================
// SLICE
// ======================================================

const emailChangeSlice = createSlice({
  name: "emailChange",
  initialState,

  extraReducers: (builder) => {
   
    builder
      .addCase(requestEmailChange.pending, (state) => {
        state.requestLoading = true;
       
      })
      .addCase(requestEmailChange.fulfilled, (state, action) => {
        state.requestLoading = false;
       
      })
      .addCase(requestEmailChange.rejected, (state, action) => {
        state.requestLoading = false;
     
      });

    // ======================================================
    // VERIFY EMAIL CHANGE OTP
    // ======================================================
    builder
      .addCase(verifyEmailChangeOtp.pending, (state) => {
        state.verifyLoading = true;
     
      })
      .addCase(verifyEmailChangeOtp.fulfilled, (state, action) => {
        state.verifyLoading = false;
       
      })
      .addCase(verifyEmailChangeOtp.rejected, (state, action) => {
        state.verifyLoading = false;
      
      });

    // ======================================================
    // RESEND EMAIL CHANGE OTP
    // ======================================================
    builder
      .addCase(resendEmailChangeOtp.pending, (state) => {
        state.resendLoading = true;
        
      })
      .addCase(resendEmailChangeOtp.fulfilled, (state) => {
        state.resendLoading = false;
      })
      .addCase(resendEmailChangeOtp.rejected, (state, action) => {
        state.resendLoading = false;
     
      });
  },
});

// ======================================================
// EXPORTS
// ======================================================


// SELECTORS
export const selectEmailChangeRequestLoading = (state) => state.emailChange.requestLoading;
export const selectEmailChangeVerifyLoading = (state) => state.emailChange.verifyLoading;
export const selectEmailChangeResendLoading = (state) => state.emailChange.resendLoading;

export default emailChangeSlice.reducer;
