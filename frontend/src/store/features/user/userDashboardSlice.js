import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// ========================================
// ASYNC THUNK – Fetch User Dashboard Stats
// ========================================

export const fetchUserDashboard = createAsyncThunk(
  "userDashboard/fetchUserDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAxios.get("/dashboard");
      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  dashboard: null,
  loading: false,
  error: null,
};

// ========================================
// SLICE
// ========================================

const userDashboardSlice = createSlice({
  name: "userDashboard",
  initialState,
  reducers: {
    clearUserDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch Dashboard
      .addCase(fetchUserDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchUserDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard";
      });
  },
});

// ========================================
// EXPORTS
// ========================================

export const { clearUserDashboardError } = userDashboardSlice.actions;

export const selectUserDashboard = (state) => state.userDashboard.dashboard;
export const selectUserDashboardLoading = (state) =>
  state.userDashboard.loading;
export const selectUserDashboardError = (state) =>
  state.userDashboard.error;

export default userDashboardSlice.reducer;
