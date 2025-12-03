import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Fetch wishlist
export const fetchUserWishlist = createAsyncThunk("userWishlist/fetchUserWishlist", async (_, { rejectWithValue }) => {
    try {
        const res = await userAxios.get("/wishlist");
        return res.data.wishlist;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch wishlist");
    }
});

// Toggle wishlist (add or remove)
export const toggleUserWishlist = createAsyncThunk(
    "userWishlist/toggleUserWishlist",
    async (courseId, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const wishlist = state.userWishlist.wishlist;

            const existingItem = wishlist.find((item) => item.course?._id === courseId);

            if (existingItem) {
                await userAxios.delete(`/wishlist/${existingItem._id}`);
                return { action: "removed", wishlistId: existingItem._id };
            } else {
                const res = await userAxios.post("/wishlist", { courseId });
                return { action: "added", item: res.data.item };
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update wishlist");
        }
    }
);

export const clearUserWishlist = createAsyncThunk("userWishlist/clearUserWishlist", async (_, { rejectWithValue }) => {
    try {
        await userAxios.delete("/wishlist");
        return;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    wishlist: [],
    loading: false,
    loadingById: {},
    loadingClearWishlist: false,
};

// ======================================================
// SLICE
// ======================================================

const userWishlistSlice = createSlice({
    name: "userWishlist",
    initialState,

    extraReducers: (builder) => {
        // Fetch wishlist
        builder
            .addCase(fetchUserWishlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload || [];
            })
            .addCase(fetchUserWishlist.rejected, (state, action) => {
                state.loading = false;
            });

        // Toggle wishlist
        builder
            .addCase(toggleUserWishlist.pending, (state, action) => {
                const courseId = action.meta.arg;
                state.loadingById[courseId] = true;
            })
            .addCase(toggleUserWishlist.fulfilled, (state, action) => {
                const courseId = action.meta.arg;
                state.loadingById[courseId] = false;

                if (action.payload.action === "added") {
                    state.wishlist.push(action.payload.item);
                } else {
                    state.wishlist = state.wishlist.filter((item) => item._id !== action.payload.wishlistId);
                }
            })
            .addCase(toggleUserWishlist.rejected, (state, action) => {
                const courseId = action.meta.arg;
                state.loadingById[courseId] = false;
            });

        //Remove
        builder
            .addCase(clearUserWishlist.pending, (state) => {
                state.loadingClearWishlist = true;
            })
            .addCase(clearUserWishlist.fulfilled, (state) => {
                state.wishlist = [];
                state.loadingClearWishlist = false;
            })
            .addCase(clearUserWishlist.rejected, (state) => {
              state.loadingClearWishlist = false;
            })
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const selectUserWishlist = (state) => state.userWishlist.wishlist;
export const selectUserWishlistLoading = (state) => state.userWishlist.loading;
export const selectUserWishlistLoadingById = (state) => state.userWishlist.loadingById;
export const selectUserClearWishlistLoading = (state) => state.userWishlist.loadingClearWishlist;
export const selectIsInWishlist = (courseId) => (state) => {
    return state.userWishlist.wishlist.some((item) => item.course?._id === courseId);
};

export default userWishlistSlice.reducer;
