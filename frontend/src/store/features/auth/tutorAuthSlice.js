import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicAxios } from "../../../api/publicAxios";

// ======================================================
// ASYNC THUNKS (TUTOR ONLY)
// ======================================================

// TUTOR LOGIN
export const tutorLogin = createAsyncThunk("tutorAuth/tutorLogin", async (credentials, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post("/tutor/auth/login", credentials);
        return res.data; // { user, accessToken }
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Tutor login failed");
    }
});

// TUTOR REGISTER
export const tutorRegister = createAsyncThunk("tutorAuth/tutorRegister", async (tutorData, { rejectWithValue }) => {
    try {
        const res = await publicAxios.post("/tutor/auth/register", tutorData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Tutor registration failed");
    }
});

// TUTOR LOGOUT
export const logoutTutor = createAsyncThunk("tutorAuth/logoutTutor", async (_, { rejectWithValue }) => {
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

    tutor: null,
    token: null,
    isAuthenticated: false,
};

// ======================================================
// SLICE user
// ======================================================

const tutorAuthSlice = createSlice({
    name: "tutorAuth",
    initialState,

    reducers: {
        clearTutorAuthState: (state) => {
            state.loading = false;

            state.tutor = null;
            state.token = null;
            state.isAuthenticated = false;
            state.registeredEmail = null;
        },

        // interceptor refresh
        patchToken: (state, action) => {
            state.token = action.payload;
        },
        // Action for Google Auth / OTP verification success
        tutorLoginSuccess: (state, action) => {
            state.tutor = action.payload.tutor;
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;
            state.loading = false;
        },
        patchTutor: (state, action) => {
            if (state.tutor) {
                Object.assign(state.tutor, action.payload);
            }
        },
    },

    extraReducers: (builder) => {
        // LOGIN
        builder
            .addCase(tutorLogin.pending, (state) => {
                state.loading = true;
            })
            .addCase(tutorLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.tutor = action.payload.tutor;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(tutorLogin.rejected, (state, action) => {
                state.loading = false;
            });

        // LOGOUT
        builder
            .addCase(logoutTutor.fulfilled, (state) => {
                state.tutor = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutTutor.rejected, (state, action) => {
                state.tutor = null;
                state.token = null;
                state.isAuthenticated = false;
            });

        // REGISTER
        builder
            .addCase(tutorRegister.pending, (state) => {
                state.loading = true;
            })
            .addCase(tutorRegister.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(tutorRegister.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

// ======================================================
// EXPORTS
// ======================================================

export const { clearTutorAuthState, patchToken, tutorLoginSuccess, patchTutor } = tutorAuthSlice.actions;

export const selectTutorAuth = (state) => state.tutorAuth;
export const selectTutorAuthLoading = (state) => state.tutorAuth.loading;

export const selectTutorIsAuthenticated = (state) => state.tutorAuth.isAuthenticated;

export const selectTutor = (state) => state.tutorAuth.tutor;
export const selectTutorToken = (state) => state.tutorAuth.token;

export default tutorAuthSlice.reducer;
