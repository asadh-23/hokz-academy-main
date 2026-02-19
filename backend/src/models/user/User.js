import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true,
        },
        googleId: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            trim: true,
            required: function () {
                return !this.googleId;
            },
            sparse: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
        },
        profileImage: {
            type: String,
            default: null,
        },
        fcmToken: {
            type: String,
            default: null,
        },
        wallet: {
            type: Number,
            default: 0,
            min: [0, "Wallet balance cannot be negative"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user"],
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        lastActive: {
            type: Date,
        },
        lastLogin: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpiry: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

// Pre-save: Hash password before saving new or modified user
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || "10"));
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchUserPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
