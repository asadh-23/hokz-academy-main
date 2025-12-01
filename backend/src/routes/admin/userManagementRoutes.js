import express from "express";
import { getAllUsers, toggleBlockUser } from "../../controllers/admin/userManagementController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/users", getAllUsers);

adminRouter.patch("/users/:userId/toggle-block", toggleBlockUser);

export default adminRouter;
