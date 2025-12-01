import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Fetch Tutor Profile
export const fetchTutorProfile = createAsyncThunk("tutorProfile/fetchTutorProfile", async (_, { rejectWithValue }) => {
    try {
        const res = await tutorAxios.get("/profile");
        return res.data.tutor;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
});

// Update Tutor Profile
export const updateTutorProfile = createAsyncThunk(
    "tutorProfile/updateTutorProfile",
    async (profileData, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.put("/profile", profileData);
            return res.data.tutor;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update profile");
        }
    }
);

// Upload Tutor Profile Image
export const uploadTutorProfileImage = createAsyncThunk(
    "tutorProfile/uploadTutorProfileImage",
    async (fd, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.post("/profile/image", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data.imageUrl;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Image upload failed");
        }
    }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    profileLoading: false,
    updateLoading: false,
    imageUploadLoading: false,
};

// ======================================================
// SLICE
// ======================================================

const tutorProfileSlice = createSlice({
    name: "tutorProfile",
    initialState,

    extraReducers: (builder) => {
        // ----------------------------------------------------
        // FETCH PROFILE
        // ----------------------------------------------------
        builder
            .addCase(fetchTutorProfile.pending, (state) => {
                state.profileLoading = true;
            })
            .addCase(fetchTutorProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
            })
            .addCase(fetchTutorProfile.rejected, (state, action) => {
                state.profileLoading = false;
            });

        // ----------------------------------------------------
        // UPDATE PROFILE
        // ----------------------------------------------------
        builder
            .addCase(updateTutorProfile.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(updateTutorProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
            })
            .addCase(updateTutorProfile.rejected, (state, action) => {
                state.updateLoading = false;
            });

        // ----------------------------------------------------
        // UPLOAD PROFILE IMAGE
        // ----------------------------------------------------
        builder
            .addCase(uploadTutorProfileImage.pending, (state) => {
                state.imageUploadLoading = true;
            })
            .addCase(uploadTutorProfileImage.fulfilled, (state, action) => {
                state.imageUploadLoading = false;
            })
            .addCase(uploadTutorProfileImage.rejected, (state, action) => {
                state.imageUploadLoading = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================
export const selectTutorProfileLoading = (state) => state.tutorProfile.profileLoading;
export const selectTutorUpdateLoading = (state) => state.tutorProfile.updateLoading;
export const selectTutorImageUploadLoading = (state) => state.tutorProfile.imageUploadLoading;

export default tutorProfileSlice.reducer;