import express from "express";
import {
    getTutorProfile,
    updateTutorProfile,
    updateTutorProfileImage,
    requestEmailChange,
    verifyEmailChangeOtp,
    resendEmailChangeOtp,
    requestPasswordChange,
    verifyPasswordChange,
    resendPasswordChangeOtp,
} from "../../controllers/tutor/profileController.js";
import { verifyToken, isTutor } from "../../middlewares/authMiddleware.js";
import upload from "../../middlewares/multerMiddleware.js";

const tutorRouter = express.Router();

// Protected routes - require authentication
tutorRouter.use(verifyToken, isTutor);

// Profile management
tutorRouter.get("/profile", getTutorProfile);
tutorRouter.put("/profile", updateTutorProfile);
tutorRouter.post("/profile/image", upload.single("profileImageFile"), updateTutorProfileImage);

// Email change
tutorRouter.post("/request-email-change", requestEmailChange);
tutorRouter.post("/verify-email-change", verifyEmailChangeOtp);
tutorRouter.post("/resend-email-change-otp", resendEmailChangeOtp);

// Password change
tutorRouter.post("/request-password-change", requestPasswordChange);
tutorRouter.post("/verify-password-change", verifyPasswordChange);
tutorRouter.post("/resend-password-change-otp", resendPasswordChangeOtp);

export default tutorRouter;
