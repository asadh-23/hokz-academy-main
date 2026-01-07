import express from "express";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import { createCoupon, getTutorCoupons, getCouponStats, toggleCouponStatus, updateCoupon, deleteCoupon } from "../../controllers/tutor/couponController.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.post("/coupon",createCoupon);
tutorRouter.get("/coupons", getTutorCoupons)
tutorRouter.get("/coupons/stats", getCouponStats);
tutorRouter.patch("/coupons/:couponId/toggle", toggleCouponStatus);
tutorRouter.put("/coupons/:couponId", updateCoupon);
tutorRouter.delete("/coupons/:couponId", deleteCoupon);

export default tutorRouter;