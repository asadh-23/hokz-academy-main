import express from "express";
import { getCourseContent, updateLessonProgress } from "../../controllers/user/courseProgressController.js";
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/:courseId/content", getCourseContent);
userRouter.post("/progress", updateLessonProgress);

export default userRouter;