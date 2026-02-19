import User from "../../models/user/User.js";
import Tutor from "../../models/user/Tutor.js";
import Course from "../../models/course/Course.js";
import Order from "../../models/finance/Order.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";

export const getAdminDashboardStats = async (req, res) => {
    try {
        // 1. Basic Stats
        const totalStudents = await User.countDocuments();
        const totalTutors = await Tutor.countDocuments();
        const totalCourses = await Course.countDocuments();

        // 2. Financial Stats (Total Lifetime)
        const financialStats = await PaymentDistribution.aggregate([
            {
                $group: {
                    _id: null,
                    totalSalesVolume: { $sum: "$totalAmount" }, // Gross Sales (Total money paid by students)
                    totalAdminProfit: { $sum: "$adminShareAmount" }, // Net Profit (Total admin commission)
                },
            },
        ]);

        const totalRevenue = financialStats[0]?.totalSalesVolume || 0;
        const adminProfit = financialStats[0]?.totalAdminProfit || 0;

        // 3. Graph Data (Last 6 Months)
        const graphStats = await PaymentDistribution.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    monthlyRevenue: { $sum: "$totalAmount" }, // Line 1: Gross Sales
                    monthlyProfit: { $sum: "$adminShareAmount" }, // Line 2: Admin Commission
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 6 },
        ]);

        // Process Graph Data
        const totalRevenueData = graphStats.map((d) => d.monthlyRevenue);
        const totalProfitData = graphStats.map((d) => d.monthlyProfit);
        // Optional: Create labels for X-axis
        const chartLabels = graphStats.map((d) => {
            const date = new Date(d._id.year, d._id.month - 1);
            return date.toLocaleString("default", { month: "short" });
        });

        // 4. Recent Transactions
        const recentOrders = await Order.find()
            .select("totalAmount createdAt status displayId")
            .populate("user", "fullName profileImage")
            .populate({
                path: "items.course",
                select: "title thumbnail",
            })
            .sort({ createdAt: -1 })
            .limit(5);

        // 5. Send Response
        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    totalTutors,
                    totalCourses,
                    totalRevenue,
                    adminProfit,
                },
                chart: {
                    revenue: totalRevenueData.length ? totalRevenueData : [0, 0, 0, 0, 0, 0],
                    expenses: totalProfitData.length ? totalProfitData : [0, 0, 0, 0, 0, 0],
                    labels: chartLabels.length ? chartLabels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                },
                recentOrders,
            },
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard data",
            error: error.message,
        });
    }
};

export const exportAdminOrders = async (req, res) => {
    try {
        // 1. Fetch ALL orders (No filters like tutorId)

        const orders = await Order.find({})
            .populate("user", "fullName email")
            .populate({
                path: "items.course",
                select: "title tutor",
                populate: { path: "tutor", select: "fullName" },
            })
            .sort({ createdAt: -1 })
            .lean();

        if (!orders || orders.length === 0) {
            return res.status(200).json({ success: true, orders: [] });
        }

        // 2. Fetch ALL payment distribution records
        const orderIds = orders.map((o) => o._id);
        const payments = await PaymentDistribution.find({
            orderId: { $in: orderIds },
        }).lean();

        const paymentMap = {};
        payments.forEach((p) => {
            paymentMap[p.orderId.toString()] = p;
        });

        // 3. Format the data for Admin Report
        const formattedOrders = orders.map((order) => {
            const paymentData = paymentMap[order._id.toString()];

            const courseTitles = order.items.map((item) => item.course?.title || "Unknown Course").join(", ");

            const tutorNames = order.items.map((item) => item.course?.tutor?.fullName || "N/A").join(", ");

            return {
                displayId: order.razorpayOrderId?.split("_")[1] || order._id.toString().slice(-6).toUpperCase(),
                date: order.createdAt,
                status: order.status,
                studentName: order.user?.fullName || "Unknown",
                studentEmail: order.user?.email || "N/A",
                courses: courseTitles,
                tutors: tutorNames,
                totalAmount: (paymentData?.totalAmount || 0) + (paymentData?.taxCollected || 0), // Gross Amount
                adminCommission: paymentData?.adminShareAmount || 0,
                tutorShare: paymentData?.tutorShareAmount || 0,
                tax: paymentData?.taxCollected || 0,
                paymentGateway: order.paymentMethod || "Razorpay",
            };
        });

        res.status(200).json({
            success: true,
            message: "Admin Export data fetched successfully",
            orders: formattedOrders,
        });
    } catch (error) {
        console.error("Admin Export Orders Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch admin export data" });
    }
};
