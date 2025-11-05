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
import VerifyEmailChangeOtp from "../pages/common/VerifyEmailChangeOtp";
import VerifyPasswordChangeOtp from "../pages/common/VerifyPasswordChangeOtp";

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
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/profile" element={<UserProfile /> } />
                <Route path="/verify-email-change" element={<VerifyEmailChangeOtp/> } />
                <Route path="/verify-password-change" element={<VerifyPasswordChangeOtp/> } />
            </Route>
        </Routes>
    );
}
