import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';

import adminAuthRoutes from './routes/admin/authRoutes.js';
import tutorAuthRoutes from './routes/tutor/authRoutes.js';
import userAuthRoutes from './routes/user/authRoutes.js';

import adminProfileRoutes from './routes/admin/profileRoutes.js';
import adminUserManagementRoutes from './routes/admin/userManagementRoutes.js';
// import adminTutorManagementRoutes from './routes/admin/tutorManagementRoutes.js';
import adminCategoryRoutes from './routes/admin/categoryRoutes.js';
// import adminCourseManagementRoutes from './routes/admin/courseManagementRoutes.js';
// import adminOrderManagementRoutes from './routes/admin/orderManagementRoutes.js';
// import adminDashboardRoutes from './routes/admin/dashboardRoutes.js';

import tutorProfileRoutes from './routes/tutor/profileRoutes.js';
import tutorCourseRoutes from './routes/tutor/courseRoutes.js';
import tutorLessonRoutes from "./routes/tutor/lessonRoutes.js";

import userProfileRoutes from './routes/user/profileRoutes.js';
import userCourseRoutes from "./routes/user/CourseRoutes.js";
import userWishlistRoutes from "./routes/user/wishlistRoutes.js"


import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.get('/', (req, res) => {
  res.send("<h1>Backend server is running</h1>");
});

app.use('/api/auth', authRoutes);

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/tutor/auth', tutorAuthRoutes);
app.use('/api/user/auth', userAuthRoutes);

app.use('/api/admin', adminProfileRoutes);
app.use('/api/admin', adminUserManagementRoutes);
app.use('/api/admin', adminCategoryRoutes);
// app.use('/api/admin', adminTutorManagementRoutes);
// app.use('/api/admin', adminCourseManagementRoutes);
// app.use('/api/admin', adminOrderManagementRoutes);
// app.use('/api/admin', adminDashboardRoutes);

app.use('/api/tutor', tutorProfileRoutes);
app.use('/api/tutor', tutorCourseRoutes);
app.use("/api/tutor", tutorLessonRoutes)

app.use('/api/user', userProfileRoutes);
app.use("/api/user", userCourseRoutes);
app.use("/api/user", userWishlistRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
