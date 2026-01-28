import express from "express";
import { getExamByCourse, submitExam } from "../../controllers/user/examController.js";
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";

const examRouter = express.Router();

examRouter.use(verifyToken, isUser);

examRouter.get("/exam/:courseId", getExamByCourse);
examRouter.post("/exam/submit", submitExam);

export default examRouter;