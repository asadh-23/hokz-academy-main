import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// ======================================================
// ASYNC THUNKS
// ======================================================

// Fetch cart
export const fetchUserCart = createAsyncThunk("userCart/fetchUserCart", async (_, { rejectWithValue }) => {
    try {
        const res = await userAxios.get("/cart");
        return res.data.cart;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
});

// Add course to cart
export const addToUserCart = createAsyncThunk("userCart/addToUserCart", async (courseId, { rejectWithValue }) => {
    try {
        const res = await userAxios.post("/cart", { courseId });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
});

// Remove course from cart
export const removeFromUserCart = createAsyncThunk(
    "userCart/removeFromUserCart",
    async (cartItemId, { rejectWithValue }) => {
        try {
            const res = await userAxios.delete(`/cart/${cartItemId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to remove from cart");
        }
    }
);

// Clear entire cart
export const clearUserCart = createAsyncThunk("userCart/clearUserCart", async (_, { rejectWithValue }) => {
    try {
        const res = await userAxios.delete("/cart");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to clear cart");
    }
});

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    cart: {},
    loading: false,
    clearLoading: false,
    addLoadingById: {},
};

// ======================================================
// SLICE
// ======================================================

const userCartSlice = createSlice({
    name: "userCart",
    initialState,

    extraReducers: (builder) => {
        // Fetch cart
        builder
            .addCase(fetchUserCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.loading = false;
            });

        // Add to cart
        builder
            .addCase(addToUserCart.pending, (state, action) => {
                const courseId = action.meta.arg;
                state.addLoadingById[courseId] = true;
            })
            .addCase(addToUserCart.fulfilled, (state, action) => {
                const courseId = action.meta.arg;
                state.addLoadingById[courseId] = false;

                if (action.payload.cart) {
                    state.cart = action.payload.cart;
                }
            })
            .addCase(addToUserCart.rejected, (state, action) => {
                const courseId = action.meta.arg;
                state.addLoadingById[courseId] = false;
            });

        // Remove from cart
        builder.addCase(removeFromUserCart.fulfilled, (state, action) => {
            if (action.payload.cart) {
                state.cart = action.payload.cart;
            }
        });

        // Clear cart
        builder
            .addCase(clearUserCart.pending, (state) => {
                state.clearLoading = true;
            })
            .addCase(clearUserCart.fulfilled, (state, action) => {
                state.clearLoading = false;
                state.cart = action.payload?.cart || {};
            })
            .addCase(clearUserCart.rejected, (state) => {
                state.clearLoading = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const selectUserCart = (state) => state.userCart.cart;
export const selectUserCartLoading = (state) => state.userCart.loading;
export const selectUserClearCartLoading = (state) => state.userCart.clearLoading;
export const selectUserAddCartLoadingById = (state) => state.userCart.addLoadingById;

export default userCartSlice.reducer;
