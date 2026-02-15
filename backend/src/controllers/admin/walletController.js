import PaymentDistribution from "../../models/finance/PaymentDistribution.js";
import Order from "../../models/finance/Order.js";

export const getAdminWallet = async (req, res) => {
    try {
        const admin = req.user;
        
        const [statsData, recentTransactions, totalTxnCount] = await Promise.all([
            PaymentDistribution.aggregate([
                {
                    $group: {
                        _id: null,

                        totalRevenue: {
                            $sum: {
                                $add: ["$totalAmount", { $ifNull: ["$taxCollected", 0] }],
                            },
                        },

                        totalAdminProfit: { $sum: "$adminShareAmount" },

                        totalTaxCollected: { $sum: "$taxCollected" },

                      
                    },
                },
            ]),

            // B. Recent Transactions List
            PaymentDistribution.find()
                .populate({
                    path: "orderId",
                    select: "razorpayOrderId user createdAt",
                    populate: { path: "user", select: "fullName profileImage email" },
                })
                .populate({ path: "tutor", select: "fullName email" })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),

                Order.countDocuments({ status: "paid" })
        ]);

        const stats = statsData[0] || {
            totalRevenue: 0,
            totalAdminProfit: 0,
            totalTaxCollected: 0,
         
        };

        res.status(200).json({
            success: true,
            message: "Wallet data fetched successfully",
            data: {
                stats: {
                    totalRevenue: stats.totalRevenue, // Now represents Gross Income
                    totalAdminProfit: stats.totalAdminProfit,
                    totalTaxCollected: stats.totalTaxCollected,
                    totalTransactions: totalTxnCount,
                },
                transactions: recentTransactions,
            },
        });
    } catch (error) {
        console.error("Get Admin Wallet Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch wallet data",
            error: error.message,
        });
    }
};
