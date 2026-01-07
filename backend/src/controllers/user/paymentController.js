import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

// Models
import Course from "../../models/course/Course.js";
import Cart from "../../models/cart/Cart.js";
import Order from "../../models/finance/Order.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";
import CourseProgress from "../../models/course/CourseProgress.js";
import Wallet from "../../models/finance/Wallet.js";
import WalletTransaction from "../../models/finance/WalletTransaction.js";
import Coupon from "../../models/marketing/Coupon.js";
import CouponUsage from "../../models/marketing/CouponUsage.js";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
export const getTutorCoupons = async (req, res) => {
    try {
        const { tutorId } = req.params;
        const currentDate = new Date();

        const coupons = await Coupon.find({
            tutor: tutorId,
            isActive: true,

            expiryDate: { $gte: currentDate },

            startDate: { $lte: currentDate },

            $or: [{ usageLimit: null }, { $expr: { $lt: ["$usedCount", "$usageLimit"] } }],
        }).select("code title description discountType discountValue maxDiscountAmount minPurchaseAmount expiryDate");

        res.status(200).json({
            success: true,
            coupons,
        });
    } catch (error) {
        console.error("Get Tutor Coupons Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// 1. CREATE ORDER (Initiate Payment)
// ==========================================

export const applyCoupon = async (req, res) => {
    try {
        const { couponCode, totalAmount, tutorId } = req.body;

        if (!couponCode || !totalAmount || !tutorId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (Code, Amount or TutorID)",
            });
        }

        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            tutor: tutorId,
            isActive: true,
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid or inactive coupon code",
            });
        }

        const currentDate = new Date();
        const expiryDate = new Date(coupon.expiryDate);

        if (currentDate > expiryDate) {
            return res.status(400).json({
                success: false,
                message: "This coupon has expired",
            });
        }

        if (totalAmount < coupon.minPurchaseAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase of ₹${coupon.minPurchaseAmount} required`,
            });
        }

        let discountAmount = 0;

        if (coupon.discountType === "percentage") {
            discountAmount = (totalAmount * coupon.discountValue) / 100;

            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
            }
        } else {
            // Fixed Amount Logic
            discountAmount = coupon.discountValue;
        }

        if (discountAmount > totalAmount) {
            discountAmount = totalAmount;
        }

        discountAmount = Math.round(discountAmount);

        return res.status(200).json({
            success: true,
            message: "Coupon Applied Successfully! 🎉",
            discountAmount: discountAmount,
            coupon: coupon,
        });
    } catch (error) {
        console.error("Apply Coupon Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while applying coupon",
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { courses, isDirectPurchase, appliedCoupons } = req.body;
        const userId = req.user._id;

        if (!courses || courses.length === 0) {
            return res.status(400).json({ message: "No courses selected" });
        }

        const dbCourses = await Course.find({ _id: { $in: courses } }).populate("tutor");

        if (dbCourses.length !== courses.length) {
            return res.status(400).json({ message: "Some courses are invalid or no longer exist" });
        }

        const tutorGroups = {};
        let totalAmount = 0;

        for (const course of dbCourses) {
            const price = course.price || 0;
            const discount = course.offerPercentage || 0;
            const discountedPrice = Math.round(price - (price * discount) / 100);
            totalAmount += discountedPrice;

            const tutorId = course.tutor._id.toString();
            if (!tutorGroups[tutorId]) {
                tutorGroups[tutorId] = {
                    tutorId: tutorId,
                    courses: [],
                    subtotal: 0,
                };
            }
            tutorGroups[tutorId].courses.push(course);
            tutorGroups[tutorId].subtotal += discountedPrice;
        }

        let totalCouponDiscount = 0;
        const validatedCoupons = {};

        if (appliedCoupons && Object.keys(appliedCoupons).length > 0) {
            const usedCouponCodes = new Set();

            for (const [tutorId, tutorCouponsData] of Object.entries(appliedCoupons)) {
                if (!tutorGroups[tutorId]) continue;

                const couponsArray = Array.isArray(tutorCouponsData) ? tutorCouponsData : [tutorCouponsData];

                for (const couponData of couponsArray) {
                    const couponCode = couponData.code.toUpperCase();

                    if (usedCouponCodes.has(couponCode)) {
                        continue;
                    }

                    const coupon = await Coupon.findOne({
                        code: couponCode,
                        tutor: tutorId,
                        isActive: true,
                    });

                    if (coupon && coupon.isValid()) {
                        const tutorSubtotal = tutorGroups[tutorId].subtotal;

                        if (tutorSubtotal >= coupon.minPurchaseAmount) {
                            const userUsageCount = await CouponUsage.countDocuments({
                                coupon: coupon._id,
                                user: userId,
                            });

                            if (userUsageCount < coupon.usagePerUser) {
                                const discountAmount = coupon.calculateDiscount(tutorSubtotal);
                                totalCouponDiscount += discountAmount;

                                if (!validatedCoupons[tutorId]) {
                                    validatedCoupons[tutorId] = [];
                                }
                                validatedCoupons[tutorId].push({
                                    coupon: coupon,
                                    discountAmount: discountAmount,
                                });

                                usedCouponCodes.add(couponCode);
                            }
                        }
                    }
                }
            }
        }

        const subtotalAfterCoupon = Math.max(0, totalAmount - totalCouponDiscount);
        const taxAmount = Math.round(subtotalAfterCoupon * 0.03);
        const finalAmount = subtotalAfterCoupon + taxAmount;

        if (finalAmount < 1) {
            return res.status(400).json({ message: "Order amount is too low for online payment" });
        }

        const formattedCoupons = {};
        const couponCodesList = [];

        Object.keys(validatedCoupons).forEach((tutorId) => {
            formattedCoupons[tutorId] = validatedCoupons[tutorId].map((item) => {
                couponCodesList.push(item.coupon.code);
                return {
                    code: item.coupon.code,
                    discountAmount: item.discountAmount,
                };
            });
        });

        const options = {
            amount: Math.round(finalAmount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userId.toString(),
                userName: req.user.fullName,
                purchaseType: isDirectPurchase ? "direct_purchase" : "cart_checkout",
                appliedCoupons: couponCodesList.join(", ").substring(0, 250),
            },
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            validatedCoupons: formattedCoupons,
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Failed to create payment order" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses, isDirectPurchase, appliedCoupons } =
            req.body;

        const userId = req.user._id;
        const email = req.user.email;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const existingOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already processed",
                orderId: existingOrder._id,
            });
        }

        const dbCourses = await Course.find({ _id: { $in: courses } }).populate("tutor");

        if (dbCourses.length === 0) {
            return res.status(400).json({ success: false, message: "Courses not found" });
        }

        let totalMrp = 0;
        let totalAmount = 0;
        const orderItems = [];
        const tutorRevenueMap = {};

        for (const course of dbCourses) {
            const price = course.price || 0;
            const discount = course.offerPercentage || 0;
            const discountedPrice = Math.round(price - (price * discount) / 100);

            totalMrp += price;
            totalAmount += discountedPrice;

            orderItems.push({
                course: course._id,
                price: price,
                discountedPrice: discountedPrice,
            });

            const tutorId = course.tutor._id.toString();
            if (!tutorRevenueMap[tutorId]) {
                tutorRevenueMap[tutorId] = {
                    tutorId: tutorId,
                    courses: [],
                    totalSales: 0,
                };
            }

            tutorRevenueMap[tutorId].courses.push({
                courseId: course._id,
                courseTitle: course.title,
                price: discountedPrice,
            });

            tutorRevenueMap[tutorId].totalSales += discountedPrice;
        }

        const totalCourseDiscount = totalMrp - totalAmount;

        let totalCouponDiscount = 0;
        const validatedCoupons = [];

        if (appliedCoupons && Object.keys(appliedCoupons).length > 0) {
            const usedCouponCodes = new Set();

            for (const [tutorId, tutorCouponsData] of Object.entries(appliedCoupons)) {
                if (!tutorRevenueMap[tutorId]) continue;

                const couponsArray = Array.isArray(tutorCouponsData) ? tutorCouponsData : [tutorCouponsData];

                for (const couponData of couponsArray) {
                    const couponCode = couponData.code.toUpperCase();
                    if (usedCouponCodes.has(couponCode)) continue;

                    const coupon = await Coupon.findOne({
                        code: couponCode,
                        tutor: tutorId,
                        isActive: true,
                    });

                    if (coupon && coupon.isValid()) {
                        const userUsageCount = await CouponUsage.countDocuments({
                            coupon: coupon._id,
                            user: userId,
                        });

                        if (userUsageCount < coupon.usagePerUser) {
                            const tutorSubtotal = tutorRevenueMap[tutorId].totalSales;
                            const discountAmount = coupon.calculateDiscount(tutorSubtotal);

                            totalCouponDiscount += discountAmount;
                            tutorRevenueMap[tutorId].totalSales -= discountAmount;

                            validatedCoupons.push({
                                coupon: coupon,
                                discountAmount: discountAmount,
                                tutorId: tutorId,
                            });

                            usedCouponCodes.add(couponCode);
                        }
                    }
                }
            }
        }

        const subtotalAfterCoupon = Math.max(0, totalAmount - totalCouponDiscount);
        const taxAmount = Math.round(subtotalAfterCoupon * 0.03);
        const finalCalculatedAmount = subtotalAfterCoupon + taxAmount;

        const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
        const amountPaidInPaise = rzpOrder.amount_paid;
        const calculatedAmountInPaise = finalCalculatedAmount * 100;

        if (Math.abs(amountPaidInPaise - calculatedAmountInPaise) > 100) {
            return res.status(400).json({
                success: false,
                message: "Payment amount mismatch. Please contact support.",
            });
        }

        const newOrder = new Order({
            user: userId,
            email: email,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            items: orderItems,
            totalAmount: totalAmount,
            discountAmount: totalCourseDiscount + totalCouponDiscount,
            couponDiscount: totalCouponDiscount,
            appliedCoupons: validatedCoupons.map((vc) => ({
                coupon: vc.coupon._id,
                tutorId: vc.tutorId,
                discountAmount: vc.discountAmount,
            })),
            taxAmount: taxAmount,
            finalAmount: finalCalculatedAmount,
            status: "paid",
            paymentMethod: "razorpay",
        });

        await newOrder.save();

        const couponUsagePromises = validatedCoupons.map(async (vc) => {
            await new CouponUsage({
                coupon: vc.coupon._id,
                user: userId,
                order: newOrder._id,
                discountAmount: vc.discountAmount,
            }).save();

            await Coupon.findByIdAndUpdate(vc.coupon._id, {
                $inc: { usedCount: 1 },
            });
        });
        await Promise.all(couponUsagePromises);

        const revenuePromises = Object.values(tutorRevenueMap).map(async (data) => {
            const adminCommissionRate = 10;
            const adminShare = Math.round((data.totalSales * adminCommissionRate) / 100);
            const tutorShare = data.totalSales - adminShare;

            await new PaymentDistribution({
                orderId: newOrder._id,
                tutor: data.tutorId,
                courses: data.courses,
                totalAmount: data.totalSales,
                adminShareAmount: adminShare,
                tutorShareAmount: tutorShare,
                adminCommissionRate: adminCommissionRate,
                isReleasedToWallet: true,
            }).save();

            let wallet = await Wallet.findOne({ owner: data.tutorId });
            if (!wallet) {
                wallet = await Wallet.create({ owner: data.tutorId, ownerType: "Tutor" });
            }

            await Wallet.findByIdAndUpdate(wallet._id, {
                $inc: {
                    balance: tutorShare,
                    totalEarnings: tutorShare,
                },
            });

            await WalletTransaction.create({
                walletId: wallet._id,
                type: "credit",
                category: "course_sale",
                amount: tutorShare,
                description: `Revenue from Order #${newOrder.razorpayOrderId}`,
                orderId: newOrder._id,
                status: "completed",
            });
        });
        await Promise.all(revenuePromises);

        const enrollmentPromises = dbCourses.map((course) => {
            return CourseProgress.findOneAndUpdate(
                { user: userId, course: course._id },
                {
                    $setOnInsert: {
                        completedLessons: [],
                        isCompleted: false,
                        completedAt: null,
                        completionPercentage: 0,
                    },
                },
                { upsert: true, new: true }
            );
        });
        await Promise.all(enrollmentPromises);

        const updateCourseCounts = dbCourses.map((course) => {
            return Course.findByIdAndUpdate(course._id, {
                $inc: { enrolledCount: 1 },
            });
        });
        await Promise.all(updateCourseCounts);

        if (!isDirectPurchase) {
            await Cart.findOneAndDelete({ user: userId });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified and Order placed successfully",
            order: newOrder,
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
