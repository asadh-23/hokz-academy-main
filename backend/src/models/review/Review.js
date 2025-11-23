// backend/src/models/review/Review.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Helpful votes subdocument
 */
const HelpfulVoteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/**
 * Main Review Schema
 */
const ReviewSchema = new Schema(
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

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    helpfulVotes: [HelpfulVoteSchema],

    /**
     * Attached response from tutor or admin (SEPARATE MODEL)
     */
    tutorResponse: {
      type: Schema.Types.ObjectId,
      ref: "TutorResponse",
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "hidden", "deleted"],
      default: "active",
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
    },

    meta: {
      ip: { type: String },
      userAgent: { type: String },
    },
  },
  { timestamps: true }
);

/**
 * Indexes
 */
ReviewSchema.index({ course: 1, createdAt: -1 });
ReviewSchema.index({ user: 1, course: 1 }); // helps avoid duplicates, easy lookup

/**
 * INSTANCE METHODS
 */

// add helpful vote
ReviewSchema.methods.addHelpfulVote = async function (userId) {
  const exists = this.helpfulVotes.some(
    (v) => v.user.toString() === userId.toString()
  );
  if (exists) return this;

  this.helpfulVotes.push({ user: userId });
  return this.save();
};

// remove helpful vote
ReviewSchema.methods.removeHelpfulVote = async function (userId) {
  this.helpfulVotes = this.helpfulVotes.filter(
    (v) => v.user.toString() !== userId.toString()
  );
  return this.save();
};

// hide review (admin moderation)
ReviewSchema.methods.hide = function () {
  this.status = "hidden";
  return this.save();
};

// soft delete
ReviewSchema.methods.softDelete = function () {
  this.status = "deleted";
  return this.save();
};

/**
 * STATIC METHODS
 */

// paginated review fetch
ReviewSchema.statics.fetchForCourse = async function (courseId, opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const limit = Math.max(1, Number(opts.limit) || 10);
  const skip = (page - 1) * limit;

  const query = {
    course: mongoose.Types.ObjectId(courseId),
    status: "active",
  };

  if (opts.rating && opts.rating !== "all") {
    query.rating = Number(opts.rating);
  }

  if (opts.verified === true) {
    query.verifiedPurchase = true;
  }

  let sort = { createdAt: -1 };
  if (opts.sort === "highest") sort = { rating: -1, createdAt: -1 };
  if (opts.sort === "lowest") sort = { rating: 1, createdAt: -1 };
  if (opts.sort === "most_helpful")
    sort = { "helpfulVotes.length": -1, createdAt: -1 };

  const [total, reviews] = await Promise.all([
    this.countDocuments(query),
    this.find(query)
      .populate("user", "full_name profileImage")
      .populate("tutorResponse", "content tutor createdAt")
      .populate("tutorResponse.tutor", "full_name profileImage")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    reviews,
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      totalItems: total,
    },
  };
};

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
