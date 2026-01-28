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
import TutorLayout from "../layouts/TutorLayout";
import AddCourse from "../pages/tutor/AddCourse";
import AddLesson from "../pages/tutor/AddLesson";
import ManageCourses from "../pages/tutor/ManageCourses";
import EditCourse from "../pages/tutor/EditCourse";
import Coupon from "../pages/tutor/Coupon";
import AddExam from "../pages/tutor/AddExam";
import ExamManagement from "../pages/tutor/ExamManagement";
import EditExam from "../pages/tutor/EditExam";
import WalletPage from "../pages/tutor/Wallet";
import Order from "../pages/tutor/Order";

export default function TutorRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<TutorPublicRoute />}>
                <Route path="/register" element={<TutorRegister />} />
                <Route path="/login" element={<TutorLogin />} />
                <Route path="/verify-otp" element={<OtpVerify />} />
                <Route path="/forgot-password" element={<ForgotPassword role="tutor" />} />
                <Route path="/reset-password/:token" element={<ResetPassword role="tutor" />} />
            </Route>

            {/* Private Routes with Layout */}
            <Route element={<TutorPrivateRoute />}>
                <Route element={<TutorLayout />}>
                    <Route path="/dashboard" element={<TutorDashboard />} />
                    <Route path="/profile" element={<TutorProfile />} />
                    <Route path="/verify-email-change" element={<VerifyEmailChangeOtp />} />
                    <Route path="/verify-password-change" element={<VerifyPasswordChangeOtp />} />
                    <Route path="/courses/add-course" element={<AddCourse />} />
                    <Route path="/courses/:courseId/add-lesson" element={<AddLesson />} />
                    <Route path="/courses" element={<ManageCourses/> } />
                    <Route path="/courses/:courseId/edit" element={<EditCourse/> } />
                    <Route path="/coupons" element={<Coupon/> } />
                    <Route path="/course/:courseId/add-exam" element={<AddExam/> } />
                    <Route path="/course/:courseId/manage-exam" element={<ExamManagement /> } />
                    <Route path="/course/:courseId/edit-exam" element={<EditExam /> } />
                    <Route path="/wallet" element={<WalletPage/> } />
                    <Route path="/orders" element={<Order/> } />
                    
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
