import express from "express";
import { verifyToken, isTutor } from "../../middlewares/authMiddleware.js";
import { uploadLessonFile, createLesson, getCourseLessons, updateLesson, deleteLesson } from "../../controllers/tutor/lessonController.js";
import { uploadMiddleware } from "../../middlewares/fileUploadMiddleware.js";
import { getLessonSecureUrl } from "../../controllers/public/lessonSignedUrlController.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.post("/upload/lesson-file",uploadMiddleware, uploadLessonFile)
tutorRouter.post("/courses/:courseId/lesson", createLesson);
tutorRouter.get("/courses/:courseId/lessons", getCourseLessons);
tutorRouter.put("/:lessonId", updateLesson);
tutorRouter.delete("/:lessonId", deleteLesson);
tutorRouter.get("/lesson-url/:lessonId", getLessonSecureUrl);




export default tutorRouter;
