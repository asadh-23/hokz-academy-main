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
import ManageCategory from "../pages/admin/ManageCategory";
import CategoryView from "../pages/admin/CategoryView";
import ManageTutors from "../pages/admin/ManageTutors";
import TutorDetails from "../pages/admin/TutorDetails";
import Courses from "../pages/admin/Courses";
import ManageCourses from "../pages/admin/ManageCourses";
import ManageLesson from "../pages/admin/ManageLesson";
import Orders from "../pages/admin/Orders";
import OrderDetails from "../pages/admin/OrderDetails";
import Wallet from "../pages/admin/Wallet";

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
                    <Route path="/categories" element={<ManageCategory />} />
                    <Route path="/category/:categoryId" element={<CategoryView />} />
                    <Route path="/tutors/" element={<ManageTutors />} />
                    <Route path="/tutors/:tutorId/details" element={<TutorDetails />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:courseId/manage" element={<ManageCourses />} />
                    <Route path="/courses/:courseId/lessons/:lessonId" element={<ManageLesson />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:orderId" element={<OrderDetails/> } />
                    <Route path="/wallet" element={<Wallet/> } />
                </Route>

                <Route path="/verify-password-change" element={<VerifyPasswordChangeOtp />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
