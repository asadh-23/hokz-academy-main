import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAxios } from "../../../api/publicAxios";

// ======================================================
// GOOGLE LOGIN (USER / TUTOR / ADMIN)
// ======================================================

export const googleAuth = createAsyncThunk("googleAuth/googleAuth", async ({ credential, role }, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post(`/${role}/google-auth`, { credential });
        return res.data; // { user, accessToken }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Google authentication failed");
    }
});

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    loading: false,
};

// ======================================================
// SLICE
// ======================================================

const googleAuthSlice = createSlice({
    name: "googleAuth",
    initialState,

    extraReducers: (builder) => {
        builder
            .addCase(googleAuth.pending, (state) => {
                state.loading = true;
            })

            .addCase(googleAuth.fulfilled, (state, action) => {
                state.loading = false;
            })

            .addCase(googleAuth.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export const selectGoogleAuthLoading = (state) => state.googleAuth.loading;

export default googleAuthSlice.reducer;
