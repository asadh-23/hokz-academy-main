import express from "express";
import {
    getAdminProfile,
    updateAdminProfileImage,
    requestPasswordChange,
    verifyPasswordChange,
    resendPasswordChangeOtp,
} from "../../controllers/admin/profileController.js";
import upload from "../../middlewares/multerMiddleware.js";
import { isAdmin, verifyToken } from "../../middlewares/authMiddleware.js";

const adminRouter = express.Router();

// Protected routes - require authentication
adminRouter.use(verifyToken, isAdmin);

// Profile management
adminRouter.get("/profile", getAdminProfile);
adminRouter.post("/profile/image", upload.single("profileImageFile"), updateAdminProfileImage);

// Password change
adminRouter.post("/request-password-change", requestPasswordChange);
adminRouter.post("/verify-password-change", verifyPasswordChange);
adminRouter.post("/resend-password-change-otp", resendPasswordChangeOtp);

export default adminRouter;
