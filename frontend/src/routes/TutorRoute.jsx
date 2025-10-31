import React from "react";
import { Route, Routes } from "react-router-dom";
import TutorRegister from "../pages/tutor/auth/TutorRegister";
import TutorLogin from "../pages/tutor/auth/TutorLogin";
import ForgotPassword from "../pages/common/ForgotPassword";
import OtpVerify from "../pages/common/OtpVerify";
import ResetPassword from "../pages/common/ResetPassword";

import TutorDashboard from "../pages/tutor/TutorDashboard";
import TutorProfile from "../pages/tutor/TutorProfile";
import NotFound from "../pages/error/NotFound";

import TutorPrivateRoute from "./guards/TutorPrivateRoute";
import TutorPublicRoute from "./guards/TutorPublicRoute";
import VerifyEmailChangeOtp from "../pages/common/VerifyEmailChangeOtp";
import VerifyPasswordChangeOtp from "../pages/common/VerifyPasswordChangeOtp";

export default function TutorRoutes() {
    return (
        <Routes>
          
            <Route element={<TutorPublicRoute />}>
                <Route path="/register" element={<TutorRegister />} />
                <Route path="/login" element={<TutorLogin />} />
                <Route path="/verify-otp" element={<OtpVerify />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>

            <Route element={<TutorPrivateRoute />}>
                <Route path="/dashboard" element={<TutorDashboard />} />
                <Route path="/profile" element={<TutorProfile />} />
                <Route path="/verify-email-change" element={<VerifyEmailChangeOtp/> } />
                <Route path="/verify-password-change" element={<VerifyPasswordChangeOtp/> } />
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}
