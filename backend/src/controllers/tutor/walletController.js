import Wallet from "../../models/finance/Wallet.js";
import PaymentDistribution from "../../models/finance/PaymentDistribution.js";

export const getTutorWallet = async (req, res) => {
    try {
        const tutorId = req.user._id;

        let wallet = await Wallet.findOne({ owner: tutorId });

        if (!wallet) {
            return res.status(200).json({
                success: true,
                data: {
                    totalEarnings: 0,
                    currentBalance: 0,
                    transactions: []
                }
            });
        }

        const distributions = await PaymentDistribution.find({ tutor: tutorId })
            .populate({
                path: "orderId",
                select: "createdAt razorpayPaymentId",
                populate: {
                    path: "user",
                    select: "fullName email profileImage phone"
                }
            })
            .sort({ createdAt: -1 });

        const transactions = distributions.map(dist => {
            if (!dist.orderId) return null; 

            
            const courseNames = dist.courses.map(c => c.courseTitle).join(", ");

            return {
                _id: dist._id,
                transactionId: dist.orderId.razorpayPaymentId || dist.orderId._id,
                date: dist.createdAt,
                
                // Student Details
                studentName: dist.orderId.user?.fullName || "Unknown",
                studentEmail: dist.orderId.user?.email || "N/A",
                studentProfileImage: dist.orderId.user?.profileImage,
                
                // Course & Amount
                courseName: courseNames,
                amount: dist.tutorShareAmount,
                
                status: "Credited",
                type: "Sale"
            };
        }).filter(Boolean);

        res.status(200).json({
            success: true,
            message: "Wallet details fetched successfully",
            data: {
                totalEarnings: wallet.totalEarnings,
                currentBalance: wallet.balance,
                transactions: transactions
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