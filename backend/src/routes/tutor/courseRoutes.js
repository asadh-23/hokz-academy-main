import express from "express";
import {
    getTutorCategories,
    uploadCourseThumbnail,
    createCourse,
    getTutorCourses,
    getCourseById,
    updateCourse,
    toggleListCourse,
} from "../../controllers/tutor/courseController.js";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import { courseThumbnailMiddleware } from "../../middlewares/courseThumbnailMiddleware.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/categories", getTutorCategories);
tutorRouter.post("/courses/upload-thumbnail", courseThumbnailMiddleware, uploadCourseThumbnail);
tutorRouter.post("/courses", createCourse);
tutorRouter.get("/courses/", getTutorCourses);
tutorRouter.get("/courses/:courseId", getCourseById);
tutorRouter.put("/courses/:courseId", updateCourse);
tutorRouter.patch("/courses/:courseId/toggle-list", toggleListCourse);



export default tutorRouter;
