import express from "express";
import { getCourseContent, updateLessonProgress } from "../../controllers/user/courseProgressController.js";
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/learning/:courseId/content", getCourseContent);
userRouter.post("/learning/progress", updateLessonProgress);

export default userRouter;