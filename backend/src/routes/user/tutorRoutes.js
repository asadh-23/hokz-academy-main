import express from "express";
import { getAllVerifiedTutors, getTutorDetails } from "../../controllers/user/tutorController.js";

const userRouter = express.Router();


userRouter.get("/", getAllVerifiedTutors);
userRouter.get("/:tutorId", getTutorDetails);

export default userRouter;