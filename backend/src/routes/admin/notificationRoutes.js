import express from "express";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";
import { clearNotifications, getNotifications } from "../../controllers/notification/notificationController.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/notifications", getNotifications);
adminRouter.delete("/notifications", clearNotifications);


export default adminRouter;