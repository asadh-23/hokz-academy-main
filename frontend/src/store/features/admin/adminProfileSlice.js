// src/store/features/admin/adminProfileSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";

// =======================================================
// 📌 ASYNC THUNKS
// =======================================================

// 1. Fetch Admin Profile
export const fetchAdminProfile = createAsyncThunk("adminProfile/fetch", async (_, { rejectWithValue }) => {
    try {
        const res = await adminAxios.get("/profile");
        return res.data.admin;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to fetch profile" });
    }
});

// 4. Upload Admin Profile Image
export const uploadAdminProfileImage = createAsyncThunk("adminProfile/uploadImage", async (fd, { rejectWithValue }) => {
    try {
        const res = await adminAxios.post("/profile/image", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.imageUrl; // server returns image URL
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to upload image" });
    }
});

// =======================================================
// 📌 INITIAL STATE
// =======================================================

const initialState = {
    profile: null,
    profileLoading: false,
    updateLoading: false,
    imageUploadLoading: false,
};

// =======================================================
// 📌 SLICE
// =======================================================

const adminProfileSlice = createSlice({
    name: "adminProfile",
    initialState,

    extraReducers: (builder) => {
        // ===================== FETCH PROFILE =====================
        builder
            .addCase(fetchAdminProfile.pending, (state) => {
                state.profileLoading = true;
            })
            .addCase(fetchAdminProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profile = action.payload.admin;
            })
            .addCase(fetchAdminProfile.rejected, (state, action) => {
                state.profileLoading = false;
            });

        // ===================== UPLOAD PROFILE IMAGE =====================
        builder
            .addCase(uploadAdminProfileImage.pending, (state) => {
                state.imageUploadLoading = true;
            })
            .addCase(uploadAdminProfileImage.fulfilled, (state, action) => {
                state.imageUploadLoading = false;
            })
            .addCase(uploadAdminProfileImage.rejected, (state, action) => {
                state.imageUploadLoading = false;
            });
    },
});

// =======================================================
// 📌 EXPORT ACTIONS & SELECTORS
// =======================================================

export const selectAdminProfileLoading = (state) => state.adminProfile.profileLoading;
export const selectAdminImageUploadLoading = (state) => state.adminProfile.imageUploadLoading;

export default adminProfileSlice.reducer;
