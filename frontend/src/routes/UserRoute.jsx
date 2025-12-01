import { Routes, Route } from "react-router-dom";
import UserRegister from "../pages/user/auth/UserRegister";
import UserLogin from "../pages/user/auth/UserLogin";
import OtpVerify from "../pages/common/OtpVerify";
import ForgotPassword from "../pages/common/ForgotPassword";
import ResetPassword from "../pages/common/ResetPassword";

import UserDashboard from "../pages/user/UserDashboard";
import NotFound from "../pages/error/NotFound";

import UserPrivateRoute from "./guards/UserPrivateRoute";
import UserPublicRoute from "./guards/UserPublicRoute";

import UserProfile from "../pages/user/UserProfile";
import Courses from "../pages/user/Courses";
import CourseDetails from "../pages/user/CourseDetails";
import { UserLayout } from "../layouts/UserLayout";
import Wishlist from "../pages/user/WishList";

export default function UserRoutes() {
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />

            <Route element={<UserPublicRoute />}>
                <Route path="/register" element={<UserRegister />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/verify-otp" element={<OtpVerify />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route element={<UserPrivateRoute />}>
                <Route element={<UserLayout />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:courseId" element={<CourseDetails />} />
                    <Route path="/wishlist" element={<Wishlist/> } />
                </Route>
            </Route>
        </Routes>
    );
}
