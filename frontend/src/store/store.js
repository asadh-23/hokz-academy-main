import { configureStore } from "@reduxjs/toolkit";

// ================== AUTH ==================
import userAuthReducer from "./features/auth/userAuthSlice";
import tutorAuthReducer from "./features/auth/tutorAuthSlice";
import adminAuthReducer from "./features/auth/adminAuthSlice";
import googleAuthReducer from "./features/auth/googleAuthSlice";
import otpReducer from "./features/auth/otpSlice";
import passwordReducer from "./features/auth/passwordSlice";
import emailChangeReducer from "./features/auth/emailChangeSlice";

// ================== USER ==================
import userProfileReducer from "./features/user/userProfileSlice";
import userDashboardReducer from "./features/user/userDashboardSlice";
import userCoursesReducer from "./features/user/userCoursesSlice";
import courseProgressReducer from "./features/user/courseProgressSlice";
import userWishlistReducer from "./features/user/userWishlistSlice";
import userCartReducer from "./features/user/userCartSlice";
import userCertificatesReducer from "./features/user/certificatesSlice";

// ================== TUTOR ==================
import tutorProfileReducer from "./features/tutor/tutorProfileSlice";
import tutorDashboardReducer from "./features/tutor/tutorDashboardSlice";
import tutorCoursesReducer from "./features/tutor/tutorCoursesSlice";
import tutorCouponReducer from "./features/tutor/tutorCouponSlice";

// ================== ADMIN ==================
import adminProfileReducer from "./features/admin/adminProfileSlice";
import adminDashboardReducer from "./features/admin/adminDashboardSlice";
import adminCategoryReducer from "./features/admin/adminCategorySlice";
import adminUserReducer from "./features/admin/adminUserSlice";
import adminTutorReducer from "./features/admin/adminTutorSlice";
import adminCourseReducer from "./features/admin/adminCourseSlice";

// ================== COMMON ==================
import categoryReducer from './features/public/categorySlice';
import socketReducer from './features/socket/socketSlice'
import chatReducer from './features/chat/chatSlice';
import notificationReducer from './features/notification/notificationSlice'
// ======================================================
// STORE CONFIG
// ======================================================

export const store = configureStore({
  reducer: {
    // AUTH
    userAuth: userAuthReducer,
    tutorAuth: tutorAuthReducer,
    adminAuth: adminAuthReducer,
    googleAuth: googleAuthReducer,
    otp: otpReducer,
    password: passwordReducer,
    emailChange: emailChangeReducer,

    // USER
    userProfile: userProfileReducer,
    userDashboard: userDashboardReducer,
    userCourses: userCoursesReducer,
    courseProgress: courseProgressReducer,
    userWishlist: userWishlistReducer,
    userCart: userCartReducer,
    userCertificates: userCertificatesReducer,

    // TUTOR
    tutorProfile: tutorProfileReducer,
    tutorDashboard: tutorDashboardReducer,
    tutorCourses: tutorCoursesReducer,
    tutorCoupon: tutorCouponReducer,

    // ADMIN
    adminProfile: adminProfileReducer,
    adminDashboard: adminDashboardReducer,
    adminCategories: adminCategoryReducer,
    adminUsers: adminUserReducer,
    adminTutors: adminTutorReducer,
    adminCourses: adminCourseReducer,

    // COMMON
    categories: categoryReducer,
    socket: socketReducer,
    chat: chatReducer,
    notifications: notificationReducer,

  },

  devTools: import.meta.env.MODE !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
