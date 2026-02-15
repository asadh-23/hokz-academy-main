import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isConnected: false,
    onlineUsers: [],
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocketConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
});

export const { setSocketConnected, setOnlineUsers } = socketSlice.actions;

export const selectOnlineUsers = (state) => state.socket.onlineUsers;
export const selectIsSocketConnected = (state) => state.socket.isConnected;

export default socketSlice.reducer;