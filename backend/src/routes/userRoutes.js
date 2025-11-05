import express from "express";
import {
    registerUser,
    verifyOtp,
    loginUser,
    resendOtp,
    googleAuth,
    forgotPassword,
    resetPassword,
    updateUserProfileImage,
    getUserProfile,
    updateUserProfile,
    requestEmailChange,
    verifyEmailChangeOtp,
    resendEmailChangeOtp,
    requestPasswordChange,
    verifyPasswordChange,
    resendPasswordChangeOtp
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadSingleImage } from "../middlewares/multerMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/login", loginUser);
userRouter.post("/resend-otp", resendOtp);
userRouter.post("/google-auth", googleAuth);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

userRouter.use(verifyToken);

userRouter.post("/profile/image", uploadSingleImage, updateUserProfileImage);
userRouter.get("/profile", getUserProfile);
userRouter.put("/profile", updateUserProfile);
userRouter.post("/request-email-change", requestEmailChange);
userRouter.post("/verify-email-change", verifyEmailChangeOtp);
userRouter.post("/resend-email-change-otp",resendEmailChangeOtp);
userRouter.post("/request-password-change", requestPasswordChange);
userRouter.post("/verify-password-change", verifyPasswordChange);
userRouter.post("/resend-password-change-otp",resendPasswordChangeOtp);


export default userRouter;
