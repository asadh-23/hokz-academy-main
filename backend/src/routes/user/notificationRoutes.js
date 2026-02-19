import express from "express";
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";
import { clearNotifications, getNotifications } from "../../controllers/notification/notificationController.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/", getNotifications);
userRouter.delete("/", clearNotifications);


export default userRouter;