import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Fetch all tutor courses with filters
export const fetchTutorCourses = createAsyncThunk(
    "tutorCourses/fetchTutorCourses",
    async (filters = {}, { rejectWithValue }) => {
        try {
            // Remove empty filter values
            const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== "" && v != null));

            const res = await tutorAxios.get("/courses", { params: cleanFilters });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
        }
    }
);

/*************************************************************
 * CREATE A NEW COURSE
 *************************************************************/
export const createTutorCourse = createAsyncThunk(
    "tutorCourses/createTutorCourse",
    async (courseData, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.post("/courses", courseData);
            return res.data.courseId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create course");
        }
    }
);

/*************************************************************
 * FETCH ONE COURSE BY ID
 *************************************************************/
export const fetchTutorCourseById = createAsyncThunk(
    "tutorCourses/fetchTutorCourseById",
    async (courseId, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.get(`/courses/${courseId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch course");
        }
    }
);

/*************************************************************
 * UPDATE COURSE
 *************************************************************/
export const updateTutorCourse = createAsyncThunk(
    "tutorCourses/updateTutorCourse",
    async ({ courseId, payload }, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.put(`/courses/${courseId}`, payload);
            return res.data.course;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update course");
        }
    }
);

/*************************************************************
 * UPLOAD THUMBNAIL (returns { fileUrl, fileKey })
 *************************************************************/
export const uploadTutorCourseThumbnail = createAsyncThunk(
    "tutorCourses/uploadTutorCourseThumbnail",
    async (fd, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.post("/courses/upload-thumbnail", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return {
                fileUrl: res.data.fileUrl,
                fileKey: res.data.fileKey,
            };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Thumbnail upload failed");
        }
    }
);

/*************************************************************
 * LIST / UNLIST COURSE
 *************************************************************/
export const toggleTutorCourseStatus = createAsyncThunk(
    "tutorCourses/toggleTutorCourseStatus",
    async ({ courseId }, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.patch(`/courses/${courseId}/toggle-list`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update course status");
        }
    }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    courses: [],
    selectedCourse: null,

    filters: {
        search: "",
        status: "all",
        page: 1,
        limit: 10,
    },

    // --- Pagination returned by backend ---
    pagination: {
        totalCourses: 0,
        totalPages: 1,
        currentPage: 1,
    },

    // --- Stats (listed/unlisted/enrolled etc.) ---
    stats: {
        total: 0,
        listed: 0,
        unlisted: 0,
    },

    // --- Loading states ---
    loadingCourse: false,
    creatingCourse: false,
    updatingCourse: false,
    uploadingThumbnail: false,
};

// ======================================================
// SLICE
// ======================================================

const tutorCoursesSlice = createSlice({
    name: "tutorCourses",
    initialState,

    reducers: {
        setTutorCourseFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearTutorCourseFilters: (state) => {
            state.filters = {
                search: "",
                status: "all",
                page: 1,
                limit: 10,
            };
        },
    },

    extraReducers: (builder) => {
        // Fetch courses
        builder.addCase(fetchTutorCourses.fulfilled, (state, action) => {
            state.courses = action.payload.courses || [];
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
        });

        // Fetch single course
        builder
            .addCase(fetchTutorCourseById.pending, (state) => {
                state.loadingCourse = true;
            })
            .addCase(fetchTutorCourseById.fulfilled, (state, action) => {
                state.loadingCourse = false;
                state.selectedCourse = action.payload.course;
                state.categories = action.payload.categories;
            })
            .addCase(fetchTutorCourseById.rejected, (state, action) => {
                state.loadingCourse = false;
            });

        // Create course
        builder
            .addCase(createTutorCourse.pending, (state) => {
                state.creatingCourse = true;
            })
            .addCase(createTutorCourse.fulfilled, (state, action) => {
                state.creatingCourse = false;
            })
            .addCase(createTutorCourse.rejected, (state, action) => {
                state.creatingCourse = false;
            });

        // Update course
        builder
            .addCase(updateTutorCourse.pending, (state) => {
                state.updatingCourse = true;
            })
            .addCase(updateTutorCourse.fulfilled, (state, action) => {
                state.updatingCourse = false;
                const idx = state.courses.findIndex((c) => c._id === action.payload._id);
                if (idx !== -1) state.courses[idx] = action.payload;
            })
            .addCase(updateTutorCourse.rejected, (state, action) => {
                state.updatingCourse = false;
            });

        // Upload thumbnail
        builder
            .addCase(uploadTutorCourseThumbnail.pending, (state) => {
                state.uploadingThumbnail = true;
            })
            .addCase(uploadTutorCourseThumbnail.fulfilled, (state) => {
                state.uploadingThumbnail = false;
            })
            .addCase(uploadTutorCourseThumbnail.rejected, (state, action) => {
                state.uploadingThumbnail = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const { setTutorCourseFilters, clearTutorCourseFilters } = tutorCoursesSlice.actions;
// Courses list
export const selectTutorCourses = (state) => state.tutorCourses.courses;

// Filters
export const selectTutorCourseFilters = (state) => state.tutorCourses.filters;

export const selectTutorSelectedCourse = (state) => state.tutorCourses.selectedCourse;
// Pagination
export const selectTutorCoursePagination = (state) => state.tutorCourses.pagination;

// Stats (for StatsCards)
export const selectTutorCourseStats = (state) => state.tutorCourses.stats;

// Loaders
export const selectTutorCourseLoading = (state) => state.tutorCourses.loadingCourse;
export const selectTutorCourseCreating = (state) => state.tutorCourses.creatingCourse;
export const selectTutorCourseUpdating = (state) => state.tutorCourses.updatingCourse;
export const selectTutorThumbnailUploading = (state) => state.tutorCourses.uploadingThumbnail;

export default tutorCoursesSlice.reducer;
