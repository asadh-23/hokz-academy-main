import axios from "axios";
import { attachTokenInterceptor, handle401Interceptor } from "./authInterceptors";


export const userAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

userAxios.interceptors.request.use(attachTokenInterceptor);
userAxios.interceptors.response.use(
  (response) => response, 
  handle401Interceptor  
);