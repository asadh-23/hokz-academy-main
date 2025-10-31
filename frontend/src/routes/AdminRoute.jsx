import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/auth/AdminLogin";
import AdminPublicRoute from "./guards/AdminPublicRoute";
import NotFound from "../pages/error/NotFound";
import AdminPrivateRoute from "./guards/AdminPrivateRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminPublicRoute />}>
                <Route path="/login" element={<AdminLogin />} />
            </Route>

            <Route element={<AdminPrivateRoute />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
            </Route>

            
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
