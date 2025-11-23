import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "tutor", "admin"],
        required: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['registration', 'password_change', 'email_change'],
        default: 'registration'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },
});

otpSchema.pre('save', async function(next) {
    if (this.isModified('otpHash') && this.otpHash && this.otpHash.length <= 8) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.otpHash = await bcrypt.hash(this.otpHash, salt);
            next();
        } catch (error) {
            console.error("Error hashing OTP:", error);
            next(error);
        }
    } else {
        next();
    }
});

otpSchema.methods.compareOtp = async function(candidateOtp) {
    if (!candidateOtp || !this.otpHash) {
        return false;
    }
    return await bcrypt.compare(candidateOtp, this.otpHash);
};

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
