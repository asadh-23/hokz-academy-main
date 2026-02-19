import express from "express";

import { verifyToken, isAdmin } from "../../middlewares/authMiddleware.js";
import { getAdminWallet } from "../../controllers/admin/walletController.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getAdminWallet);

export default adminRouter;
