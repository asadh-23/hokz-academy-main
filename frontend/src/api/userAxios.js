import axios from "axios";
import { setupInterceptors } from "./setupInterceptors";

export const userAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

setupInterceptors(userAxios);