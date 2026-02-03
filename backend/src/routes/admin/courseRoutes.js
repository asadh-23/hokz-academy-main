import express from "express";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { getAllCourses, getAllCategories, getCourseDetails, toggleBlockCourse, toggleBlockLesson, getLessonDetails } from "../../controllers/admin/courseController.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/courses", getAllCourses);
adminRouter.get("/courses/categories", getAllCategories);
adminRouter.get("/courses/:courseId", getCourseDetails);
adminRouter.patch("/courses/:courseId/toggle-block", toggleBlockCourse);
adminRouter.get("/courses/lessons/:lessonId", getLessonDetails);
adminRouter.patch("/courses/lessons/:lessonId/toggle-block", toggleBlockLesson);

export default adminRouter;