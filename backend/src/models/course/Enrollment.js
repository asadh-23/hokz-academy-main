import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index: true
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
        // Helps in querying "Total students for Tutor X" without joining Course table
    },
    
    // Financial Reference (Audit Trail)
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    
    // Price at the moment of purchase (Historical Data)
    // Course price might change later, but we need to know what THIS user paid.
    pricePaid: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: ["active", "refunded", "cancelled"],
        default: "active", 
        index: true
    },

    enrolledAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// COMPOUND INDEX: CRITICAL
// Oru user-kku ore course randu thavana vaangan pattaruthu.
// Ee index athu database level-il thanne block cheyyum.
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;