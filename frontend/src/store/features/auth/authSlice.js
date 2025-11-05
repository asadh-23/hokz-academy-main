import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    role: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.isAuthenticated = true;
            state.role = action.payload.user.role;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.role = null;
        },
        setAccessToken: (state, action) => {
            state.token = action.payload;
        },
        updateUserData: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const { loginSuccess, logoutSuccess, setAccessToken, updateUserData } = authSlice.actions;

export default authSlice.reducer;
