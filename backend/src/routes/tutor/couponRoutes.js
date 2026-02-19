import express from "express";
import { isTutor, verifyToken } from "../../middlewares/authMiddleware.js";
import { createCoupon, getTutorCoupons, getCouponStats, toggleCouponStatus, updateCoupon, deleteCoupon } from "../../controllers/tutor/couponController.js";

const tutorRouter = express.Router();

tutorRouter.use(verifyToken, isTutor);

tutorRouter.post("/coupon",createCoupon);
tutorRouter.get("/", getTutorCoupons);
tutorRouter.get("/stats", getCouponStats);
tutorRouter.patch("/:couponId/toggle", toggleCouponStatus);
tutorRouter.put("/:couponId", updateCoupon);
tutorRouter.delete("/:couponId", deleteCoupon);

export default tutorRouter;