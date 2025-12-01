import axios from "axios";
import { setupInterceptors } from "./setupInterceptors";

export const tutorAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/tutor`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

setupInterceptors(tutorAxios);