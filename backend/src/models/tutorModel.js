import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// ------------------ TUTOR SCHEMA ------------------

const tutorSchema = new mongoose.Schema(
    {
        // Basic info
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
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
        googleId: {
            type: String,
            default: null,
        },

        // ---------------- PROFILE DETAILS ----------------
        profileImage: {
            type: String,
            default: null,
        },
        headline: {
            type: String,
            default: "",
            trim: true,
        },
        expertiseArea: {
            type: String,
            default: "",
            trim: true,
        },
        bio: {
            type: String,
            default: "",
            trim: true,
        },
        yearsOfExperience: {
            type: String,
            default: "",
        },
        skills: {
            type: [String],
            default: [],
        },
        languages: {
            type: [String],
            default: [],
        },
        qualifications: {
            type: [String],
            default: [],
        },

        // ---------------- STATUS & META ----------------
        fcmToken: {
            type: String,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        lastActive: { type: Date },
        lastLogin: { type: Date },

        // ---------------- RELATIONS ----------------
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "courses",
            },
        ],
        notifications: [notificationSchema],

        // ---------------- TOKENS ----------------
        passwordResetToken: {
            type: String,
        },
        passwordResetExpiry: {
            type: Date,
        },

        // ---------------- ROLE ----------------
        role: {
            type: String,
            default: "tutor",
            enum: ["tutor"],
        },
    },
    { timestamps: true }
);

// ------------------ PASSWORD ENCRYPTION ------------------

tutorSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || "10"));
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

// ------------------ PASSWORD COMPARISON ------------------

tutorSchema.methods.matchTutorPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ------------------ EXPORT ------------------

const Tutor = mongoose.model("Tutor", tutorSchema);
export default Tutor;
