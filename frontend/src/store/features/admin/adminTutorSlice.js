// src/store/features/admin/adminTutorSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";

// =======================================================
// 📌 ASYNC THUNKS
// =======================================================

// 1. Fetch Tutors (search, filter, pagination)
export const fetchAdminTutors = createAsyncThunk(
  "adminTutors/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await adminAxios.get("/tutors", { params });
      return res.data; // { tutors, pagination }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch tutors" }
      );
    }
  }
);

// =======================================================
// 📌 INITIAL STATE
// =======================================================

const initialState = {
  tutors: [],
  pagination: { currentPage: 1, totalPages: 1, totalFilteredItems: 0 },
  loading: false,
  error: null,
};

// =======================================================
// 📌 SLICE
// =======================================================

const adminTutorSlice = createSlice({
  name: "adminTutors",
  initialState,
  reducers: {
    clearAdminTutorError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ===================== FETCH TUTORS =====================
    builder
      .addCase(fetchAdminTutors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.tutors = action.payload.tutors || [];
        state.pagination =
          action.payload.pagination || state.pagination;
      })
      .addCase(fetchAdminTutors.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch tutors";
      });
  },
});

// =======================================================
// 📌 EXPORTS
// =======================================================

export const { clearAdminTutorError } = adminTutorSlice.actions;

export const selectAdminTutors = (state) => state.adminTutors.tutors;
export const selectAdminTutorPagination = (state) =>
  state.adminTutors.pagination;
export const selectAdminTutorLoading = (state) =>
  state.adminTutors.loading;
export const selectAdminTutorError = (state) =>
  state.adminTutors.error;

export default adminTutorSlice.reducer;
