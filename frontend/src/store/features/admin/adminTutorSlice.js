// src/store/features/admin/adminTutorSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";

// =======================================================
// 📌 ASYNC THUNKS
// =======================================================

// 1. Fetch Tutors (search, filter, pagination)
export const fetchAdminTutors = createAsyncThunk("adminTutors/fetch", async (params = {}, { rejectWithValue }) => {
    try {
        const res = await adminAxios.get("/tutors", { params });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to fetch tutors" });
    }
});

// 2. Block / Unblock Tutor
export const toggleAdminTutorBlock = createAsyncThunk("adminTutors/toggleBlock", async ({ tutorId }, { rejectWithValue }) => {
    try {
        const res = await adminAxios.patch(`/tutors/${tutorId}/toggle-block`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to toggle tutor status" });
    }
});

// 3. Fetch Tutor Details
export const fetchAdminTutorDetails = createAsyncThunk("adminTutors/fetchDetails", async ({ tutorId }, { rejectWithValue }) => {
    try {
        const res = await adminAxios.get(`/tutors/${tutorId}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to fetch tutor details" });
    }
});


// =======================================================
// 📌 INITIAL STATE
// =======================================================

const initialState = {
    tutors: [],
    filters: {
        search: "",
        status: "all",
        page: 1,
        limit: 8,
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalFilteredTutors: 0,
    },
    stats: {
        total: 0,
        active: 0,
        blocked: 0,
        inactive: 0,
    },
};

// =======================================================
// 📌 SLICE
// =======================================================

const adminTutorSlice = createSlice({
    name: "adminTutors",
    initialState,
    reducers: {
        setAdminTutorFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearAdminTutorFilters: (state) => {
            state.filters.search = "";
            state.filters.status = "all";
            state.filters.page = 1;
        },
    },

    extraReducers: (builder) => {
        // ===================== FETCH TUTORS =====================
        builder.addCase(fetchAdminTutors.fulfilled, (state, action) => {
            state.tutors = action.payload.tutors || [];
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
        });
    },
});

// =======================================================
// 📌 EXPORTS
// =======================================================

export const { setAdminTutorFilters, clearAdminTutorFilters } = adminTutorSlice.actions;

export const selectAdminTutors = (state) => state.adminTutors.tutors;
export const selectAdminTutorPagination = (state) => state.adminTutors.pagination;
export const selectAdminTutorStats = (state) => state.adminTutors.stats;
export const selectAdminTutorFilters = (state) => state.adminTutors.filters;

export default adminTutorSlice.reducer;