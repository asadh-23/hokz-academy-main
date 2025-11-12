import express from "express";
import { loginAdmin } from "../../controllers/admin/authController.js";

const adminRouter = express.Router();

// Public routes
adminRouter.post("/login", loginAdmin);

export default adminRouter;