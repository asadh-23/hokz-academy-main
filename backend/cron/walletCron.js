import cron from "node-cron";
import WalletTransaction from "../src/models/finance/WalletTransaction.js";
import Wallet from "../src/models/finance/Wallet.js";
import PaymentDistribution from "../src/models/finance/PaymentDistribution.js";
import { sendNotification } from "../src/utils/notificationSender.js";

const releasePendingFunds = async () => {
    try {
        const now = new Date();

        const pendingTransactions = await WalletTransaction.find({
            status: "pending",
            unlockDate: { $lte: now },
        })
            .populate("walletId")
            .populate({
                path: "orderId",
                select: "razorpayOrderId user",
                populate: {
                    path: "user",
                    select: "fullName",
                },
            });

        if (pendingTransactions.length === 0) {
            return;
        }

        console.log(`Found ${pendingTransactions.length} pending transactions to release.`);

        for (const transaction of pendingTransactions) {
            const wallet = transaction.walletId;

            if (!wallet) continue;

            await Wallet.findByIdAndUpdate(wallet._id, {
                $inc: {
                    balance: transaction.amount,
                    pendingBalance: -transaction.amount,
                },
            });

            transaction.status = "completed";
            await transaction.save();

            await PaymentDistribution.findOneAndUpdate(
                { orderId: transaction.orderId._id, tutor: wallet.owner },
                { isReleasedToWallet: true },
            );

            const studentName = transaction.orderId?.user?.fullName || "a student";
            const transactionId =
                transaction.orderId?.razorpayOrderId || transaction._id.toString().slice(-8).toUpperCase();

            await sendNotification({
                recipientId: wallet.owner,
                senderId: null,
                type: "wallet_credit",
                message: `₹${transaction.amount} has been credited to your wallet for the purchase by ${studentName}. (Ref: ${transactionId})`,
            });
        }

        console.log("Pending funds released successfully!");
    } catch (error) {
        console.error("Error in releasePendingFunds Cron Job:", error);
    }
};

export const startWalletCron = () => {
    cron.schedule("0 * * * *", () => {
        console.log("Running Pending Funds Release Cron Job...");
        releasePendingFunds();
    });
};
