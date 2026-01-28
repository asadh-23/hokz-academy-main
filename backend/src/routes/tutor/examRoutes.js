import express from "express";
import { createExam, getExamByCourse, getExamAnalytics, updateExam } from "../../controllers/tutor/examController.js";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";

const examRouter = express.Router();

examRouter.use(verifyToken, isTutor);

examRouter.post("/exam/create", createExam);
examRouter.get("/exam/:courseId", getExamByCourse);
examRouter.get("/exam/analytics/:courseId", getExamAnalytics);
examRouter.put("/exam/update/:courseId", updateExam);

export default examRouter;