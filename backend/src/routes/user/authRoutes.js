import express from "express";
import {
    registerUser,
    loginUser,
    resendOtp,
    verifyOtp,
    googleAuth,
    forgotPassword,
    resetPassword,
} from "../../controllers/user/authController.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/resend-otp", resendOtp);
userRouter.post("/google-auth", googleAuth);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;