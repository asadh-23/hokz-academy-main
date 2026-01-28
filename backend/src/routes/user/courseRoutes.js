import express from "express"
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";
import { getAllCourses, getListedCategories, getCourseDetails, getMyCourses, getMyCertificates } from "../../controllers/user/courseController.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/courses", getAllCourses);
userRouter.get("/categories/listed", getListedCategories);
userRouter.get("/courses/my-courses", getMyCourses);
userRouter.get("/courses/certificates", getMyCertificates);
userRouter.get("/courses/:courseId", getCourseDetails);


export default userRouter;