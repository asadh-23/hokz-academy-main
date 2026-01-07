import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema({
  coupon: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Coupon", 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order",
    required: true
  },
  discountAmount: { type: Number, required: true },
  usedAt: { type: Date, default: Date.now }
});

// Indexes for fast checking
// This ensures we can quickly check "How many times did User X use Coupon Y?"
couponUsageSchema.index({ coupon: 1, user: 1 });

const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);
export default CouponUsage;