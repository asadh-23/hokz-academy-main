import express from "express";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import { getTutorSidebar, sendMessageTutor } from "../../controllers/chat/tutorChatController.js";
import { getAllMessages, getSharedCourses } from "../../controllers/chat/commonController.js";
import { uploadMiddleware } from "../../middlewares/fileUploadMiddleware.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/conversations", getTutorSidebar);
tutorRouter.get("/:receiverId", getAllMessages);
tutorRouter.post("/send-message", uploadMiddleware, sendMessageTutor);
tutorRouter.get("/shared-courses/:participantId", getSharedCourses);

export default tutorRouter;
