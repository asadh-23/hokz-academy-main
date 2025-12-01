import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// ASYNC THUNK → Fetch Tutor Dashboard
// ======================================================

export const fetchTutorDashboard = createAsyncThunk(
  "tutorDashboard/fetchTutorDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await tutorAxios.get("/dashboard");
      return res.data; // should contain stats, totals etc.
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tutor dashboard"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  dashboard: null,

  loadingDashboard: false,
  errorDashboard: null,
};

// ======================================================
// SLICE
// ======================================================

const tutorDashboardSlice = createSlice({
  name: "tutorDashboard",
  initialState,

  reducers: {
    clearTutorDashboardError: (state) => {
      state.errorDashboard = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTutorDashboard.pending, (state) => {
        state.loadingDashboard = true;
        state.errorDashboard = null;
      })

      .addCase(fetchTutorDashboard.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboard = action.payload;
      })

      .addCase(fetchTutorDashboard.rejected, (state, action) => {
        state.loadingDashboard = false;
        state.errorDashboard = action.payload;
      });
  },
});

// ======================================================
// EXPORTS
// ======================================================

export const { clearTutorDashboardError } = tutorDashboardSlice.actions;

export const selectTutorDashboard = (state) =>
  state.tutorDashboard.dashboard;

export const selectTutorDashboardLoading = (state) =>
  state.tutorDashboard.loadingDashboard;

export const selectTutorDashboardError = (state) =>
  state.tutorDashboard.errorDashboard;

export default tutorDashboardSlice.reducer;
