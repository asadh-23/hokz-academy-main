import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// ASYNC THUNK: Fetch Tutor Categories
// ======================================================

export const fetchTutorCategories = createAsyncThunk(
    "tutorCategories/fetchTutorCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.get("/categories");
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
    categories: [],
    loadingCategories: false,
};

// ======================================================
// SLICE
// ======================================================

const tutorCategorySlice = createSlice({
    name: "tutorCategories",
    initialState,

    extraReducers: (builder) => {
        builder
            .addCase(fetchTutorCategories.pending, (state) => {
                state.loadingCategories = true;
            })
            .addCase(fetchTutorCategories.fulfilled, (state, action) => {
                state.loadingCategories = false;
                state.categories = action.payload || [];
            })
            .addCase(fetchTutorCategories.rejected, (state, action) => {
                state.loadingCategories = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const selectTutorCategories = (state) => state.tutorCategories.categories;
export const selectTutorCategoryLoading = (state) => state.tutorCategories.loadingCategories;

export default tutorCategorySlice.reducer;
