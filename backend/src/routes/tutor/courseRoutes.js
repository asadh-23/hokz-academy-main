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
} from "../../controllers/tutor/courseController.js";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import imageUpload from "../../middlewares/imageUploadMiddleware.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.get("/categories", getTutorCategories);
tutorRouter.post("/courses/upload-thumbnail", imageUpload.single("file"), uploadCourseThumbnail);
tutorRouter.post("/courses", createCourse);
tutorRouter.get("/courses/list", getCourseList);
tutorRouter.get("/courses/", getTutorCourses);
tutorRouter.get("/courses/:courseId", getCourseById);
tutorRouter.put("/courses/:courseId", updateCourse);
tutorRouter.patch("/courses/:courseId/toggle-list", toggleListCourse);


export default tutorRouter;
