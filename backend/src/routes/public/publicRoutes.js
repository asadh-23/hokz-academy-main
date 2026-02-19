import express from "express";

import { getListedCategories } from "../../controllers/public/categoryController.js";

const router = express.Router();

router.get("/", getListedCategories);

export default router;