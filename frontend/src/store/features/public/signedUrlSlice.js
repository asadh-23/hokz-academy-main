import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";
import { userAxios } from "../../../api/userAxios";
import { tutorAxios } from "../../../api/tutorAxios";

const getAxiosInstance = (state) => {
    
    if (state.userAuth?.user) return userAxios;
    if (state.tutorAuth?.tutor) return tutorAxios;
    if (state.adminAuth?.admin) return adminAxios;
    
    return userAxios; 
};

export const fetchSignedLessonUrl = createAsyncThunk(
    "signedUrl/fetchLessonUrl",
    async (lessonId, { rejectWithValue, getState }) => {
        try {
            const state = getState();
            const axiosInstance = getAxiosInstance(state);
            const res = await axiosInstance.get(`/course/lesson-url/${lessonId}`);
            return res.data.signedUrl;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch video link");
        }
    }
);

const commonSlice = createSlice({
    name: "signedUrl",
    initialState: {
        activeVideoUrl: null,
        isLoading: false,
    },
    reducers: {
        resetVideoUrl: (state) => {
            state.activeVideoUrl = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSignedLessonUrl.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSignedLessonUrl.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeVideoUrl = action.payload;
            })
            .addCase(fetchSignedLessonUrl.rejected, (state) => {
                state.isLoading = false;
                state.activeVideoUrl = null;
            });
    },
});

export const { resetVideoUrl } = commonSlice.actions;
export const selectActiveVideoUrl = (state) => state.signedUrl.activeVideoUrl;
export default commonSlice.reducer;