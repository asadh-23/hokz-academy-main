import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin/auth/AdminLogin";
import AdminPublicRoute from "./guards/AdminPublicRoute";
import NotFound from "../pages/error/NotFound";
import AdminLayout from "../layouts/AdminLayout";
import AdminPrivateRoute from "./guards/AdminPrivateRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProfile from "../pages/admin/AdminProfile";
import VerifyPasswordChangeOtp from "../pages/common/VerifyPasswordChangeOtp";
import ManageUsers from "../pages/admin/ManageUsers";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminPublicRoute />}>
                <Route path="/login" element={<AdminLogin />} />
            </Route>

            <Route element={<AdminPrivateRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/profile" element={<AdminProfile />} />
                    <Route path="/users" element={<ManageUsers />} />
                </Route>

                <Route path="/verify-password-change" element={<VerifyPasswordChangeOtp />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
