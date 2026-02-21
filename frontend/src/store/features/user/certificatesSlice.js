import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userAxios } from "../../../api/userAxios";

// 1. Fetching Thunk
export const fetchUserCertificates = createAsyncThunk(
    "userCertificates/fetchUserCertificates",
    async (_, { rejectWithValue }) => {
        try {
            const response = await userAxios.get("/courses/certificates");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch certificates");
        }
    }
);

const userCertificatesSlice = createSlice({
    name: "userCertificates",
    initialState: {
        certificates: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserCertificates.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserCertificates.fulfilled, (state, action) => {
                state.loading = false;
                state.certificates = action.payload;
            })
            .addCase(fetchUserCertificates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectAllCertificates = (state) => state.userCertificates.certificates;
export const selectCertificatesLoading = (state) => state.userCertificates.loading;

export default userCertificatesSlice.reducer;