import axios from "axios";

export const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/auth`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});
