import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAxios } from "../../../api/publicAxios";

// ======================================================
// ASYNC THUNK: Fetch Categories
// ======================================================

export const fetchListedCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (role, { rejectWithValue }) => {
    try {
      

      const res = await publicAxios.get("/categories");
      return res.data.categories;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  categories: [],
  loading: false,
};

// ======================================================
// SLICE
// ======================================================

const categorySlice = createSlice({
  name: "categories",
  initialState,

  extraReducers: (builder) => {
    builder
      .addCase(fetchListedCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchListedCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchListedCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ======================================================
// SELECTORS
// ======================================================

export const selectListedCategories = (state) => state.categories.categories;
export const selectCategoryLoading = (state) => state.categories.loading;

// ======================================================
// EXPORT REDUCER
// ======================================================

export default categorySlice.reducer;
