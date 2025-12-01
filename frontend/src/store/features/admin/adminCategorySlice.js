// src/store/features/admin/adminCategorySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";

// =======================================================
// 📌 ASYNC THUNKS (CATEGORY CRUD)
// =======================================================

// 1. Fetch Categories (with search, filter, pagination)
export const fetchAdminCategories = createAsyncThunk("adminCategories/fetch", async (params = {}, { rejectWithValue }) => {
    try {
        const res = await adminAxios.get("/categories", { params });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to fetch categories" });
    }
});

// 2. Create Category
export const createAdminCategory = createAsyncThunk("adminCategories/create", async (categoryData, { rejectWithValue }) => {
    try {
        const res = await adminAxios.post("/categories", categoryData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || { message: "Failed to create category" });
    }
});

// 3. Update Category
export const updateAdminCategory = createAsyncThunk(
    "adminCategories/update",
    async ({ categoryId, categoryData }, { rejectWithValue }) => {
        try {
            const res = await adminAxios.put(`/categories/${categoryId}`, categoryData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to update category" });
        }
    }
);

// 6. Toggle List/Unlist Category
export const toggleListAdminCategory = createAsyncThunk(
    "adminCategories/toggleList",
    async (categoryId, { rejectWithValue }) => {
        try {
            const res = await adminAxios.patch(`/categories/${categoryId}/toggle-list`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: "Failed to toggle category status" });
        }
    }
);

// =======================================================
// 📌 INITIAL STATE
// =======================================================

const initialState = {
    categories: [],
    stats: { total: 0, listed: 0, unlisted: 0 },
    pagination: { currentPage: 1, totalPages: 1, totalFilteredCategories: 0 },
    filters: {
        search: "",
        status: "All Categories",
        page: 1,
        limit: 3,
    },
    loading: false,
};

// =======================================================
// 📌 SLICE
// =======================================================

const adminCategorySlice = createSlice({
    name: "adminCategories",
    initialState,
    reducers: {
        setAdminCategoryFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetAdminCategoryFilters: (state) => {
            state.filters = {
                search: "",
                status: "All Categories",
                page: 1,
                limit: 3,
            };
        },
    },
    extraReducers: (builder) => {
        // FETCH CATEGORIES
        builder.addCase(fetchAdminCategories.fulfilled, (state, action) => {
            state.categories = action.payload.categories || [];
            state.stats = action.payload.stats || state.stats;
            state.pagination = action.payload.pagination;
        });

        // CREATE CATEGORY
        builder
            .addCase(createAdminCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(createAdminCategory.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createAdminCategory.rejected, (state) => {
                state.loading = false;
            });

        // UPDATE CATEGORY
        builder
            .addCase(updateAdminCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAdminCategory.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateAdminCategory.rejected, (state) => {
                state.loading = false;
            });

        // TOGGLE LIST/UNLIST CATEGORY (no state changes needed)
    },
});

// =======================================================
// 📌 EXPORTS
// =======================================================

export const { setAdminCategoryFilters, resetAdminCategoryFilters } = adminCategorySlice.actions;

export const selectAdminCategories = (state) => state.adminCategories.categories;
export const selectAdminCategoryStats = (state) => state.adminCategories.stats;
export const selectAdminCategoryPagination = (state) => state.adminCategories.pagination;
export const selectAdminCategoryFilters = (state) => state.adminCategories.filters;
export const selectAdminCategoryLoading = (state) => state.adminCategories.loading;

export default adminCategorySlice.reducer;
