import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    updateUserProfileImage,
    requestEmailChange,
    verifyEmailChangeOtp,
    resendEmailChangeOtp,
    requestPasswordChange,
    verifyPasswordChange,
    resendPasswordChangeOtp,
} from "../../controllers/user/profileController.js";

import { uploadSingleImage } from "../../middlewares/multerMiddleware.js";
import { isUser, verifyToken } from "../../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);


// Profile management
userRouter.get("/profile", getUserProfile);
userRouter.put("/profile", updateUserProfile);
userRouter.post("/profile/image", uploadSingleImage, updateUserProfileImage);

// Email change
userRouter.post("/request-email-change", requestEmailChange);
userRouter.post("/verify-email-change", verifyEmailChangeOtp);
userRouter.post("/resend-email-change-otp", resendEmailChangeOtp);

// Password change
userRouter.post("/request-password-change", requestPasswordChange);
userRouter.post("/verify-password-change", verifyPasswordChange)
userRouter.post("/resend-password-change-otp", resendPasswordChangeOtp);

export default userRouter;