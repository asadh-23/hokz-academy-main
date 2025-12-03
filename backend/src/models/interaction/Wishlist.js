// backend/src/models/interaction/Wishlist.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Wishlist (Option A - live course data)
 * - One document per (user, course)
 * - Soft-delete enabled for analytics & restore
 * - Unique active index (partial) prevents duplicates for non-deleted entries
 * - Lightweight and scalable (no price snapshot)
 */

const WishlistSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true,
        },

        // soft delete fields (keeps history for analytics / restore)
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },

        // Optional: where user added it from (helps analytics)
        source: {
            type: String,
            enum: ["course_page", "search", "recommendation", "category", "other"],
            default: "course_page",
        },
    },
    { timestamps: true }
);

// Unique index for active wishlist entries only
// allows re-creating/reactivating a soft-deleted pair without violating unique constraint
WishlistSchema.index({ user: 1, course: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

WishlistSchema.statics.addToWishlist = async function (userId, courseId, opts = {}) {
    const existing = await this.findOne({ user: userId, course: courseId }).exec();

    if (existing && !existing.isDeleted) {
        const err = new Error("Course is already in your wishlist");
        err.status = 400;
        throw err;
    }

    if (existing && existing.isDeleted) {
        existing.isDeleted = false;
        existing.deletedAt = null;
        if (opts.source) existing.source = opts.source;
        await existing.save();
        return existing;
    }

    // 3) Create new wishlist entry
    const doc = await this.create({
        user: userId,
        course: courseId,
        source: opts.source || "course_page",
    });

    return doc;
};

/**
 * removeFromWishlist
 * - Soft delete by default (for analytics). Pass { hard: true } to hard delete.
 */
WishlistSchema.statics.removeFromWishlist = async function (userId, wishlistId) {
    const isValidId = mongoose.Types.ObjectId.isValid(wishlistId) && String(wishlistId).length === 24;

    if (!isValidId) {
        return null;
    }

    const updated = await this.findOneAndUpdate(
        { _id: wishlistId, user: userId },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
    ).exec();

    return updated;
};

/**
 * isInWishlist(userId, courseId)
 * - returns boolean or the document if you need it
 */
WishlistSchema.statics.isInWishlist = async function (userId, courseId) {
    const item = await this.findOne({ user: userId, course: courseId, isDeleted: false }).lean().exec();
    return !!item;
};

/**
 * countForCourse(courseId)
 * - useful for analytics: how many active wishlists contain this course
 */
WishlistSchema.statics.countForCourse = async function (courseId) {
    return this.countDocuments({ course: courseId, isDeleted: false }).exec();
};

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
