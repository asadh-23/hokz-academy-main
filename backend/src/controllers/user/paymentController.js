import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
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
import Enrollment from "../../models/course/Enrollment.js";
import { sendNotification } from "../../utils/notificationSender.js";
import Admin from "../../models/user/Admin.js";

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
    let session;

    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses, isDirectPurchase, appliedCoupons } =
            req.body;
        const userId = req.user._id;
        const email = req.user.email;

        // 1. Signature Verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        // 2. Check Duplicate
        const existingOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id }).session(session);
        if (existingOrder) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({ success: true, message: "Order already processed", orderId: existingOrder._id });
        }

        // 3. Fetch Courses
        const dbCourses = await Course.find({ _id: { $in: courses } })
            .populate("tutor")
            .session(session);
        if (!dbCourses.length) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Courses not found" });
        }

        // 4. Calculate Totals
        let totalMrp = 0;
        let totalAmount = 0;
        const orderItems = [];
        const tutorRevenueMap = {};
        const tutorBaseSalesMap = {};

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
                tutorRevenueMap[tutorId] = { tutorId, courses: [], totalSales: 0 };
                tutorBaseSalesMap[tutorId] = 0;
            }

            tutorRevenueMap[tutorId].courses.push({
                courseId: course._id,
                courseTitle: course.title,
                price: discountedPrice,
            });

            tutorRevenueMap[tutorId].totalSales += discountedPrice;
            tutorBaseSalesMap[tutorId] += discountedPrice;
        }

        const totalCourseDiscount = totalMrp - totalAmount;

        // 5. Coupon Logic
        let totalCouponDiscount = 0;
        const validatedCoupons = [];
        const tutorTotalCouponMap = {};

        if (appliedCoupons && Object.keys(appliedCoupons).length > 0) {
            const usedCouponCodes = new Set();
            for (const [tutorId, tutorCouponsData] of Object.entries(appliedCoupons)) {
                if (!tutorRevenueMap[tutorId]) continue;
                const couponsArray = Array.isArray(tutorCouponsData) ? tutorCouponsData : [tutorCouponsData];

                for (const couponData of couponsArray) {
                    if (!couponData.code) continue;
                    const couponCode = couponData.code.toUpperCase();
                    if (usedCouponCodes.has(couponCode)) continue;

                    const coupon = await Coupon.findOne({ code: couponCode, tutor: tutorId, isActive: true }).session(
                        session,
                    );

                    if (coupon && coupon.isValid()) {
                        const userUsageCount = await CouponUsage.countDocuments({
                            coupon: coupon._id,
                            user: userId,
                        }).session(session);

                        if (userUsageCount < coupon.usagePerUser) {
                            const tutorSubtotal = tutorRevenueMap[tutorId].totalSales;
                            // Ensure calculateDiscount function exists in your Coupon Model Schema
                            const discountAmount = coupon.calculateDiscount ? coupon.calculateDiscount(tutorSubtotal) : 0;

                            totalCouponDiscount += discountAmount;
                            tutorRevenueMap[tutorId].totalSales -= discountAmount; // Reduce revenue share

                            if (!tutorTotalCouponMap[tutorId]) tutorTotalCouponMap[tutorId] = 0;
                            tutorTotalCouponMap[tutorId] += discountAmount;

                            validatedCoupons.push({ coupon, discountAmount, tutorId });
                            usedCouponCodes.add(couponCode);
                        }
                    }
                }
            }
        }

        // 6. Final Calculation
        const subtotalAfterCoupon = Math.max(0, totalAmount - totalCouponDiscount);
        const taxAmount = Math.round(subtotalAfterCoupon * 0.03);
        const finalCalculatedAmount = subtotalAfterCoupon + taxAmount;

        // 7. Save Order (Using create with array for transaction safety)
        const [newOrder] = await Order.create(
            [
                {
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
                },
            ],
            { session },
        );

        // 8. Bulk Save Coupon Usage
        if (validatedCoupons.length > 0) {
            const couponUsageDocs = validatedCoupons.map((vc) => ({
                coupon: vc.coupon._id,
                user: userId,
                order: newOrder._id,
                discountAmount: vc.discountAmount,
            }));
            await CouponUsage.insertMany(couponUsageDocs, { session });

            // Update Counts (Loop is fine here as it's usually small)
            for (const vc of validatedCoupons) {
                await Coupon.findByIdAndUpdate(vc.coupon._id, { $inc: { usedCount: 1 } }, { session });
            }
        }

        // 9. Create Enrollments (Bulk)
        const enrollmentDocs = dbCourses.map((course) => {
            const tutorId = course.tutor._id.toString();
            const originalPrice = course.price || 0;
            const offerPercentage = course.offerPercentage || 0;
            const priceAfterOffer = Math.round(originalPrice - (originalPrice * offerPercentage) / 100);

            let couponDeduction = 0;
            const totalTutorSales = tutorBaseSalesMap[tutorId] || 0;
            const totalTutorCoupon = tutorTotalCouponMap[tutorId] || 0;

            if (totalTutorSales > 0 && totalTutorCoupon > 0) {
                couponDeduction = (priceAfterOffer / totalTutorSales) * totalTutorCoupon;
            }

            const finalPricePaid = Math.max(0, Math.round(priceAfterOffer - couponDeduction));

            return {
                user: userId,
                course: course._id,
                tutor: course.tutor._id,
                orderId: newOrder._id,
                pricePaid: finalPricePaid,
                status: "active",
                enrolledAt: new Date(),
            };
        });

        await Enrollment.insertMany(enrollmentDocs, { session });

        // notify tutor
        try {
            const notificationPromises = dbCourses.map((course) => {
                return sendNotification({
                    recipientId: course.tutor._id,
                    senderId: userId,
                    type: "new_enrollment",
                    message: `Awesome! ${req.user?.fullName || "Someone"} just enrolled in "${course.title}". Check your Orders.`,
                    relatedId: course._id,
                });
            });
            await Promise.all(notificationPromises);
        } catch (notifError) {
            console.error("Failed to send enrollment notification to tutor:", notifError);
        }

        // 10. Update Progress (Loop is needed for upsert logic)
        for (const course of dbCourses) {
            await CourseProgress.findOneAndUpdate(
                { user: userId, course: course._id },
                { $setOnInsert: { completedLessons: [], isCompleted: false, completionPercentage: 0 } },
                { upsert: true, new: true, session: session },
            );
        }

        // 11. Update Course Counts
        await Course.updateMany({ _id: { $in: courses } }, { $inc: { enrolledCount: 1 } }, { session });

        let totalAdminCommission = 0;
        // 12. Distribute Revenue
        for (const data of Object.values(tutorRevenueMap)) {
            const adminCommissionRate = 10;
            const taxPercentage = 3;
            const realSalesAmount = data.totalSales;
            const adminShare = Math.round((realSalesAmount * adminCommissionRate) / 100);
            const taxAmount = Math.round((realSalesAmount * taxPercentage) / 100);
            const tutorShare = realSalesAmount - adminShare;

            totalAdminCommission += adminShare;
            const unlockDate = new Date(Date.now() + 2 * 60 * 1000);

            await PaymentDistribution.create(
                [
                    {
                        orderId: newOrder._id,
                        tutor: data.tutorId,
                        courses: data.courses,

                        totalAmount: realSalesAmount,

                        tutorShareAmount: tutorShare,

                        adminShareAmount: adminShare,
                        taxCollected: taxAmount,

                        adminCommissionRate: adminCommissionRate,
                        isReleasedToWallet: false,
                        unlockDate: unlockDate,
                    },
                ],
                { session },
            );

            // Atomic Wallet Update
            let wallet = await Wallet.findOne({ owner: data.tutorId }).session(session);
            if (!wallet) {
                const [newWallet] = await Wallet.create([{ owner: data.tutorId, ownerType: "Tutor" }], { session });
                wallet = newWallet;
            }

            await Wallet.findByIdAndUpdate(
                wallet._id,
                {
                    $inc: { pendingBalance: tutorShare, totalEarnings: tutorShare },
                },
                { session },
            );

            await WalletTransaction.create(
                [
                    {
                        walletId: wallet._id,
                        type: "credit",
                        category: "course_sale",
                        amount: tutorShare,
                        description: `Revenue from Order #${newOrder.razorpayOrderId}`,
                        orderId: newOrder._id,
                        status: "pending",
                        unlockDate: unlockDate,
                    },
                ],
                { session },
            );
        }

        if (totalAdminCommission > 0) {
          
            const admin = await Admin.findOne().session(session);

            if (admin) {
             
                let adminWallet = await Wallet.findOne({ owner: admin._id }).session(session);
                if (!adminWallet) {
                    const [newAdminWallet] = await Wallet.create([{ owner: admin._id, ownerType: "Admin" }], {
                        session,
                    });
                    adminWallet = newAdminWallet;
                }

              
                await Wallet.findByIdAndUpdate(
                    adminWallet._id,
                    { $inc: { balance: totalAdminCommission, totalEarnings: totalAdminCommission } },
                    { session },
                );

                // 4. Admin Wallet Transaction (Completed Status)
                await WalletTransaction.create(
                    [
                        {
                            walletId: adminWallet._id,
                            type: "credit",
                            category: "platform_fee",
                            amount: totalAdminCommission,
                            description: `Platform fee from Order #${newOrder.razorpayOrderId}`,
                            orderId: newOrder._id,
                            status: "completed",
                        },
                    ],
                    { session },
                );

                // 5. Admin-ന് Notification അയക്കുന്നു
                try {
                    await sendNotification({
                        recipientId: admin._id,
                        senderId: userId,
                        type: "wallet_credit",
                        message: `₹${totalAdminCommission} added to your wallet as platform fee from a new purchase by ${req.user?.fullName || "a student"}.`,
                        relatedId: newOrder._id,
                    });
                } catch (adminNotifError) {
                    console.error("Failed to send admin notification:", adminNotifError);
                }
            }
        }

        // 13. Clear Cart
        if (!isDirectPurchase) {
            await Cart.findOneAndDelete({ user: userId }).session(session);
        }

        // ✅ COMMIT
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order: newOrder,
        });
    } catch (error) {
        console.error("❌ Verification Failed:", error);
        // ✅ Safe Abort Logic
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        res.status(500).json({ message: "Payment Verification Failed", error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .populate({
                path: "items.course",
                select: "title thumbnailUrl category tutor",
                populate: [
                    {
                        path: "tutor",
                        select: "fullName",
                    },
                    {
                        path: "category",
                        select: "name",
                    },
                ],
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    } catch (error) {
        console.error("Get My Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};
