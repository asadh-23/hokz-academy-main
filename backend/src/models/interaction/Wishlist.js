import mongoose from "mongoose";

const { Schema } = mongoose;


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

    // Optional denormalized snapshot for fast reads (can be updated when course changes)
    courseSnapshot: {
      title: { type: String, default: "" },
      slug: { type: String, default: "" },
      thumbnailUrl: { type: String, default: "" },
      price: { type: Number, default: 0 },
      offerPercentage: { type: Number, default: 0 },
      tutorName: { type: String, default: "" },
    },

    // metadata about how/where it was added
    source: {
      type: String,
      enum: ["course_page", "search", "recommendation", "category", "other"],
      default: "course_page",
    },

    // soft delete so we can keep history if needed
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },

    // optional note user might want to attach
    note: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate wishlist entries per user-course
WishlistSchema.index({ user: 1, course: 1 }, { unique: true, background: true });

// Optional helper static: safe add (creates or returns existing)
WishlistSchema.statics.addToWishlist = async function (userId, courseId, snapshot = {}, opts = {}) {
  // opts: { upsertSnapshot: true } -> update snapshot if exists
  const existing = await this.findOne({ user: userId, course: courseId });
  if (existing && !existing.isDeleted) {
    if (opts.upsertSnapshot) {
      await this.updateOne({ _id: existing._id }, { $set: { courseSnapshot: snapshot, isDeleted: false, deletedAt: null } });
    }
    return existing;
  }

  // If exists but soft-deleted, reactivate
  if (existing && existing.isDeleted) {
    existing.isDeleted = false;
    existing.deletedAt = null;
    existing.courseSnapshot = { ...existing.courseSnapshot, ...snapshot };
    await existing.save();
    return existing;
  }

  // create new
  const doc = await this.create({
    user: userId,
    course: courseId,
    courseSnapshot: snapshot,
    source: opts.source || "course_page",
  });
  return doc;
};

// Optional helper: safe remove (soft delete)
WishlistSchema.statics.removeFromWishlist = async function (userId, courseId, hard = false) {
  if (hard) {
    return this.deleteOne({ user: userId, course: courseId });
  } else {
    return this.findOneAndUpdate(
      { user: userId, course: courseId },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
  }
};

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
