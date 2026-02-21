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
import Wishlist from "../pages/user/WishList";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import OrderSuccess from "../pages/user/OrderSuccess";
import CourseLearning from "../pages/user/CourseLearning";
import CourseExam from "../pages/user/CourseExam";
import MyCourses from "../pages/user/MyCourses";
import MyOrders from "../pages/user/MyOrders";
import Certificates from "../pages/user/Certificates";
import ChatLayout from "../pages/chat/ChatLayout";
import TutorsListing from "../pages/user/TutorsListing";
import TutorDetails from "../pages/user/TutorDetails";
import VideoRoom from "../components/chat/VideoRoom";
import VerifyEmailChangeOtp from "../pages/common/VerifyEmailChangeOtp";
import VerifyPasswordChangeOtp from "../pages/common/VerifyPasswordChangeOtp";
import About from "../pages/home/About";
import Contact from "../pages/home/Contact";
import PublicLayout from "../layouts/PublicLayout";
import UserProfileLayout from "../layouts/UserProfileLayout";

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
            <Route element={<PublicLayout />}>
                <Route path="/aboutus" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:courseId" element={<CourseDetails />} />
                <Route path="/tutors" element={<TutorsListing />} />
                <Route path="/tutors/:tutorId" element={<TutorDetails />} />
            </Route>

            <Route element={<UserPrivateRoute />}>
                <Route element={<PublicLayout />}>
                    <Route element={<UserProfileLayout />}>
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/courses/my-courses" element={<MyCourses />} />
                        <Route path="/orders" element={<MyOrders />} />
                        <Route path="/certificates" element={<Certificates />} />
                    </Route>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/learn/:courseId" element={<CourseLearning />} />
                    <Route path="/course/:courseId/exam" element={<CourseExam />} />

                    <Route path="/verify-email-change" element={<VerifyEmailChangeOtp />} />
                    <Route path="/verify-password-change" element={<VerifyPasswordChangeOtp />} />
                </Route>
                <Route path="/chat" element={<ChatLayout />} />
                <Route path="/room/:roomId" element={<VideoRoom />} />
            </Route>
        </Routes>
    );
}
