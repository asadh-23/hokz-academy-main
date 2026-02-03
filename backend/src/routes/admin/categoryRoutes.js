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

adminRouter.get("/categories", getCategories);
adminRouter.post("/categories", createCategory);
adminRouter.put("/categories/:id", updateCategory);
adminRouter.patch("/categories/:id/toggle-list", toggleListCategory);

export default adminRouter;
