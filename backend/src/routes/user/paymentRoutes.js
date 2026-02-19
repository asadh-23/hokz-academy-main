import express from "express";
import { createOrder, applyCoupon, getTutorCoupons, verifyPayment, getMyOrders } from "../../controllers/user/paymentController.js";
import { verifyToken, isUser } from "../../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(verifyToken, isUser);

userRouter.get("/tutor-coupons/:tutorId", getTutorCoupons);
userRouter.post("/apply-coupon", applyCoupon);
userRouter.post("/create-order", createOrder);
userRouter.post("/verify-payment", verifyPayment);
userRouter.get("/orders/my-orders", getMyOrders);

export default userRouter;