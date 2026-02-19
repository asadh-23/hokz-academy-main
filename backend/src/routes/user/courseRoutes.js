import express from "express"
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";
import { 
    getAllCourses, 
    getListedCategories, 
    getCourseDetails, 
    getMyCourses, 
    getMyCertificates 
} from "../../controllers/user/courseController.js";

const userRouter = express.Router();


// --- PROTECTED ROUTES (Login Required) ---
userRouter.get("/my-courses", verifyToken, isUser, getMyCourses);
userRouter.get("/certificates", verifyToken, isUser, getMyCertificates);

// --- PUBLIC ROUTES (No Login Needed) ---

userRouter.get("/", getAllCourses);
userRouter.get("/categories/listed", getListedCategories);
userRouter.get("/:courseId/details", getCourseDetails);

export default userRouter;