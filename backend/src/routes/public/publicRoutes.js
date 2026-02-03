import express from "express";

import { verifyToken } from "../../middlewares/authMiddleware.js";
import { getListedCategories } from "../../controllers/public/categoryController.js";

const router = express.Router();

router.get("/categories", getListedCategories);

export default router;