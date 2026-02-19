import express from "express";
import { getAllTutors, getTutorDetails, toggleBlockTutor } from "../../controllers/admin/tutorController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getAllTutors);
adminRouter.patch("/:tutorId/toggle-block", toggleBlockTutor);
adminRouter.get("/:tutorId", getTutorDetails);


export default adminRouter;