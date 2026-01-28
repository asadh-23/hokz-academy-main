import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// 1. Fetch Course Content & User Progress (Load Player)
export const fetchCourseAccess = createAsyncThunk(
    "courseProgress/fetchCourseAccess",
    async (courseId, { rejectWithValue }) => {
        try {
            const res = await userAxios.get(`learning/${courseId}/content`);
            // Based on your backend controller, data is inside res.data
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load course content");
        }
    },
);

// 2. Update Lesson Progress (Mark as Done)
export const updateProgress = createAsyncThunk(
    "courseProgress/updateProgress",
    async ({ courseId, lessonId }, { rejectWithValue }) => {
        try {
            const res = await userAxios.post("/learning/progress", { courseId, lessonId });
            // Based on backend, likely returns: { success: true, data: { ...progress } }
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update progress");
        }
    },
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    learningCourse: null, // Basic course info
    lessons: [], // Ordered list of lessons

    progressData: {
        completedLessons: [], // Array of lesson IDs
        completionPercentage: 0,
        isCompleted: false,
        lastPlayedLesson: null,
    },
    certificateData: null,

    activeLesson: null,

    isLoading: false,
    isUpdating: false,
    error: null,
};

// ======================================================
// SLICE
// ======================================================

const courseProgressSlice = createSlice({
    name: "courseProgress",
    initialState,

    reducers: {
        // Manually change the video being played
        setActiveLesson: (state, action) => {
            state.activeLesson = action.payload;
        },

        // Clear state when leaving the page (Cleanup)
        resetCourseState: (state) => {
            state.learningCourse = null;
            state.lessons = [];
            state.activeLesson = null;
            state.progressData = {
                completedLessons: [],
                completionPercentage: 0,
                isCompleted: false,
                lastPlayedLesson: null,
            };
            state.certificateData = null,
            state.isLoading = false;
            state.isUpdating = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // --- Fetch Course Access ---
        builder
            .addCase(fetchCourseAccess.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCourseAccess.fulfilled, (state, action) => {
                state.isLoading = false;

                // Ensure we access .data based on your backend structure
                const { course, lessons, progress, certificateData } = action.payload.data;

                state.learningCourse = course;
                state.lessons = lessons || [];
                state.progressData = progress;
                state.certificateData = certificateData;

                // Auto-select lesson logic
                if (progress?.lastPlayedLesson) {
                    const lastLesson = lessons.find((l) => l._id === progress.lastPlayedLesson);
                    state.activeLesson = lastLesson || lessons[0];
                } else if (lessons && lessons.length > 0) {
                    state.activeLesson = lessons[0];
                }
            })
            .addCase(fetchCourseAccess.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // --- Update Progress ---
        builder
            .addCase(updateProgress.pending, (state) => {
                state.isUpdating = true;
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.progressData = action.payload;
            })
            .addCase(updateProgress.rejected, (state, action) => {
                state.isUpdating = false;
                
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

// Export the single reset action
export const { setActiveLesson, resetCourseState } = courseProgressSlice.actions;

export const selectLearningCourse = (state) => state.courseProgress.learningCourse;
export const selectCourseLessons = (state) => state.courseProgress.lessons;
export const selectProgressData = (state) => state.courseProgress.progressData;
export const selectcertificateData = (state) => state.courseProgress.certificateData;
export const selectActiveLesson = (state) => state.courseProgress.activeLesson;
export const selectCourseProgressLoading = (state) => state.courseProgress.isLoading;
export const selectCourseProgressError = (state) => state.courseProgress.error;

export default courseProgressSlice.reducer;
