import mongoose from 'mongoose';

const WalletTransactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true,
    index: true // Faster searching
  },
  type: {
    type: String,
    enum: ['credit', 'debit'], // Money IN or Money OUT
    required: true
  },
  category: {
    type: String,
    enum: ['course_sale', 'withdrawal', 'refund', 'admin_adjustment'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  
  // Linking to other models
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create index for fetching history quickly
WalletTransactionSchema.index({ walletId: 1, createdAt: -1 });

const WalletTransaction = mongoose.model('WalletTransaction', WalletTransactionSchema);
export default WalletTransaction;