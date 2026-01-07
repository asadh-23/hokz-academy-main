import mongoose from 'mongoose';

const PaymentDistributionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  courses: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    courseTitle: String,
    price: Number
  }],

  // Money Split Calculation
  totalAmount: { type: Number, required: true },       // Total Sales for THIS tutor in this order
  adminShareAmount: { type: Number, required: true },  // 10% (Example)
  tutorShareAmount: { type: Number, required: true },  // 90% (Example)
  adminCommissionRate: { type: Number, default: 10 },  // Percentage used

  // Status regarding Wallet Update
  isReleasedToWallet: {
    type: Boolean,
    default: false // Payment received but not yet withdrawable (maybe 30 days hold)
  },
  walletTransactionId: { type: String }, // If you create a WalletTransaction later

  transactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for fast dashboard loading
PaymentDistributionSchema.index({ tutor: 1, transactionDate: -1 });
PaymentDistributionSchema.index({ isReleasedToWallet: 1 });

// 👇 FIXED: Variable name matched with Schema definition
const PaymentDistribution = mongoose.model('PaymentDistribution', PaymentDistributionSchema);
export default PaymentDistribution;