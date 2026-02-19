import express from "express";
import {
    getTutorCategories,
    uploadCourseThumbnail,
    createCourse,
    getTutorCourses,
    getCourseById,
    updateCourse,
    toggleListCourse,
    getCourseList,
    getCourseFullDetails,
} from "../../controllers/tutor/courseController.js";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import imageUpload from "../../middlewares/imageUploadMiddleware.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/categories", getTutorCategories);
tutorRouter.post("/upload-thumbnail", imageUpload.single("file"), uploadCourseThumbnail);
tutorRouter.post("/", createCourse);
tutorRouter.get("/list", getCourseList);
tutorRouter.get("/", getTutorCourses);
tutorRouter.get("/:courseId", getCourseById);
tutorRouter.put("/:courseId", updateCourse);
tutorRouter.patch("/:courseId/toggle-list", toggleListCourse);
tutorRouter.get("/:courseId/details", getCourseFullDetails);


export default tutorRouter;
