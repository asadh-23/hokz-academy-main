import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAxios } from "../../../api/publicAxios";
import { userAxios } from "../../../api/userAxios";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Forgot Password - (User / Tutor / Admin)
export const forgotPassword = createAsyncThunk("password/forgotPassword", async ({ email, role }, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post(`/${role}/auth/forgot-password`, {
            email,
        });
        return res.data; // { message }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to send reset link");
    }
});

// Reset Password
export const resetPassword = createAsyncThunk(
    "password/resetPassword",
    async ({ token, password, role }, { rejectWithValue }) => {
        try {
            const res = await publicAxios.post(`/${role}/auth/reset-password/${token}`, {
                password,
            });
            return res.data; // { message }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Password reset failed");
        }
    }
);

// Request Password Change (for authenticated users)
export const requestPasswordChange = createAsyncThunk(
    "password/requestPasswordChange",
    async ({ currentPassword, newPassword, role }, { rejectWithValue }) => {
        try {
            const axiosInstance = role === "user" ? userAxios : tutorAxios;
            const res = await axiosInstance.post("/request-password-change", {
                currentPassword,
                newPassword,
            });
            return res.data; // { success, message }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
        }
    }
);

// Verify Password Change OTP
export const verifyPasswordChangeOtp = createAsyncThunk(
    "password/verifyPasswordChangeOtp",
    async ({ otpCode, newPassword, role }, { rejectWithValue }) => {
        try {
            const axiosInstance = role === "user" ? userAxios : tutorAxios;
            const res = await axiosInstance.post("/verify-password-change", {
                otpCode,
                newPassword,
            });
            return res.data; // { success, message }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "OTP verification failed");
        }
    }
);

// Resend Password Change OTP
export const resendPasswordChangeOtp = createAsyncThunk(
    "password/resendPasswordChangeOtp",
    async ({ role }, { rejectWithValue }) => {
        try {
            const axiosInstance = role === "user" ? userAxios : tutorAxios;
            const res = await axiosInstance.post("/resend-password-change-otp");
            return res.data; // { success, message }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to resend OTP");
        }
    }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    loading: false,
    resetLoading: false,
    requestChangeLoading: false,
    verifyChangeLoading: false,
    resendChangeLoading: false,
};

// ======================================================
// SLICE
// ======================================================

const passwordSlice = createSlice({
    name: "password",
    initialState,


    extraReducers: (builder) => {
        // ======================================================
        // FORGOT PASSWORD
        // ======================================================
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
            });

        // ======================================================
        // RESET PASSWORD
        // ======================================================
        builder
            .addCase(resetPassword.pending, (state) => {
                state.resetLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.resetLoading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetLoading = false;
            });

        // ======================================================
        // REQUEST PASSWORD CHANGE
        // ======================================================
        builder
            .addCase(requestPasswordChange.pending, (state) => {
                state.requestChangeLoading = true;
            })
            .addCase(requestPasswordChange.fulfilled, (state, action) => {
                state.requestChangeLoading = false;
            })
            .addCase(requestPasswordChange.rejected, (state, action) => {
                state.requestChangeLoading = false;
            });

        // ======================================================
        // VERIFY PASSWORD CHANGE OTP
        // ======================================================
        builder
            .addCase(verifyPasswordChangeOtp.pending, (state) => {
                state.verifyChangeLoading = true;
            })
            .addCase(verifyPasswordChangeOtp.fulfilled, (state, action) => {
                state.verifyChangeLoading = false;
            })
            .addCase(verifyPasswordChangeOtp.rejected, (state, action) => {
                state.verifyChangeLoading = false;
            });

        // ======================================================
        // RESEND PASSWORD CHANGE OTP
        // ======================================================
        builder
            .addCase(resendPasswordChangeOtp.pending, (state) => {
                state.resendChangeLoading = true;
            })
            .addCase(resendPasswordChangeOtp.fulfilled, (state) => {
                state.resendChangeLoading = false;
            })
            .addCase(resendPasswordChangeOtp.rejected, (state, action) => {
                state.resendChangeLoading = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

// No custom actions exported - all handled by async thunks

// SELECTORS
export const selectForgotPasswordLoading = (state) => state.password.loading;
export const selectResetPasswordLoading = (state) => state.password.resetLoading;

export const selectRequestPasswordChangeLoading = (state) => state.password.requestChangeLoading;
export const selectVerifyPasswordChangeLoading = (state) => state.password.verifyChangeLoading;
export const selectResendPasswordChangeLoading = (state) => state.password.resendChangeLoading;

export default passwordSlice.reducer;
