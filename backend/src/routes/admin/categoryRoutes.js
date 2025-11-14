import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  unlistCategory,
  listCategory,
} from "../../controllers/admin/categoryController.js";

const adminRouter = express.Router();

adminRouter.get("/categories", getAllCategories);
adminRouter.post("/categories", createCategory);
adminRouter.put("/categories/:id", updateCategory);
adminRouter.patch("/categories/:id/unlist", unlistCategory);
adminRouter.patch("/categories/:id/list", listCategory);

export default adminRouter;
