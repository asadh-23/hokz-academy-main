import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'ownerType',
    unique: true // One user/tutor can have only one wallet
  },
  ownerType: {
    type: String,
    required: true,
    enum: ['Tutor', 'Admin', 'User'] // Added User for refunds if needed
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalWithdrawals: {
    type: Number,
    default: 0
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String,
    isVerified: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Wallet = mongoose.model('Wallet', WalletSchema);
export default Wallet;