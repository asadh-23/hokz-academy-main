import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tutorAxios } from "../../../api/tutorAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Fetch all coupons for tutor
export const fetchTutorCoupons = createAsyncThunk("tutorCoupon/fetchTutorCoupons", async (_, { rejectWithValue }) => {
    try {
        const res = await tutorAxios.get("/coupons");
        return res.data.coupons;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch coupons");
    }
});

// Create new coupon
export const createTutorCoupon = createAsyncThunk(
    "tutorCoupon/createTutorCoupon",
    async (couponData, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.post("/coupons/coupon", couponData);
            return res.data.coupon;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create coupon");
        }
    }
);

// Update coupon
export const updateTutorCoupon = createAsyncThunk(
    "tutorCoupon/updateTutorCoupon",
    async ({ couponId, couponData }, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.put(`/coupons/${couponId}`, couponData);
            return res.data.coupon;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update coupon");
        }
    }
);

// Delete coupon
export const deleteTutorCoupon = createAsyncThunk(
    "tutorCoupon/deleteTutorCoupon",
    async (couponId, { rejectWithValue }) => {
        try {
            await tutorAxios.delete(`/coupons/${couponId}`);
            return couponId;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to delete coupon");
        }
    }
);

// Fetch coupon statistics
export const fetchCouponStats = createAsyncThunk("tutorCoupon/fetchCouponStats", async (_, { rejectWithValue }) => {
    try {
        const res = await tutorAxios.get("/coupons/stats");
        return res.data.stats;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch coupon stats");
    }
});

// Toggle coupon status (list/unlist)
export const toggleCouponStatus = createAsyncThunk(
    "tutorCoupon/toggleCouponStatus",
    async (couponId, { rejectWithValue }) => {
        try {
            const res = await tutorAxios.patch(`/coupons/${couponId}/toggle`);
            return res.data.coupon;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to toggle coupon status");
        }
    }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    coupons: [],
    stats: {
        totalCoupons: 0,
        activeCoupons: 0,
        totalUsage: 0,
        totalDiscount: 0,
    },
    loading: false,
    statsLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: {},
    toggleLoading: {},
    error: null,
};

// ======================================================
// SLICE
// ======================================================

const tutorCouponSlice = createSlice({
    name: "tutorCoupon",
    initialState,

    extraReducers: (builder) => {
        // Fetch Coupons
        builder
            .addCase(fetchTutorCoupons.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTutorCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchTutorCoupons.rejected, (state, action) => {
                state.loading = false;
            });

        // Create Coupon
        builder
            .addCase(createTutorCoupon.pending, (state) => {
                state.createLoading = true;
            })
            .addCase(createTutorCoupon.fulfilled, (state, action) => {
                state.createLoading = false;
                state.coupons.unshift(action.payload);

                // Update Total Count
                state.stats.totalCoupons += 1;
            })
            .addCase(createTutorCoupon.rejected, (state, action) => {
                state.createLoading = false;
            });

        // Update Coupon
        builder
            .addCase(updateTutorCoupon.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateTutorCoupon.fulfilled, (state, action) => {
                state.updateLoading = false;
                const index = state.coupons.findIndex((c) => c._id === action.payload._id);
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
            })
            .addCase(updateTutorCoupon.rejected, (state, action) => {
                state.updateLoading = false;
            });

        // Delete Coupon
        builder
            .addCase(deleteTutorCoupon.pending, (state, action) => {
                const couponId = action.meta.arg;
                state.deleteLoading[couponId] = true;
            })
            .addCase(deleteTutorCoupon.fulfilled, (state, action) => {
                const couponId = action.payload;
                state.deleteLoading[couponId] = false;

                const deletedCoupon = state.coupons.find((c) => c._id === couponId);
                state.coupons = state.coupons.filter((c) => c._id !== couponId);

                // Update stats
                state.stats.totalCoupons -= 1;
                if (deletedCoupon?.status === "active") {
                    state.stats.activeCoupons -= 1;
                }
            })
            .addCase(deleteTutorCoupon.rejected, (state, action) => {
                const couponId = action.meta.arg;
                state.deleteLoading[couponId] = false;
            });

        // Fetch Stats
        builder
            .addCase(fetchCouponStats.pending, (state) => {
                state.statsLoading = true;
            })
            .addCase(fetchCouponStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchCouponStats.rejected, (state) => {
                state.statsLoading = false;
            });

        // Toggle Coupon Status
        builder
            .addCase(toggleCouponStatus.pending, (state, action) => {
                const couponId = action.meta.arg;
                state.toggleLoading[couponId] = true;
            })
            .addCase(toggleCouponStatus.fulfilled, (state, action) => {
                const updatedCoupon = action.payload;
                state.toggleLoading[updatedCoupon._id] = false;

                const index = state.coupons.findIndex((c) => c._id === updatedCoupon._id);
                if (index !== -1) {
                    state.coupons[index] = updatedCoupon;
                }
            })
            .addCase(toggleCouponStatus.rejected, (state, action) => {
                const couponId = action.meta.arg;
                state.toggleLoading[couponId] = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const { clearCouponError } = tutorCouponSlice.actions;

export const selectTutorCoupons = (state) => state.tutorCoupon.coupons;
export const selectCouponStats = (state) => state.tutorCoupon.stats;
export const selectCouponLoading = (state) => state.tutorCoupon.loading;
export const selectCouponStatsLoading = (state) => state.tutorCoupon.statsLoading;
export const selectCouponCreateLoading = (state) => state.tutorCoupon.createLoading;
export const selectCouponUpdateLoading = (state) => state.tutorCoupon.updateLoading;
export const selectCouponDeleteLoading = (state) => state.tutorCoupon.deleteLoading;
export const selectCouponToggleLoading = (state) => state.tutorCoupon.toggleLoading;

export default tutorCouponSlice.reducer;
