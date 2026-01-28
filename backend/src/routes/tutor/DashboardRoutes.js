import express from 'express'

import { getTutorDashboardStats } from '../../controllers/tutor/dashboardController.js';
import { verifyToken, isTutor } from '../../middlewares/authMiddleware.js';

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/dashboard", getTutorDashboardStats);

export default tutorRouter;