import express from "express";

// Controllers
import {
    loginTutor,
    registerTutor,
    resendOtp,
    verifyOtp,
    googleAuth,
    forgotPassword,
    resetPassword,
    getTutorProfile,
    updateTutorProfile,
    updateTutorProfileImage,
    requestEmailChange,
    verifyEmailChangeOtp,
    resendEmailChangeOtp,
    requestPasswordChange,
    verifyPasswordChange,
    resendPasswordChangeOtp,
} from "../controllers/tutorController.js"; 

import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadSingleImage } from "../middlewares/multerMiddleware.js";

const tutorRouter = express.Router();

tutorRouter.post("/register", registerTutor);
tutorRouter.post("/verify-otp", verifyOtp);
tutorRouter.post("/resend-otp", resendOtp);
tutorRouter.post("/login", loginTutor);
tutorRouter.post("/google-auth", googleAuth);
tutorRouter.post("/forgot-password", forgotPassword);
tutorRouter.post("/reset-password/:token", resetPassword);


tutorRouter.use(verifyToken);


tutorRouter.get("/profile", getTutorProfile);
tutorRouter.put("/profile", updateTutorProfile);
tutorRouter.post("/profile/image", uploadSingleImage, updateTutorProfileImage);
tutorRouter.post("/request-email-change", requestEmailChange);
tutorRouter.post("/verify-email-change", verifyEmailChangeOtp);
tutorRouter.post("/resend-email-change-otp",resendEmailChangeOtp);
tutorRouter.post("/request-password-change", requestPasswordChange);
tutorRouter.post("/verify-password-change", verifyPasswordChange);
tutorRouter.post("/resend-password-change-otp",resendPasswordChangeOtp);

export default tutorRouter;
