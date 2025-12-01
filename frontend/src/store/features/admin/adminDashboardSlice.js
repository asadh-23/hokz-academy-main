// src/store/features/admin/adminDashboardSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAxios } from "../../../api/adminAxios";

// =======================================================
// 📌 ASYNC THUNKS
// =======================================================

// 1. Fetch Admin Dashboard Data
export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await adminAxios.get("/dashboard");
      return res.data; // { success, stats, charts, totals }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to load dashboard data" }
      );
    }
  }
);

// =======================================================
// 📌 INITIAL STATE
// =======================================================

const initialState = {
  dashboard: null,  // full dashboard object
  loading: false,
  error: null,
};

// =======================================================
// 📌 SLICE
// =======================================================

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearAdminDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ===================== FETCH DASHBOARD =====================
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch dashboard data";
      });
  },
});

// =======================================================
// 📌 EXPORTS
// =======================================================

export const { clearAdminDashboardError } = adminDashboardSlice.actions;

export const selectAdminDashboard = (state) =>
  state.adminDashboard.dashboard;
export const selectAdminDashboardLoading = (state) =>
  state.adminDashboard.loading;
export const selectAdminDashboardError = (state) =>
  state.adminDashboard.error;

export default adminDashboardSlice.reducer;
