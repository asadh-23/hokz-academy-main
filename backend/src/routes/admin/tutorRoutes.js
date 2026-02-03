import express from "express";
import { getAllTutors, getTutorDetails, toggleBlockTutor } from "../../controllers/admin/tutorController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/tutors", getAllTutors);
adminRouter.patch("/tutors/:tutorId/toggle-block", toggleBlockTutor);
adminRouter.get("/tutors/:tutorId", getTutorDetails);


export default adminRouter;