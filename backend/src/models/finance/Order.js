import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    price: { type: Number, required: true }, // MRP at purchase time
    discountedPrice: { type: Number, required: true }, // Actual paid price per item
});

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        // Razorpay Details
        razorpayOrderId: { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String }, // Not required initially
        razorpaySignature: { type: String },

        items: [OrderItemSchema],

        // Financial Breakdown
        totalAmount: { type: Number, required: true }, // Base Total (MRP Sum)
        discountAmount: { type: Number, default: 0 }, // Total Discount
        couponDiscount: { type: Number, default: 0 }, // Total Coupon Discount
        appliedCoupons: [
            {
                coupon: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Coupon",
                },
                tutorId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Tutor",
                },
                discountAmount: { type: Number, required: true },
            },
        ],
        taxAmount: { type: Number, required: true }, // GST
        finalAmount: { type: Number, required: true }, // Payable Amount

        status: {
            type: String,
            enum: ["pending", "paid", "failed"], // Changed from just 'paid'
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["razorpay"],
            default: "razorpay",
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
