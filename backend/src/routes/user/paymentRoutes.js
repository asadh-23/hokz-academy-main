import express from "express";
import { createOrder, applyCoupon, getTutorCoupons, verifyPayment } from "../../controllers/user/paymentController.js";
import { verifyToken, isUser } from "../../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/payment/tutor-coupons/:tutorId", getTutorCoupons);
userRouter.post("/payment/apply-coupon", applyCoupon);
userRouter.post("/payment/create-order", createOrder);
userRouter.post("/payment/verify-payment", verifyPayment);

export default userRouter;