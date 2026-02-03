// src/store/features/admin/adminCourseSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";

// =======================================================
// 📌 ASYNC THUNKS
// =======================================================

// 1. Fetch Courses (search, filter, pagination)
export const fetchAdminCourses = createAsyncThunk(
  "adminCourses/fetch",
  async (filters = {}, { rejectWithValue }) => {
    try {
    
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
      );

      const res = await adminAxios.get("/courses", { params });
      
      return res.data;

    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch courses" }
      );
    }
  }
);

// 2. Fetch Course Details
export const fetchAdminCourseDetails = createAsyncThunk(
  "adminCourses/fetchDetails",
  async (courseId, { rejectWithValue }) => {
    try {
      const res = await adminAxios.get(`/courses/${courseId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch course details" }
      );
    }
  }
);

export const fetchAdminAllCategories = createAsyncThunk("adminCourses/categories", async (_, { rejectWithValue }) => {
    try {
        const res = await adminAxios.get(`/courses/categories`);
        return res.data.categories;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to fetch courses" });
    }
});

export const fetchAdminLessonData = createAsyncThunk("adminCourses/lessonData", async (lessonId, { rejectWithValue }) => {
    try {
        const res = await adminAxios.get(`/courses/lessons/${lessonId}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to fetch courses" });
    }
});

export const toggleAdminCourseBlock = createAsyncThunk("adminCourses/toggleBlock", async ({ courseId }, { rejectWithValue }) => {
    try {
        const res = await adminAxios.patch(`/courses/${courseId}/toggle-block`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to toggle tutor status" });
    }
});

export const toggleAdminLessonBlock = createAsyncThunk(
  "adminCourses/toggleLessonBlock",
  async (lessonId, { rejectWithValue }) => {
    try {
      // API Call: passing the NEW status
      const response = await adminAxios.patch(`/courses/lessons/${lessonId}/toggle-block`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update lesson status");
    }
  }
);

// =======================================================
// 📌 INITIAL STATE
// =======================================================

const initialState = {
    courses: [],
    categories: [],
    courseDetails: null,
    loading: false,
    detailsLoading: false,
    error: null,
    filters: {
        search: "",
        status: "",
        categoryId: "",
        minPrice: "",
        maxPrice: "",
        page: 1,
        limit: 9,
    },
    pagination: {
        totalPages: 1,
        totalCourses: 0,
    },
};

// =======================================================
// 📌 SLICE
// =======================================================

const adminCourseSlice = createSlice({
    name: "adminCourses",
    initialState,
    reducers: {
        setAdminCourseFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            if (action.payload.page === undefined) {
                state.filters.page = 1;
            }
        },
        clearAdminCourseFilters: (state) => {
            state.filters = {
                search: "",
                status: "",
                categoryId: "",
                minPrice: "",
                maxPrice: "",
                page: 1,
                limit: 9,
            };
        },
        setAdminCoursePage: (state, action) => {
            state.filters.page = action.payload;
        },
    },

    extraReducers: (builder) => {
        // ===================== FETCH COURSES =====================
        builder
            .addCase(fetchAdminCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.data?.courses || [];
                state.pagination = action.payload.data?.pagination || { totalPages: 1, totalCourses: 0 };
            })
            .addCase(fetchAdminCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch courses";
            });

        // ===================== FETCH COURSE DETAILS =====================
        builder
            .addCase(fetchAdminCourseDetails.pending, (state) => {
                state.detailsLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminCourseDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.courseDetails = action.payload.data || null;
            })
            .addCase(fetchAdminCourseDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.error = action.payload?.message || "Failed to fetch course details";
            });

        builder
            .addCase(fetchAdminAllCategories.pending, (state) => {
                state.loading = false;
            })
            .addCase(fetchAdminAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload || [];
            })
            .addCase(fetchAdminAllCategories.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

// =======================================================
// 📌 EXPORTS
// =======================================================

export const { setAdminCourseFilters, clearAdminCourseFilters, setAdminCoursePage } = adminCourseSlice.actions;

export const selectAdminCourses = (state) => state.adminCourses.courses;
export const selectAdminAllCategories = (state) => state.adminCourses.categories;
export const selectAdminCourseDetails = (state) => state.adminCourses.courseDetails;
export const selectAdminCourseLoading = (state) => state.adminCourses.loading;
export const selectAdminCourseDetailsLoading = (state) => state.adminCourses.detailsLoading;
export const selectAdminCourseError = (state) => state.adminCourses.error;
export const selectAdminCourseFilters = (state) => state.adminCourses.filters;
export const selectAdminCoursePagination = (state) => state.adminCourses.pagination;

export default adminCourseSlice.reducer;
