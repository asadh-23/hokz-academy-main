import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Fetch wishlist
export const fetchUserWishlist = createAsyncThunk(
  "userWishlist/fetchUserWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userAxios.get("/wishlist");
      return res.data.wishlist; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

// Toggle wishlist (add or remove)
export const toggleUserWishlist = createAsyncThunk(
  "userWishlist/toggleUserWishlist",
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const wishlist = state.userWishlist.wishlist;
      
      // Check if course is already in wishlist
      const existingItem = wishlist.find(item => item.course?._id === courseId);
      
      if (existingItem) {
        // Remove from wishlist
        await userAxios.delete(`/wishlist/${existingItem._id}`);
        return { action: "removed", wishlistId: existingItem._id, courseId };
      } else {
        // Add to wishlist
        const res = await userAxios.post("/wishlist", { courseId });
        return { action: "added", item: res.data.item, courseId };
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update wishlist"
      );
    }
  }
);

// Remove course from wishlist (kept for backward compatibility in WishList page)
export const removeFromUserWishlist = createAsyncThunk(
  "userWishlist/removeFromUserWishlist",
  async (wishlistId, { rejectWithValue }) => {
    try {
      await userAxios.delete(`/wishlist/${wishlistId}`);
      return wishlistId; // return id to remove from state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================

const userWishlistSlice = createSlice({
  name: "userWishlist",
  initialState,

  reducers: {
    clearUserWishlistError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload || [];
      })
      .addCase(fetchUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle wishlist
    builder
      .addCase(toggleUserWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleUserWishlist.fulfilled, (state, action) => {
        if (action.payload.action === "added") {
          state.wishlist.push(action.payload.item);
        } else if (action.payload.action === "removed") {
          state.wishlist = state.wishlist.filter(
            (item) => item._id !== action.payload.wishlistId
          );
        }
      })
      .addCase(toggleUserWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Remove
    builder
      .addCase(removeFromUserWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromUserWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(removeFromUserWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// ======================================================
// EXPORTS
// ======================================================

export const { clearUserWishlistError } = userWishlistSlice.actions;

export const selectUserWishlist = (state) => state.userWishlist.wishlist;
export const selectUserWishlistLoading = (state) =>
  state.userWishlist.loading;
export const selectUserWishlistError = (state) => state.userWishlist.error;

// Helper selector to check if a course is in wishlist
export const selectIsInWishlist = (courseId) => (state) => {
  return state.userWishlist.wishlist.some(
    (item) => item.course?._id === courseId
  );
};

export default userWishlistSlice.reducer;
