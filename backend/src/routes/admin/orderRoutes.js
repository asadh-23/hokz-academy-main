import express from "express";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";
import { getAllOrders, getOrderDetails } from "../../controllers/admin/orderController.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getAllOrders);
adminRouter.get("/:orderId", getOrderDetails);

export default adminRouter;