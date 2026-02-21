import express from "express";
import { getBestSellerCourses } from "../../controllers/user/dashboardController.js";

const userRouter = express.Router();

userRouter.get("/courses/best-sellers", getBestSellerCourses);


export default userRouter;