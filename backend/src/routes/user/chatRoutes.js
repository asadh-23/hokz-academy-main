import express from "express";
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";
import { getAllMessages, getSharedCourses } from "../../controllers/chat/commonController.js";
import { uploadMiddleware } from "../../middlewares/fileUploadMiddleware.js";
import { getUserSidebar, sendMessageUser } from "../../controllers/chat/userChatController.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/conversations", getUserSidebar);
userRouter.get("/:receiverId", getAllMessages);
userRouter.post("/send-message", uploadMiddleware, sendMessageUser);
userRouter.get("/shared-courses/:participantId", getSharedCourses);

export default userRouter;