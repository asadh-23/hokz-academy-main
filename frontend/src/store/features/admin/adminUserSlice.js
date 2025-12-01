// src/store/features/admin/adminUserSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";

// =======================================================
// 📌 ASYNC THUNKS
// =======================================================

// 1. Fetch Users (search, filter, pagination)
export const fetchAdminUsers = createAsyncThunk("adminUsers/fetch", async (params = {}, { rejectWithValue }) => {
    try {
        const res = await adminAxios.get("/users", { params });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to fetch users" });
    }
});

// 2. Block / Unblock User
export const toggleAdminUserBlock = createAsyncThunk("adminUsers/toggleBlock", async ({ userId }, { rejectWithValue }) => {
    try {
        const res = await adminAxios.patch(`/users/${userId}/toggle-block`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: `Failed to ${action} user` });
    }
});

// =======================================================
// 📌 INITIAL STATE
// =======================================================

const initialState = {
    users: [],
    filters: {
        search: "",
        status: "all",
        page: 1,
        limit: 8,
    },
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalFilteredUsers: 0,
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

const adminUserSlice = createSlice({
    name: "adminUsers",
    initialState,
    reducers: {
        setAdminUserFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearAdminUserFilters: (state) => {
            state.filters.search = "";
            state.filters.status = "all";
            state.filters.page = 1;
        },
    },

    extraReducers: (builder) => {
        // ===================== FETCH USERS =====================
        builder.addCase(fetchAdminUsers.fulfilled, (state, action) => {
            state.users = action.payload.users || [];
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
        });
    },
});

// =======================================================
// 📌 EXPORTS
// =======================================================

export const { setAdminUserFilters, clearAdminUserFilters } = adminUserSlice.actions;

export const selectAdminUsers = (state) => state.adminUsers.users;
export const selectAdminUserPagination = (state) => state.adminUsers.pagination;
export const selectAdminUserStats = (state) => state.adminUsers.stats;
export const selectAdminUserFilters = (state) => state.adminUsers.filters;

export default adminUserSlice.reducer;
