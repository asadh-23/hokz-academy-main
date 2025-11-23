// backend/src/models/course/Course.js
import mongoose from "mongoose";

/**
 * Course schema - central course entity for LMS.
 * Keep it focused on course metadata & stats.
 * Detailed content (lessons, quizzes, etc.) live in their own models.
 */

const { Schema } = mongoose;

const RatingBreakdownSchema = new Schema(
    {
        fiveStar: { type: Number, default: 0 },
        fourStar: { type: Number, default: 0 },
        threeStar: { type: Number, default: 0 },
        twoStar: { type: Number, default: 0 },
        oneStar: { type: Number, default: 0 },
    },
    { _id: false }
);

const CourseSchema = new Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 300 },
        slug: { type: String, index: true, unique: true },
        shortSummary: { type: String, default: "", maxlength: 500 },
        description: { type: String, required: true },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },

        tutor: {
            type: Schema.Types.ObjectId,
            ref: "Tutor",
            required: true,
            index: true,
        },

        thumbnailUrl: { type: String, required: true },
        thumbnailKey: { type: String, required: true },

        price: { type: Number, default: 0, min: 0 }, // 0 => free
        offerPercentage: { type: Number, default: 0, min: 0, max: 100 },

        // Visibility / lifecycle flags
        isActive: {type: Boolean, default: true, index: true},
        isListed: { type: Boolean, default: false, index: true },
        isBanned: { type: Boolean, default: false },
        banReason: { type: String, default: "" },
        bannedAt: { type: Date },
        banReportId: { type: Schema.Types.ObjectId, ref: "Report" },

        // Stats (kept denormalized for fast reads)
        enrolledCount: { type: Number, default: 0, min: 0 },
        averageRating: { type: Number, default: 0, min: 0, max: 5 },
        ratingBreakdown: { type: RatingBreakdownSchema, default: () => ({}) },
        totalReviews: { type: Number, default: 0, min: 0 },

        // References (light-touch): keep arrays short or only store counts/ids
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], // optional use-case
        lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }], // lessons managed separately
        quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },

        // Metadata
        language: { type: String, default: "English" },
        level: { type: String, enum: ["all", "beginner", "intermediate", "advanced"], default: "all" },
        tags: [{ type: String }],

        // small helpers
        lessonsCount: { type: Number, default: 0, min: 0 },
        durationSeconds: { type: Number, default: 0, min: 0 },

        notificationSent: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false, index: true }, // soft delete
    },
    { timestamps: true }
);

/**
 * Indexes
 * - text index for search (title/description/shortSummary/tags)
 */
CourseSchema.index({ title: "text", description: "text", shortSummary: "text", tags: "text" });

/**
 * Helpers - small slug generator (if slug not provided)
 */
function makeSlug(text = "") {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // remove non-word chars
        .replace(/\s+/g, "-") // collapse whitespace
        .replace(/-+/g, "-"); // collapse dashes
}

/**
 * Pre-save hook: generate slug if missing
 */
CourseSchema.pre("save", async function (next) {
    if (!this.slug && this.title) {
        let base = makeSlug(this.title).slice(0, 200);
        let slug = base;
        // ensure uniqueness by appending numeric suffix when necessary
        const Course = mongoose.model("Course");
        let counter = 0;
        // loop until unique (rare collisions)
        while (await Course.exists({ slug })) {
            counter += 1;
            slug = `${base}-${counter}`;
            // safety cutoff
            if (counter > 1000) break;
        }
        this.slug = slug;
    }
    next();
});

/**
 * INSTANCE METHODS
 */

/**
 * softDelete - mark course as deleted (logical)
 */
CourseSchema.methods.softDelete = async function () {
    this.isDeleted = true;
    return this.save();
};

/**
 * setPublished - toggle listed/active states
 * flagPublished - true => publish (listed=true, isActive=true)
 *                 false => unpublish (listed=false)
 */
CourseSchema.methods.setPublished = async function (flagPublished = true) {
    this.listed = !!flagPublished;
    if (flagPublished) this.isActive = true;
    return this.save();
};

/**
 * incrementEnrollment - increment enrolledCount atomically
 */
CourseSchema.methods.incrementEnrollment = function (by = 1) {
    return mongoose
        .model("Course")
        .findByIdAndUpdate(this._id, { $inc: { enrolledCount: Math.max(1, by) } }, { new: true });
};

/**
 * recalcRatingStats - aggregate reviews and update denormalized fields
 * This method uses Review model by name to avoid circular imports.
 */
CourseSchema.methods.recalcRatingStats = async function () {
    const Review = mongoose.model("Review");

    const results = await Review.aggregate([
        { $match: { course: this._id, status: "active" } },
        {
            $group: {
                _id: "$rating",
                count: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    // init
    const breakdown = { fiveStar: 0, fourStar: 0, threeStar: 0, twoStar: 0, oneStar: 0 };
    let total = 0;
    let weightedSum = 0;

    results.forEach((r) => {
        const rating = Number(r._id);
        const cnt = r.count || 0;
        total += cnt;
        weightedSum += rating * cnt;

        switch (rating) {
            case 5:
                breakdown.fiveStar = cnt;
                break;
            case 4:
                breakdown.fourStar = cnt;
                break;
            case 3:
                breakdown.threeStar = cnt;
                break;
            case 2:
                breakdown.twoStar = cnt;
                break;
            case 1:
                breakdown.oneStar = cnt;
                break;
            default:
                break;
        }
    });

    this.ratingBreakdown = breakdown;
    this.totalReviews = total;
    this.averageRating = total > 0 ? Math.round((weightedSum / total) * 10) / 10 : 0; // one decimal
    return this.save();
};

/**
 * STATIC METHODS
 */

/**
 * searchAndPaginate - general helper for controllers
 * options: { page, limit, search, categoryId, tutorId, isPublished, sort }
 */
CourseSchema.statics.searchAndPaginate = async function (options = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    if (options.categoryId) filter.category = options.categoryId;
    if (options.tutorId) filter.tutor = options.tutorId;

    if (typeof options.isPublished === "boolean") {
        // map to listing visible status
        filter.listed = options.isPublished;
        filter.isActive = true;
    }

    if (options.search) {
        // use text search; fallback to regex when necessary in controller if desired
        filter.$text = { $search: options.search };
    }

    // build sort
    let sort = { createdAt: -1 };
    if (options.sort === "oldest") sort = { createdAt: 1 };
    if (options.sort === "popular") sort = { enrolledCount: -1 };
    if (options.sort === "highestRated") sort = { averageRating: -1, enrolledCount: -1 };

    const [totalFiltered, courses] = await Promise.all([
        this.countDocuments(filter),
        this.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate("category", "name slug") // adjust projections as needed
            .populate("tutor", "full_name profileImage")
            .lean(),
    ]);

    return {
        courses,
        pagination: {
            currentPage: page,
            totalPages: Math.max(1, Math.ceil(totalFiltered / limit)),
            totalFilteredItems: totalFiltered,
        },
    };
};

/**
 * getReviews - convenience static to fetch paginated reviews for a course
 * opts: { page, limit, rating, verified, sort }
 */
CourseSchema.statics.getReviews = async function (courseId, opts = {}) {
    const Review = mongoose.model("Review");
    const { page = 1, limit = 10, rating = "all", verified = false, sort = "newest" } = opts;

    const query = { course: mongoose.Types.ObjectId(courseId), status: "active" };
    if (rating !== "all") query.rating = Number(rating);
    if (verified) query.verifiedPurchase = true;

    let sortOption = { createdAt: -1 };
    if (sort === "highest") sortOption = { rating: -1 };
    if (sort === "lowest") sortOption = { rating: 1 };
    if (sort === "most_helpful") sortOption = { "helpfulVotes.length": -1 };

    return Review.find(query)
        .populate("user", "full_name profileImage")
        .sort(sortOption)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean();
};

export const Course = mongoose.model("Course", CourseSchema);
export default Course;
