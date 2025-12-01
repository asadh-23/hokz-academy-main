import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Fetch all courses with pagination + filters
export const fetchUserCourses = createAsyncThunk(
    "userCourses/fetchUserCourses",
    async (filters = {}, { rejectWithValue }) => {
        try {
            // Remove empty string values to let backend defaults work
            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value !== "" && value !== null && value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const res = await userAxios.get("/courses", { params: cleanFilters });
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
        }
    }
);

// Fetch single course details
export const fetchUserCourseDetails = createAsyncThunk(
    "userCourses/fetchUserCourseDetails",
    async (courseId, { rejectWithValue }) => {
        try {
            const res = await userAxios.get(`/courses/${courseId}`);
            return res.data.course;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch course details");
        }
    }
);

// Fetch listed categories
export const fetchUserListedCategories = createAsyncThunk(
    "userCourses/fetchUserListedCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await userAxios.get("/categories/listed");
            return res.data.categories;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
        }
    }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    courses: [],
    selectedCourse: null,
    categories: [],

    filters: {
        search: "",
        category: "",
        sort: "",
        minPrice: "",
        maxPrice: "",
        page: 1,
        limit: 8,
    },

    pagination: {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
    },

    loadingCourses: false,
    loadingCourseDetails: false,
    loadingCategories: false,
};

// ======================================================
// SLICE
// ======================================================

const userCoursesSlice = createSlice({
    name: "userCourses",
    initialState,

    reducers: {
        setUserCourseFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },

        clearUserCourseFilters: (state) => {
            state.filters = {
                search: "",
                category: "",
                sort: "",
                minPrice: "",
                maxPrice: "",
                page: 1,
            };
        },
    },

    extraReducers: (builder) => {
        // Fetch user courses
        builder
            .addCase(fetchUserCourses.pending, (state) => {
                state.loadingCourses = true;
            })
            .addCase(fetchUserCourses.fulfilled, (state, action) => {
                state.loadingCourses = false;

                state.courses = action.payload.courses || [];

                state.pagination.totalItems = action.payload.totalItems;
                state.pagination.totalPages = action.payload.totalPages;
                state.pagination.currentPage = state.filters.page;
            })
            .addCase(fetchUserCourses.rejected, (state, action) => {
                state.loadingCourses = false;
            });

        // Fetch course details
        builder
            .addCase(fetchUserCourseDetails.pending, (state) => {
                state.loadingCourseDetails = true;
            })
            .addCase(fetchUserCourseDetails.fulfilled, (state, action) => {
                state.loadingCourseDetails = false;
                state.selectedCourse = action.payload;
            })
            .addCase(fetchUserCourseDetails.rejected, (state, action) => {
                state.loadingCourseDetails = false;
            });

        // Fetch categories
        builder
            .addCase(fetchUserListedCategories.pending, (state) => {
                state.loadingCategories = true;
            })
            .addCase(fetchUserListedCategories.fulfilled, (state, action) => {
                state.loadingCategories = false;
                state.categories = action.payload || [];
            })
            .addCase(fetchUserListedCategories.rejected, (state, action) => {
                state.loadingCategories = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const { setUserCourseFilters, clearUserCourseFilters } = userCoursesSlice.actions;

// Selectors
export const selectUserCourses = (state) => state.userCourses.courses;
export const selectUserSelectedCourse = (state) => state.userCourses.selectedCourse;

export const selectUserCategories = (state) => state.userCourses.categories;

export const selectUserCourseFilters = (state) => state.userCourses.filters;
export const selectUserCoursePagination = (state) => state.userCourses.pagination;

export const selectUserCoursesLoading = (state) => state.userCourses.loadingCourses;

export const selectUserCourseDetailsLoading = (state) => state.userCourses.loadingCourseDetails;

export default userCoursesSlice.reducer;
