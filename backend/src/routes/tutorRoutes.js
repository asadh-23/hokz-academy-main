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
    requestPasswordChange,
    verifyPasswordChange,
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
tutorRouter.post("/request-password-change", requestPasswordChange);
tutorRouter.post("/verify-password-change", verifyPasswordChange);

export default tutorRouter;
