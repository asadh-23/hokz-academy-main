import express from "express";
import {
    getAdminProfile,
    updateAdminProfileImage,
    requestPasswordChange,
    verifyPasswordChange,
    resendPasswordChangeOtp,
} from "../../controllers/admin/profileController.js";
import imageUpload from "../../middlewares/imageUploadMiddleware.js";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

// Protected routes - require authentication
adminRouter.use(verifyToken, isAdmin);

// Profile management
adminRouter.get("/", getAdminProfile);
adminRouter.post("/image", imageUpload.single("profileImageFile"), updateAdminProfileImage);

export default adminRouter;
