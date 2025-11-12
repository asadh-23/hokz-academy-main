import axios from "axios";
import { store } from "../store/store";
import { logoutSuccess, setAccessToken } from "../store/features/auth/authSlice";
import { authAxios } from "./authAxios";

let isRefreshing = false;
let failedQueue = [];

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

export const attachTokenInterceptor = (config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};

export const handle401Interceptor = async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers["Authorization"] = "Bearer " + token;

                    return axios(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshResponse = await authAxios.post("/refresh");
            const { accessToken } = refreshResponse.data;

            store.dispatch(setAccessToken(accessToken));

            processQueue(null, accessToken);

            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            return axios(originalRequest);
        } catch (refreshError) {
            console.error("Refresh token failed:", refreshError.response?.data?.message || refreshError.message);
            processQueue(refreshError, null);
            store.dispatch(logoutSuccess());

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    return Promise.reject(error);
};
