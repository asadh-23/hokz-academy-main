import mongoose from "mongoose";
import Course from "../../models/course/Course.js";
import Order from "../../models/finance/Order.js";
import User from "../../models/user/User.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";

export const getTutorOrders = async (req, res) => {
    try {
        if (!req.user || !req.user._id) return res.status(401).json({ message: "Unauthorized" });

        const tutorId = req.user._id.toString();
        const { page = 1, limit = 10, search = "", status } = req.query;

        const tutorCourses = await Course.find({ tutor: tutorId }).select("_id");
        const myCourseIds = tutorCourses.map((c) => c._id.toString());

        if (myCourseIds.length === 0) {
            return res.status(200).json({ success: true, data: [], stats: {}, pagination: {} });
        }

        let query = { "items.course": { $in: myCourseIds } };

        if (status && status !== "all") query.status = status;

        if (search) {
            const foundUsers = await User.find({
                $or: [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
            }).select("_id");

            const foundCourses = await Course.find({
                title: { $regex: search, $options: "i" },
                tutor: tutorId,
            }).select("_id");

            query.$or = [
                { razorpayOrderId: { $regex: search, $options: "i" } },
                { user: { $in: foundUsers.map((u) => u._id) } },
                { "items.course": { $in: foundCourses.map((c) => c._id) } },
            ];
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // 3. Parallel Fetching
        const [orders, totalOrdersCount, financialStats] = await Promise.all([
            // A. Fetch Orders List
            Order.find(query)
                .populate("user", "fullName email phone profileImage")
                .populate({
                    path: "items.course",
                    select: "title thumbnailUrl category price offerPercentage",
                    populate: { path: "category", select: "name" },
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            // B. Count
            Order.countDocuments(query),

            // C. Overall Stats (For Top Cards)
            PaymentDistribution.aggregate([
                { $match: { tutor: new mongoose.Types.ObjectId(tutorId) } },
                {
                    $group: {
                        _id: null,
                        totalGrossSales: { $sum: { $add: ["$totalAmount", { $ifNull: ["$taxCollected", 0] }] } },
                        totalNetEarnings: { $sum: "$tutorShareAmount" },
                        totalSuccessfulOrders: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const currentOrderIds = orders.map((o) => o._id);

        const payments = await PaymentDistribution.find({
            orderId: { $in: currentOrderIds },
            tutor: tutorId,
        }).lean();

        const paymentMap = {};
        payments.forEach((p) => {
            paymentMap[p.orderId.toString()] = p;
        });

        // ============================================================
        // 5. FORMATTING (USING DB VALUES)
        // ============================================================

        const formattedOrders = orders.map((order) => {
            // A. Get Real Financial Data from DB Map
            const paymentData = paymentMap[order._id.toString()];

            // If payment data exists (Paid Order), use it. Otherwise use 0 (Pending/Failed)
            const actualTutorShare = paymentData ? paymentData.tutorShareAmount : 0;
            const actualAdminShare = paymentData ? paymentData.adminShareAmount : 0;
            const actualTax = paymentData ? paymentData.taxCollected : 0;
            const totalOrderAmount = paymentData ? paymentData.totalAmount : 0;

            // B. Filter Items
            const tutorItems = order.items.filter(
                (item) => item.course && myCourseIds.includes(item.course._id.toString()),
            );

            const processedItems = tutorItems.map((item) => {
                return {
                    courseId: item.course._id,
                    title: item.course.title,
                    thumbnail: item.course.thumbnailUrl,
                    category: item.course.category?.name,
                    price: item.discountedPrice,
                };
            });

            return {
                _id: order._id,
                displayId: order.razorpayOrderId?.split("_")[1] || order._id.toString().slice(-6).toUpperCase(),
                date: order.createdAt,
                status: order.status,
                student: {
                    name: order.user?.fullName || "Unknown",
                    image: order.user?.profileImage,
                    email: order.user?.email,
                },
                items: processedItems,
                financials: {
                    totalOrderValue: totalOrderAmount + actualTax, // Gross
                    taxCollected: actualTax,
                    adminCommission: actualAdminShare,
                    myNetEarning: actualTutorShare, // This is the Single Source of Truth
                },
            };
        });

        const stats = financialStats[0] || { totalGrossSales: 0, totalNetEarnings: 0, totalSuccessfulOrders: 0 };

        res.status(200).json({
            success: true,
            message: "Tutor orders fetched successfully",
            data: {
                orders: formattedOrders,
                stats: {
                    totalGrossRevenue: stats.totalGrossSales || 0,
                    totalNetEarnings: stats.totalNetEarnings || 0,
                    totalPaidOrders: stats.totalSuccessfulOrders || 0,
                    currentListCount: totalOrdersCount || 0,
                },
                pagination: {
                    totalOrders: totalOrdersCount,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalOrdersCount / limitNumber) || 1,
                    limit: limitNumber,
                },
            },
        });
    } catch (error) {
        console.error("Get Tutor Orders Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const tutorId = req.user._id.toString();

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID" });
        }

        // 1. Fetch Order
        const order = await Order.findById(orderId)
            .populate("user", "fullName email phone profileImage isBlocked")
            .populate({
                path: "items.course",
                select: "title thumbnailUrl description category price offerPercentage tutor",
                populate: { path: "category", select: "name" },
            })
            .populate({
                path: "appliedCoupons.coupon",
                select: "code title discountType discountValue",
            })
            .lean();

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // 2. Filter My Items
        const myItems = order.items.filter(
            (item) => item.course && item.course.tutor && item.course.tutor.toString() === tutorId,
        );

        if (myItems.length === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // 3. Financial Data (Source of Truth)
        const paymentDist = await PaymentDistribution.findOne({
            orderId: order._id,
            tutor: tutorId,
        }).lean();

        // 4. Coupon Logic (Supports Multiple Coupons) 🔥
        const myCouponEntries = order.appliedCoupons?.filter((c) => c.tutorId && c.tutorId.toString() === tutorId) || [];
        const totalCouponDiscountAmount = myCouponEntries.reduce((sum, entry) => sum + entry.discountAmount, 0);

        const couponDetailsList = myCouponEntries
            .map((entry) => {
                if (!entry.coupon) return null;
                const { code, discountType, discountValue } = entry.coupon;
                const details = discountType === "percentage" ? `${discountValue}% off` : `Flat ₹${discountValue} off`;
                return { code, details, discountAmount: entry.discountAmount };
            })
            .filter(Boolean);

        // 5. CALCULATIONS

        // A. Base Amounts
        const netSalesAmount = paymentDist ? paymentDist.totalAmount : 0; // Amount AFTER All Coupons
        const itemTotal = netSalesAmount + totalCouponDiscountAmount; // subtotal price (Before Coupons)

        // B. Additions & Deductions
        const taxCollected = paymentDist ? paymentDist.taxCollected : 0;
        const adminFee = paymentDist ? paymentDist.adminShareAmount : 0;

        // C. Final Totals
        const totalPaidByStudent = netSalesAmount + taxCollected;
        const tutorNetEarnings = paymentDist ? paymentDist.tutorShareAmount : 0;

        // 6. Response Structure
        const responseData = {
            orderInfo: {
                _id: order._id,
                displayId: order.razorpayOrderId?.split("_")[1] || order._id.toString().slice(-6).toUpperCase(),
                date: order.createdAt,
                status: order.status,
                paymentMethod: "Online (Razorpay)",
                transactionId: order.razorpayPaymentId,
            },

            student: {
                _id: order.user?._id,
                name: order.user?.fullName || "Unknown Student",
                email: order.user?.email || order.email,
                phone: order.user?.phone || "N/A",
                image: order.user?.profileImage || null,
            },

            items: myItems.map((item) => ({
                courseId: item.course._id,
                title: item.course.title,
                thumbnail: item.course.thumbnailUrl,
                category: item.course.category?.name,
                originalPrice: item.price,
                soldPrice: item.discountedPrice,
            })),

            financials: {
                // --- STUDENT BREAKDOWN ---
                itemTotal: itemTotal,
                couponDeduction: totalCouponDiscountAmount, // Sum of all coupons
                taxableAmount: netSalesAmount,
                taxCollected: taxCollected,

                totalPaidByStudent: totalPaidByStudent,

                // --- TUTOR BREAKDOWN ---
                adminFee: adminFee,
                netEarnings: tutorNetEarnings,

                couponDetails:
                    couponDetailsList.length > 0
                        ? {
                              code: couponDetailsList.map((c) => c.code).join(", "), // "SUMMER20, WELCOME50"
                              title: couponDetailsList.length > 1 ? "Multiple Coupons" : "Coupon Applied",
                              details:
                                  couponDetailsList.length > 1
                                      ? `${couponDetailsList.length} coupons applied`
                                      : couponDetailsList[0].details,
                              list: couponDetailsList, // Full list sent if you want to loop in frontend
                          }
                        : null,
            },

            timeline: {
                orderedAt: order.createdAt,
                paymentVerifiedAt: paymentDist ? paymentDist.createdAt : null,
            },
        };

        res.status(200).json({
            success: true,
            data: responseData,
        });
    } catch (error) {
        console.error("Get Order Details Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch order details" });
    }
};
