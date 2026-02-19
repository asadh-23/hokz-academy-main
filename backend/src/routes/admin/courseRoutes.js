import express from "express";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { getAllCourses, getAllCategories, getCourseDetails, toggleBlockCourse, toggleBlockLesson, getLessonDetails } from "../../controllers/admin/courseController.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getAllCourses);
adminRouter.get("/categories", getAllCategories);
adminRouter.get("/:courseId", getCourseDetails);
adminRouter.patch("/:courseId/toggle-block", toggleBlockCourse);
adminRouter.get("/lessons/:lessonId", getLessonDetails);
adminRouter.patch("/lessons/:lessonId/toggle-block", toggleBlockLesson);

export default adminRouter;