import axios from "axios";
import { setupInterceptors } from "./setupInterceptors";

export const adminAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/admin`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

setupInterceptors(adminAxios);
