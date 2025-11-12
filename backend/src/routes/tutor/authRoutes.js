import express from "express";
import {
    registerTutor,
    loginTutor,
    resendOtp,
    verifyOtp,
    googleAuth,
    forgotPassword,
    resetPassword,
} from "../../controllers/tutor/authController.js";

const tutorRouter = express.Router();

// Public routes
tutorRouter.post("/register", registerTutor);
tutorRouter.post("/login", loginTutor);
tutorRouter.post("/verify-otp", verifyOtp);
tutorRouter.post("/resend-otp", resendOtp);
tutorRouter.post("/google-auth", googleAuth);
tutorRouter.post("/forgot-password", forgotPassword);
tutorRouter.post("/reset-password/:token", resetPassword);

export default tutorRouter;