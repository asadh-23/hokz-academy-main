import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAxios } from "../../../api/publicAxios";

// ======================================================
// ASYNC THUNKS (ADMIN AUTH)
// ======================================================

// ADMIN LOGIN
export const adminLogin = createAsyncThunk("adminAuth/adminLogin", async (credentials, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post("/admin/auth/login", credentials);
        return res.data; // { user, accessToken }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Admin login failed");
    }
});

// ADMIN LOGOUT
export const logoutAdmin = createAsyncThunk("adminAuth/logoutAdmin", async (_, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post("/auth/logout");
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
});

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    loading: false,

    admin: null,
    token: null,
    isAuthenticated: false,
};

// ======================================================
// SLICE
// ======================================================

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState,

    reducers: {
        clearAdminAuthState: (state) => {
            state.loading = false;

            state.admin = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        patchToken: (state, action) => {
            state.token = action.payload;
        },
        // Action for Google Auth / OTP verification success
        adminLoginSuccess: (state, action) => {
            state.admin = action.payload.admin;
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;
            state.loading = false;
        },
        patchAdmin: (state, action) => {
            if (state.admin) {
                Object.assign(state.admin, action.payload);
            }
        },
    },

    extraReducers: (builder) => {
        // LOGIN
        builder
            .addCase(adminLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload.user;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.loading = false;
            });

        // LOGOUT
        builder
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.admin = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutAdmin.rejected, (state, action) => {
                state.admin = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const { clearAdminAuthState, patchToken, adminLoginSuccess, patchAdmin } = adminAuthSlice.actions;

// SELECTORS
export const selectAdminAuth = (state) => state.adminAuth;
export const selectAdmin = (state) => state.adminAuth.admin;
export const selectAdminToken = (state) => state.adminAuth.token;
export const selectAdminAuthLoading = (state) => state.adminAuth.loading;
export const selectAdminIsAuthenticated = (state) => state.adminAuth.isAuthenticated;

export default adminAuthSlice.reducer;
