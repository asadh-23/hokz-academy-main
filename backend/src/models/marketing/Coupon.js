import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        maxDiscountAmount: { type: Number, default: null },
        minPurchaseAmount: { type: Number, default: 0 },

        startDate: { type: Date, default: Date.now },
        expiryDate: { type: Date, required: true },

        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tutor",
            required: true,
        },

        usageLimit: { type: Number, default: null },
        usagePerUser: { type: Number, default: 1 },

        // Performance Counter (Atomic Increment only)
        usedCount: { type: Number, default: 0 },

        // Course Restrictions
        applicableCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        isActive: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Indexes (code and tutor already have unique/indexed from schema definition)
couponSchema.index({ expiryDate: 1 });

// Methods
couponSchema.methods.calculateDiscount = function (amount) {
    if (this.discountType === "percentage") {
        let discount = (amount * this.discountValue) / 100;
        if (this.maxDiscountAmount) {
            discount = Math.min(discount, this.maxDiscountAmount);
        }
        return Math.round(discount);
    } else {
        return Math.min(this.discountValue, amount);
    }
};

// Check Validity Logic
couponSchema.methods.isValid = function () {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.startDate &&
        now <= this.expiryDate &&
        (this.usageLimit === null || this.usedCount < this.usageLimit)
    );
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
