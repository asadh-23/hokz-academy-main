import express from 'express'

import { exportTutorOrders, getTutorDashboardStats } from '../../controllers/tutor/dashboardController.js';
import { verifyToken, isTutor } from '../../middlewares/authMiddleware.js';

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/", getTutorDashboardStats);
tutorRouter.get("/orders", exportTutorOrders);

export default tutorRouter;