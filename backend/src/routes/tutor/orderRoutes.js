import express from 'express'

import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import { getOrderDetails, getTutorOrders } from '../../controllers/tutor/orderController.js';

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/orders", getTutorOrders);
tutorRouter.get("/orders/:orderId", getOrderDetails);

export default tutorRouter;