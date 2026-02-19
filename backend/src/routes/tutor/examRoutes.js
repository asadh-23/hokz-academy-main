import express from "express";
import { createExam, getExamByCourse, getExamAnalytics, updateExam } from "../../controllers/tutor/examController.js";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";

const examRouter = express.Router();

examRouter.use(verifyToken, isTutor);

examRouter.post("/create", createExam);
examRouter.get("/:courseId", getExamByCourse);
examRouter.get("/analytics/:courseId", getExamAnalytics);
examRouter.put("/update/:courseId", updateExam);

export default examRouter;