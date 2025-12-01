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
import userWishlistReducer from "./features/user/userWishlistSlice";

// ================== TUTOR ==================
import tutorProfileReducer from "./features/tutor/tutorProfileSlice";
import tutorDashboardReducer from "./features/tutor/tutorDashboardSlice";
import tutorCoursesReducer from "./features/tutor/tutorCoursesSlice";
import tutorCategoryReducer from "./features/tutor/tutorCategorySlice";

// ================== ADMIN ==================
import adminProfileReducer from "./features/admin/adminProfileSlice";
import adminDashboardReducer from "./features/admin/adminDashboardSlice";
import adminCategoryReducer from "./features/admin/adminCategorySlice";
import adminUserReducer from "./features/admin/adminUserSlice";
import adminTutorReducer from "./features/admin/adminTutorSlice";

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
    userWishlist: userWishlistReducer,

    // TUTOR
    tutorProfile: tutorProfileReducer,
    tutorDashboard: tutorDashboardReducer,
    tutorCourses: tutorCoursesReducer,
    tutorCategories: tutorCategoryReducer,

    // ADMIN
    adminProfile: adminProfileReducer,
    adminDashboard: adminDashboardReducer,
    adminCategories: adminCategoryReducer,
    adminUsers: adminUserReducer,
    adminTutors: adminTutorReducer,
  },

  devTools: import.meta.env.MODE !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
