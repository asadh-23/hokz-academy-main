import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';

import adminAuthRoutes from './routes/admin/authRoutes.js';
import tutorAuthRoutes from './routes/tutor/authRoutes.js';
import userAuthRoutes from './routes/user/authRoutes.js';

import adminProfileRoutes from './routes/admin/profileRoutes.js';
import adminUserRoutes from './routes/admin/userRoutes.js';
import adminTutorRoutes from './routes/admin/tutorRoutes.js';
import adminCategoryRoutes from './routes/admin/categoryRoutes.js';
import adminCourseRoutes from './routes/admin/courseRoutes.js';
import adminOrderRoutes from './routes/admin/orderRoutes.js'
import adminDashboardRoutes from "./routes/admin/dashboardRoutes.js";
import adminWalletRoutes from "./routes/admin/walletRoutes.js";
import adminNotificationRoutes from './routes/admin/notificationRoutes.js'

import tutorProfileRoutes from './routes/tutor/profileRoutes.js';
import tutorCourseRoutes from './routes/tutor/courseRoutes.js';
import tutorLessonRoutes from "./routes/tutor/lessonRoutes.js";
import tutorCouponRoutes from "./routes/tutor/couponRoutes.js";
import tutorExamRoutes from "./routes/tutor/examRoutes.js";
import tutorWalletRoutes from './routes/tutor/walletRouter.js';
import tutorOrderRoutes from './routes/tutor/orderRoutes.js';
import tutorDashboardRoutes from './routes/tutor/DashboardRoutes.js';
import tutorChatRoutes from './routes/tutor/chatRoutes.js';
import tutorNotificationRoutes from './routes/tutor/notificationRoutes.js'

import userProfileRoutes from './routes/user/profileRoutes.js';
import userCourseRoutes from "./routes/user/CourseRoutes.js";
import userWishlistRoutes from "./routes/user/wishlistRoutes.js"
import userCartRoutes from "./routes/user/cartRoutes.js";
import userPaymentRoutes from "./routes/user/paymentRoutes.js"
import userCourseProgress from "./routes/user/courseProgressRoutes.js"
import userExamRoutes from "./routes/user/examRoutes.js";
import userChatRoutes from './routes/user/chatRoutes.js';
import userNotificationRoutes from './routes/user/notificationRoutes.js'

// COMMON
import publicRoutes from "./routes/public/publicRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorHandler.js";

import { app } from "./socket/socket.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(cors({
  origin: allowedOrigins, // simplified array
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (req, res) => {
  res.send("<h1>Backend server is running</h1>");
});

app.use('/api/auth', authRoutes);

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/tutor/auth', tutorAuthRoutes);
app.use('/api/user/auth', userAuthRoutes);

app.use('/api/admin', adminProfileRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/admin', adminTutorRoutes);
app.use('/api/admin', adminCategoryRoutes);
app.use('/api/admin', adminCourseRoutes);
app.use('/api/admin', adminOrderRoutes);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/admin', adminWalletRoutes);
app.use('/api/admin', adminNotificationRoutes);

app.use('/api/tutor', tutorProfileRoutes);
app.use('/api/tutor', tutorCourseRoutes);
app.use("/api/tutor", tutorLessonRoutes);
app.use("/api/tutor", tutorCouponRoutes);
app.use("/api/tutor", tutorExamRoutes);
app.use("/api/tutor", tutorWalletRoutes);
app.use("/api/tutor", tutorOrderRoutes);
app.use("/api/tutor", tutorDashboardRoutes);
app.use("/api/tutor", tutorChatRoutes);
app.use("/api/tutor", tutorNotificationRoutes)

app.use('/api/user', userProfileRoutes);
app.use("/api/user", userCourseRoutes);
app.use("/api/user", userWishlistRoutes);
app.use("/api/user", userCartRoutes);
app.use("/api/user", userPaymentRoutes);
app.use("/api/user", userCourseProgress);
app.use("/api/user", userExamRoutes);
app.use("/api/user", userChatRoutes);
app.use("/api/user", userNotificationRoutes);

app.use("/api", publicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
