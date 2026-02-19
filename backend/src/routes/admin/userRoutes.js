import express from "express";
import { getAllUsers, toggleBlockUser } from "../../controllers/admin/userController.js";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getAllUsers);

adminRouter.patch("/:userId/toggle-block", toggleBlockUser);

export default adminRouter;
