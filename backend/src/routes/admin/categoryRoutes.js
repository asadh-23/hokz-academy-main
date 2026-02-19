import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  toggleListCategory,
} from "../../controllers/admin/categoryController.js";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/", getCategories);
adminRouter.post("/", createCategory);
adminRouter.put("/:id", updateCategory);
adminRouter.patch("/:id/toggle-list", toggleListCategory);

export default adminRouter;
