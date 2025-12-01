import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAxios } from "../../../api/publicAxios";

// ======================================================
// ASYNC THUNKS (USER ONLY)
// ======================================================

// USER LOGIN
export const userLogin = createAsyncThunk("userAuth/userLogin", async (credentials, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post("/user/auth/login", credentials);
        return res.data; // { user, accessToken }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "User login failed");
    }
});

// USER REGISTER
export const userRegister = createAsyncThunk("userAuth/userRegister", async (userData, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post("/user/auth/register", userData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "User registration failed");
    }
});

// USER LOGOUT
export const logoutUser = createAsyncThunk("userAuth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        await publicAxios.post("/auth/logout");
        return true;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
});

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    loading: false,
    user: null,
    token: null,
    isAuthenticated: false,
};

// ======================================================
// SLICE
// ======================================================

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,

    reducers: {
        clearUserAuthState: (state) => {
            state.loading = false;

            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        patchToken: (state, action) => {
            state.token = action.payload;
        },
        // Action for Google Auth / OTP verification success
        userLoginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;
            state.loading = false;
        },
        patchUser: (state, action) => {
            if (state.user) {
                Object.assign(state.user, action.payload);
            }
        },
    },

    extraReducers: (builder) => {
        // LOGIN
        builder
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
            });

        // LOGOUT
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });

        // REGISTER
        builder
            .addCase(userRegister.pending, (state) => {
                state.loading = true;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const { clearUserAuthState, patchToken, userLoginSuccess, patchUser } = userAuthSlice.actions;

export const selectUserAuth = (state) => state.userAuth;
export const selectUserAuthLoading = (state) => state.userAuth.loading;
export const selectUserIsAuthenticated = (state) => state.userAuth.isAuthenticated;
export const selectUser = (state) => state.userAuth.user;
export const selectUserToken = (state) => state.userAuth.token;

export default userAuthSlice.reducer;
