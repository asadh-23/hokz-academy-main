import express from "express";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";
import { clearNotifications, getNotifications } from "../../controllers/notification/notificationController.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getNotifications);
adminRouter.delete("/", clearNotifications);


export default adminRouter;