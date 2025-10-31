import axios from "axios";
import { attachTokenInterceptor, handle401Interceptor } from "./authInterceptors";


export const tutorAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/tutor`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

tutorAxios.interceptors.request.use(attachTokenInterceptor);
tutorAxios.interceptors.response.use(
  (response) => response,
  handle401Interceptor
);