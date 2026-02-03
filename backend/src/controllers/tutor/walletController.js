import mongoose from "mongoose";
import Wallet from "../../models/finance/Wallet.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";

export const getTutorWallet = async (req, res) => {
    try {
        const tutorId = req.user._id;

        const [wallet, statsData, recentTransactions] = await Promise.all([
            Wallet.findOne({ owner: tutorId }),

            PaymentDistribution.aggregate([
                { $match: { tutor: new mongoose.Types.ObjectId(tutorId) } },
                {
                    $group: {
                        _id: null,
                        totalPlatformSales: {
                            $sum: {
                                $add: [
                                    "$totalAmount",
                                    { $ifNull: ["$taxCollected", 0] }
                                ]
                            }
                        },
                        totalTutorEarnings: { $sum: "$tutorShareAmount" },
                        totalTransactionsCount: { $sum: 1 }
                    }
                }
            ]),

            PaymentDistribution.find({ tutor: tutorId })
                .populate({
                    path: "orderId",
                    select: "createdAt razorpayPaymentId",
                    populate: {
                        path: "user",
                        select: "fullName email profileImage"
                    }
                })
                .populate({
                    path: "courses.courseId",
                    select: "thumbnailUrl"
                })
                .sort({ createdAt: -1 })
                .limit(20)
        ]);

        const formattedTransactions = recentTransactions
            .map(dist => {
                if (!dist.orderId) return null;

                const purchasedCourses = dist.courses.map(c => ({
                    title: c.courseTitle,
                    thumbnail:
                        c.courseId?.thumbnailUrl ||
                        "https://via.placeholder.com/150"
                }));

                return {
                    _id: dist._id,
                    transactionId:
                        dist.orderId.razorpayPaymentId || dist.orderId._id,
                    date: dist.createdAt,
                    student: {
                        name: dist.orderId.user?.fullName || "Unknown",
                        image: dist.orderId.user?.profileImage,
                        email: dist.orderId.user?.email
                    },
                    items: purchasedCourses,
                    amount: dist.tutorShareAmount,
                    type: "credit",
                    status: "success"
                };
            })
            .filter(Boolean);

        const stats = statsData[0] || {
            totalPlatformSales: 0,
            totalTutorEarnings: 0,
            totalTransactionsCount: 0
        };

        const currentBalance = wallet ? wallet.balance : 0;

        res.status(200).json({
            success: true,
            message: "Wallet details fetched successfully",
            data: {
                stats: {
                    currentBalance: currentBalance,
                    totalPlatformSales: stats.totalPlatformSales,
                    totalTransactions: stats.totalTransactionsCount,
                    totalEarnings: stats.totalTutorEarnings
                },
                transactions: formattedTransactions
            }
        });
    } catch (error) {
        console.error("Get Tutor Wallet Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch wallet details",
            error: error.message
        });
    }
};
