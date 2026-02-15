import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";
import { tutorAxios } from "../../../api/tutorAxios";
import { adminAxios } from "../../../api/adminAxios";

const getAxiosInstance = (state) => {
    if (state.userAuth?.user) {
        return userAxios;
    }
    if (state.tutorAuth?.tutor) {
        return tutorAxios;
    }
    if(state.adminAuth?.admin) {
        return adminAxios;
    }

    throw new Error("No active chat session found");
};

// Fetch Notifications
export const fetchNotifications = createAsyncThunk("notifications/fetch", async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const axiosInstance = getAxiosInstance(state)
        const res = await axiosInstance.get("/notifications");
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Clear Notifications
export const clearAllNotifications = createAsyncThunk("notifications/clear", async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState();
        const axiosInstance = getAxiosInstance(state);
        await axiosInstance.delete("/notifications");
        return [];
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        items: [],
        unreadCount: 0,
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.items = action.payload;
            state.unreadCount = action.payload.length;
        });
        builder.addCase(clearAllNotifications.fulfilled, (state) => {
            state.items = [];
            state.unreadCount = 0;
        });
    },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;