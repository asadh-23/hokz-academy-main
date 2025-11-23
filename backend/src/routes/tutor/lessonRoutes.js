import express from "express";
import { verifyToken, isTutor } from "../../middlewares/authMiddleware.js";
import { uploadLessonFile, createLesson, getCourseLessons, updateLesson, deleteLesson } from "../../controllers/tutor/lessonController.js";
import { lessonFilesMiddleware } from "../../middlewares/lessonFilesMiddleware.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.post("/lessons/upload/lesson-file",lessonFilesMiddleware, uploadLessonFile)
tutorRouter.post("/courses/:courseId/lesson", createLesson);
tutorRouter.get("/courses/:courseId/lessons", getCourseLessons);
tutorRouter.put("/lessons/:lessonId", updateLesson);
tutorRouter.delete("/lessons/:lessonId", deleteLesson);



export default tutorRouter;
