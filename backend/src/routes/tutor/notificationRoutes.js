import express from "express";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import { clearNotifications, getNotifications } from "../../controllers/notification/notificationController.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/notifications", getNotifications);
tutorRouter.delete("/notifications", clearNotifications);


export default tutorRouter;