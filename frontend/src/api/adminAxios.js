import axios from "axios";
import { attachTokenInterceptor, handle401Interceptor } from "./authInterceptors";


export const adminAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/admin`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

adminAxios.interceptors.request.use(attachTokenInterceptor);
adminAxios.interceptors.response.use((response) => response, handle401Interceptor);
