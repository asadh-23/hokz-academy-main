import Order from "../../models/finance/Order.js";
import Course from "../../models/course/Course.js";

export const getTutorOrders = async (req, res) => {
    try {
        const tutorId = req.user._id.toString(); // String conversion for safe comparison

        const tutorCourses = await Course.find({ tutor: tutorId }).select("_id");
        const courseIds = tutorCourses.map(course => course._id.toString());

        const orders = await Order.find({
            "items.course": { $in: courseIds }
        })
        .populate("user", "fullName email phone profileImage createdAt")
        .populate({
            path: "items.course",
            select: "title description price thumbnailUrl offerPercentage createdAt lessonsCount category",
            populate: {
                path: "category",
                select: "name"
            }
        })
        .sort({ createdAt: -1 });

        const formattedOrders = [];

        orders.forEach(order => {
            // 1. Calculate Tutor's Totals for this Order (For Pro-rata Logic)
            let totalTutorSalesInOrder = 0;
            const tutorItems = [];

            order.items.forEach(item => {
                if (item.course && courseIds.includes(item.course._id.toString())) {
                    totalTutorSalesInOrder += (item.discountedPrice || 0);
                    tutorItems.push(item);
                }
            });

            // 2. Find Coupon Discount Applied for this Tutor
            let tutorCouponDiscount = 0;
            if (order.appliedCoupons && order.appliedCoupons.length > 0) {
                const appliedData = order.appliedCoupons.find(c => c.tutorId && c.tutorId.toString() === tutorId);
                if (appliedData) {
                    tutorCouponDiscount = appliedData.discountAmount || 0;
                }
            }

            // 3. Process Each Item
            tutorItems.forEach(item => {
                const mrpPrice = item.course.price || 0;
                const baseSellingPrice = item.discountedPrice || 0; // Price before coupon

                // --- A. Calculate Item's Share of Coupon ---
                let itemCouponDeduction = 0;
                if (totalTutorSalesInOrder > 0 && tutorCouponDiscount > 0) {
                    itemCouponDeduction = (baseSellingPrice / totalTutorSalesInOrder) * tutorCouponDiscount;
                }

                // --- B. Sold Price (After Coupon) ---
                const realSoldPrice = baseSellingPrice - itemCouponDeduction;

                // --- C. Platform Fee (10% on Real Sold Price) ---
                const platformFeePercentage = 10;
                const platformFee = Math.round((realSoldPrice * platformFeePercentage) / 100);

                // --- D. Tax (3% on Real Sold Price - Extra Collected) ---
                const taxPercentage = 3;
                const taxAmount = Math.round((realSoldPrice * taxPercentage) / 100);

                // --- E. Tutor Net Earning ---
                const tutorEarning = Math.round(realSoldPrice - platformFee);

                // --- F. Total Discount Calculation (MRP - Real Price) ---
                const totalDiscount = mrpPrice - realSoldPrice;

                // --- Data Object Construction ---
                formattedOrders.push({
                    orderId: order._id,
                    displayId: order.razorpayOrderId || order._id.toString().slice(-6).toUpperCase(),
                    status: order.status,
                    paymentMethod: order.paymentMethod || "Razorpay/Online",
                    orderDate: order.createdAt,
                    completionDate: order.updatedAt,
                    
                    student: {
                        id: order.user._id,
                        name: order.user.fullName,
                        email: order.user.email,
                        phone: order.user.phone || "N/A",
                        profileImage: order.user.profileImage,
                        registeredAt: order.user.createdAt
                    },

                    course: {
                        id: item.course._id,
                        title: item.course.title,
                        description: item.course.description,
                        thumbnail: item.course.thumbnailUrl,
                        category: item.course.category ? item.course.category.name : "Uncategorized",
                        lessonsCount: item.course.lessonsCount,
                        createdAt: item.course.createdAt,
                        mrpPrice: mrpPrice,
                        offerPercentage: item.course.offerPercentage || 0
                    },

                    payment: {
                        mrp: mrpPrice,
                        soldPrice: Math.round(realSoldPrice),
                        basePrice: baseSellingPrice,
                        totalDiscount: Math.round(totalDiscount),
                        couponDiscount: Math.round(itemCouponDeduction),
                        
                        platformFee: platformFee,
                        tax: taxAmount,
                        tutorEarning: tutorEarning
                    }
                });
            });
        });

        res.status(200).json({
            success: true,
            message: "Detailed tutor orders fetched",
            data: formattedOrders
        });

    } catch (error) {
        console.error("Get Detailed Orders Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};