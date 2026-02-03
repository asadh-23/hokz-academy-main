import Order from "../../models/finance/Order.js";
import User from "../../models/user/User.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";
import mongoose from "mongoose";
import Enrollment from "../../models/course/Enrollment.js";

export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", status } = req.query;

        // 1. Build Query
        let query = {};
        if (status && status !== "all") {
            query.status = status;
        }

        // Search Logic
        if (search) {
            const matchingUsers = await User.find({
                $or: [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
            }).select("_id");

            const matchingUserIds = matchingUsers.map((user) => user._id);

            query.$or = [{ razorpayOrderId: { $regex: search, $options: "i" } }, { user: { $in: matchingUserIds } }];
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // 2. Execute Queries in Parallel (List + Count + Stats)
        const [orders, totalOrders, statsData] = await Promise.all([
            // A. Fetch Paginated List
            Order.find(query)
                .populate("user", "fullName email profileImage phone")
                .populate({
                    path: "items.course",
                    select: "title thumbnailUrl tutor",
                    populate: { path: "tutor", select: "fullName profileImage" },
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            // B. Get Total Count (For Pagination)
            Order.countDocuments(query),

            // C. Get Aggregated Stats (Revenue, Tax, Course Count) ✅
            Order.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$finalAmount" },
                        totalTax: { $sum: "$taxAmount" }, // Total Tax
                        totalCoursesSold: { $sum: { $size: "$items" } }, // Count items in array
                    },
                },
            ]),
        ]);

        // 3. Format Orders List
        const formattedOrders = orders.map((order) => {
            const orderObj = order.toObject();
            const adminCommissionRate = 10;
            const baseAmount = order.finalAmount - (order.taxAmount || 0);
            const estimatedAdminProfit = Math.round((baseAmount * adminCommissionRate) / 100);

            return {
                ...orderObj,
                adminProfit: estimatedAdminProfit,
            };
        });

        // 4. Process Stats Data
        const statsResult = statsData[0] || {
            totalRevenue: 0,
            totalTax: 0,
            totalCoursesSold: 0,
        };

        res.status(200).json({
            success: true,
            message: "Orders and stats fetched successfully",
            data: {
                orders: formattedOrders,
                pagination: {
                    totalOrders,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalOrders / limitNumber),
                    limit: limitNumber,
                },
                // 👇 This is for the Stats Bar
                stats: {
                    totalRevenue: statsResult.totalRevenue,
                    totalTaxCollected: statsResult.totalTax,
                    totalCoursesSold: statsResult.totalCoursesSold,
                    totalOrders: totalOrders,
                },
            },
        });
    } catch (error) {
        console.error("Get All Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID" });
        }

        // 1. Fetch All Data Parallelly
        const [order, paymentDistributions, enrollments] = await Promise.all([
            Order.findById(orderId)
                .populate("user", "fullName email profileImage phone isBlocked")
                .populate({
                    path: "items.course",
                    select: "title description thumbnailUrl price category duration offerPercentage lessonsCount tutor",
                    populate: [
                        { path: "tutor", select: "fullName email profileImage phone" },
                        { path: "category", select: "name" },
                    ],
                })
                .lean(), // Coupon populate removed as per request

            PaymentDistribution.find({ orderId: orderId })
                .select("tutor tutorShareAmount adminShareAmount totalAmount courses taxCollected")
                .populate("tutor", "fullName email profileImage phone"),

            Enrollment.find({ orderId: orderId }).select("course pricePaid"),
        ]);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // 2. Create Price Map (To get accurate Price Paid per item)
        const priceMap = {};
        enrollments.forEach((enroll) => {
            priceMap[enroll.course.toString()] = enroll.pricePaid;
        });

        // 3. Financial Breakdown for Admin
        const financialBreakdown = paymentDistributions.map((dist) => ({
            tutorName: dist.tutor?.fullName || "Unknown Tutor",
            tutorEmail: dist.tutor?.email,
            tutorProfile: dist.tutor?.profileImage,
            salesAmount: dist.totalAmount,
            adminCommission: dist.adminShareAmount,
            tutorEarnings: dist.tutorShareAmount,
        }));

        const totalAdminProfit = financialBreakdown.reduce((sum, item) => sum + item.adminCommission, 0);

        // 4. Construct Final Response
        res.status(200).json({
            success: true,
            data: {
                order: {
                    _id: order._id,
                    orderId: order.razorpayOrderId,
                    transactionId: order.razorpayPaymentId,
                    status: order.status,
                    createdAt: order.createdAt,
                    paymentMethod: order.paymentMethod,
                    
                    // Totals
                    totalAmount: order.totalAmount,      // MRP Total
                    discountAmount: order.discountAmount, // Total Discount (Offer + Coupon)
                    couponDiscount: order.couponDiscount, // 🔥 Total Coupon Discount (Only this is needed)
                    taxAmount: order.taxAmount,
                    finalAmount: order.finalAmount,
                },
                customer: order.user,
                items: order.items.map((item) => {
                    const courseId = item.course?._id.toString();
                    const mrp = item.price;
                    const offerPerc = item.course?.offerPercentage || 0;
                    const offerPrice = Math.round(mrp - (mrp * offerPerc) / 100);
                    
                    // Actual Paid from Enrollment
                    const actualPricePaid = priceMap[courseId] !== undefined ? priceMap[courseId] : offerPrice;

                    return {
                        courseId: item.course?._id,
                        title: item.course?.title,
                        thumbnail: item.course?.thumbnailUrl,
                        
                        originalPrice: item.price, 
                        offerPrice: offerPrice,       // Price after Course Offer
                        pricePaid: actualPricePaid,   // Final Paid (After Coupon split)
                        
                        tutor: item.course?.tutor,
                    };
                }),
                financials: {
                    breakdown: financialBreakdown,
                    totalAdminProfit: totalAdminProfit,
                },
            },
        });
    } catch (error) {
        console.error("Get Order Details Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch order details" });
    }
};