import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// ==============================
//  ASYNC THUNKS
// ==============================

// Fetch User Profile
export const fetchUserProfile = createAsyncThunk("userProfile/fetchUserProfile", async (_, { rejectWithValue }) => {
    try {
        const res = await userAxios.get("/profile");
        return res.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch user profile");
    }
});

// Update User Profile
export const updateUserProfile = createAsyncThunk("userProfile/updateUserProfile", async (data, { rejectWithValue }) => {
    try {
        const res = await userAxios.put("/profile", data);
        return res.data.user;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
});

// Upload Profile Image
export const uploadUserProfileImage = createAsyncThunk(
    "userProfile/uploadProfileImage",
    async (fd, { rejectWithValue }) => {
        try {
            const res = await userAxios.post("/profile/image", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.imageUrl;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to upload image");
        }
    }
);

// ==============================
// INITIAL STATE
// ==============================

const initialState = {
    profileLoading: false,
    updateLoading: false,
    imageUploadLoading: false,
};

// ==============================
// SLICE
// ==============================

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,

    extraReducers: (builder) => {
        // ---------------------------
        // FETCH PROFILE
        // ---------------------------
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.profileLoading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.profileLoading = false;
            });

        // ---------------------------
        // UPDATE PROFILE
        // ---------------------------
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.updateLoading = false;
            });

        // ---------------------------
        // UPLOAD PROFILE IMAGE
        // ---------------------------
        builder
            .addCase(uploadUserProfileImage.pending, (state) => {
                state.imageUploadLoading = true;
            })
            .addCase(uploadUserProfileImage.fulfilled, (state, action) => {
                state.imageUploadLoading = false;
            })
            .addCase(uploadUserProfileImage.rejected, (state, action) => {
                state.imageUploadLoading = false;
            });
    },
});

// ==============================
// EXPORTS
// ==============================

export const selectUserProfileLoading = (state) => state.userProfile.profileLoading;
export const selectUserUpdateLoading = (state) => state.userProfile.updateLoading;
export const selectUserImageUploadLoading = (state) => state.userProfile.imageUploadLoading;

export default userProfileSlice.reducer;
