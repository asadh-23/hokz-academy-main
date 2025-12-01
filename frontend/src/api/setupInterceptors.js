import axios from "axios";

import { patchToken as patchTutorToken } from "../store/features/auth/tutorAuthSlice";
import { patchToken as patchAdminToken } from "../store/features/auth/adminAuthSlice";
import { patchToken as patchUserToken } from "../store/features/auth/userAuthSlice";

let isRefreshing = false;
let failedQueue = [];
let storeRef = null;

// Receive store reference from main.jsx
export const setStoreRef = (store) => {
    storeRef = store;
};

// Used when multiple 401 requests happen at same time
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Attach access token automatically
const attachTokenInterceptor = (config) => {
    if (!storeRef) return config;

    const state = storeRef.getState();

    const token =
        state.userAuth?.token ||
        state.tutorAuth?.token ||
        state.adminAuth?.token;

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
};

// Handle 401 + Refresh Token
const handle401Interceptor = async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axios(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            console.log("🔄 Attempting to refresh access token...");
            
            // Common refresh endpoint
            const refreshAxios = axios.create({
                baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
                withCredentials: true,
            });

            const res = await refreshAxios.post("/auth/refresh");
            
            if (!res.data?.success) {
                throw new Error("Invalid refresh response");
            }
            
            const { accessToken } = res.data;
            
            console.log("✅ Access token refreshed successfully");

            // Manually patch the token inside correct slice
            const state = storeRef.getState();

            if (state.userAuth?.isAuthenticated) {
                storeRef.dispatch(patchUserToken(accessToken));
            }

            if (state.tutorAuth?.isAuthenticated) {
                storeRef.dispatch(patchTutorToken(accessToken));
            }

            if (state.adminAuth?.isAuthenticated) {
                storeRef.dispatch(patchAdminToken(accessToken));
            }

            processQueue(null, accessToken);

            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            return axios(originalRequest);

        } catch (refreshError) {
            console.error("❌ Refresh failed:", refreshError.response?.data || refreshError.message);

            processQueue(refreshError, null);

            // Clear state on all auth slices (universal logout)
            if (storeRef) {
                const userSlice = await import("../store/features/auth/userAuthSlice");
                const tutorSlice = await import("../store/features/auth/tutorAuthSlice");
                const adminSlice = await import("../store/features/auth/adminAuthSlice");

                storeRef.dispatch(userSlice.clearUserAuthState());
                storeRef.dispatch(tutorSlice.clearTutorAuthState());
                storeRef.dispatch(adminSlice.clearAdminAuthState());

                // Redirect to appropriate login page based on current route
                const currentPath = window.location.pathname;
                if (currentPath.startsWith('/admin')) {
                    window.location.href = '/admin/login';
                } else if (currentPath.startsWith('/tutor')) {
                    window.location.href = '/tutor/login';
                } else if (currentPath.startsWith('/user')) {
                    window.location.href = '/user/login';
                } else {
                    window.location.href = '/';
                }
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
};

// Attach the interceptors
export const setupInterceptors = (axiosInstance) => {
    axiosInstance.interceptors.request.use(attachTokenInterceptor);
    axiosInstance.interceptors.response.use(
        (response) => response,
        handle401Interceptor
    );
};
