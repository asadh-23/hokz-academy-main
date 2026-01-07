import Coupon from "../../models/marketing/Coupon.js";
import CouponUsage from "../../models/marketing/CouponUsage.js";

export const createCoupon = async (req, res) => {
    try {
        const tutorId = req.user._id;

        const {
            code,
            title,
            description,
            discountType,
            discountValue,
            maxDiscountAmount,
            minPurchaseAmount,
            startDate,
            expiryDate,
            usageLimit,
            usagePerUser,
        } = req.body;

        if (!code || !title || !discountType || !discountValue || !startDate || !expiryDate) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(409).json({ message: "Coupon code already exists. Please choose another one." });
        }

        if (new Date(startDate) >= new Date(expiryDate)) {
            return res.status(400).json({ message: "Expiry date must be after the start date" });
        }

        if (discountType === "percentage" && discountValue > 100) {
            return res.status(400).json({ message: "Percentage discount cannot exceed 100%" });
        }

        const newCoupon = new Coupon({
            tutor: tutorId,
            code: code.toUpperCase(),
            title,
            description,
            discountType,
            discountValue,
            maxDiscountAmount: maxDiscountAmount || null,
            minPurchaseAmount: minPurchaseAmount || 0,
            startDate,
            expiryDate,
            usageLimit: usageLimit || null,
            usagePerUser: usagePerUser || 1,
            usedCount: 0,
            applicableCourses: [],
        });

        // 5. Save to DB
        await newCoupon.save();

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon: newCoupon,
        });
    } catch (error) {
        console.error("Create Coupon Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({ message: "Coupon code already exists" });
        }

        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTutorCoupons = async (req, res) => {
    try {
        const tutorId = req.user._id;

        // 1. Fetch Coupons
        const coupons = await Coupon.find({ tutor: tutorId }).sort({ createdAt: -1 });

        // 2. Send Response
        return res.status(200).json({
            success: true,
            message: "Coupons fetched successfully",
            coupons,
        });
    } catch (error) {
        console.error("Fetch Coupons Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch coupons",
        });
    }
};

export const getCouponStats = async (req, res) => {
    try {
        const tutorId = req.user._id;

        const totalCoupons = await Coupon.countDocuments({ tutor: tutorId });
        const activeCoupons = await Coupon.countDocuments({ tutor: tutorId, isActive: true });

        const usageStats = await CouponUsage.aggregate([
            {
                $lookup: {
                    from: "coupons",
                    localField: "coupon",
                    foreignField: "_id",
                    as: "coupon",
                },
            },
            { $unwind: "$coupon" },
            { $match: { "coupon.tutor": tutorId } },
            {
                $group: {
                    _id: null,
                    totalUsage: { $sum: 1 },
                    totalDiscountGiven: { $sum: "$discountAmount" },
                },
            },
        ]);

        const stats = {
            totalCoupons,
            activeCoupons,
            totalUsage: usageStats[0]?.totalUsage || 0,
            totalDiscount: usageStats[0]?.totalDiscountGiven || 0,
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};

export const toggleCouponStatus = async (req, res) => {
    try {
        const tutorId = req.user._id;
        const { couponId } = req.params;

        const coupon = await Coupon.findOne({ _id: couponId, tutor: tutorId });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
            coupon,
        });
    } catch (error) {
        console.error("Toggle Coupon Status Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const updates = req.body;
        const tutorId = req.user._id;

        const coupon = await Coupon.findOne({ _id: couponId, tutor: tutorId });

        if (!coupon) {
            return res.status(404).json({
                message: "Coupon not found or you don't have permission to edit it",
            });
        }

        const newStartDate = updates.startDate ? new Date(updates.startDate) : coupon.startDate;
        const newExpiryDate = updates.expiryDate ? new Date(updates.expiryDate) : coupon.expiryDate;

        if (newStartDate >= newExpiryDate) {
            return res.status(400).json({
                message: "Expiry date must be after start date",
            });
        }

        Object.keys(updates).forEach((key) => {
            if (key !== "_id" && key !== "tutor") {
                coupon[key] = updates[key];
            }
        });

        const updatedCoupon = await coupon.save();

        return res.status(200).json({
            success: true,
            coupon: updatedCoupon,
        });
    } catch (error) {
        console.error("Error updating coupon:", error);

        if (error.code === 11000) {
            return res.status(400).json({ message: "Coupon code already exists!" });
        }

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ message: messages.join(", ") });
        }

        res.status(500).json({ message: "Server error while updating coupon" });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;

        const tutorId = req.user?._id;

        const deletedCoupon = await Coupon.findOneAndDelete({
            _id: couponId,
            tutor: tutorId,
        });

        if (!deletedCoupon) {
            return res.status(404).json({
                message: "Coupon not found or you don't have permission to delete it",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(500).json({ message: "Server error while deleting coupon" });
    }
};
