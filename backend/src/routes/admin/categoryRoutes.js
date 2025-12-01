import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  toggleListCategory,
} from "../../controllers/admin/categoryController.js";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.use(verifyToken, isAdmin);

adminRouter.get("/categories", getAllCategories);
adminRouter.post("/categories", createCategory);
adminRouter.put("/categories/:id", updateCategory);
adminRouter.patch("/categories/:id/toggle-list", toggleListCategory);

export default adminRouter;
