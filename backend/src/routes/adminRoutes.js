import express from "express";
import {
    loginAdmin,
    getAdminProfile,
    updateAdminProfileImage,
    requestPasswordChange,
    verifyPasswordChange,
    resendPasswordChangeOtp,
} from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadSingleImage } from "../middlewares/multerMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);

adminRouter.use(verifyToken);

adminRouter.get("/profile", getAdminProfile);
adminRouter.post("/profile/image", uploadSingleImage, updateAdminProfileImage);
adminRouter.post("/request-password-change", requestPasswordChange);
adminRouter.post("/verify-password-change", verifyPasswordChange);
adminRouter.post("/resend-password-change-otp", resendPasswordChangeOtp);

export default adminRouter;
