import express from "express"
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";
import { getAllCourses, getListedCategories } from "../../controllers/user/courseController.js";
const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/courses", getAllCourses);
userRouter.get("/categories/listed", getListedCategories);

export default userRouter;