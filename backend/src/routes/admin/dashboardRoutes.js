import express from "express";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";
import { exportAdminOrders, getAdminDashboardStats } from "../../controllers/admin/dashboardController.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getAdminDashboardStats);
adminRouter.get("/orders", exportAdminOrders);

export default adminRouter;