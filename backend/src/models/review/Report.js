// backend/src/models/review/Report.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Report Schema
 * Used when a student reports a course for issues like:
 * - inappropriate content
 * - spam
 * - misleading info
 * - offensive content
 * - other violations
 *
 * Admin can review these reports and take actions:
 * - pending → reviewed → resolved/dismissed/banned
 */

const ReportSchema = new Schema(
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

    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      default: null, // optional — report may be about a course or about a specific review
    },

    reason: {
      type: String,
      required: true,
      enum: ["inappropriate", "spam", "misleading", "offensive", "plagiarism", "other"],
    },

    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    attachments: [
      {
        url: String,          // e.g. screenshot, image proof
        public_id: String,    // if stored in cloud (optional)
      },
    ],

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed", "banned"],
      default: "pending",
      index: true,
    },

    adminNotes: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    resolvedByAdmin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Indexes for fast admin lookup
 */
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ course: 1, status: 1 });

/**
 * INSTANCE METHODS
 */

// mark as reviewed (admin checked the report but hasn't resolved it)
ReportSchema.methods.markReviewed = function () {
  this.status = "reviewed";
  return this.save();
};

// resolve with action taken
ReportSchema.methods.resolve = function (adminId, note = "") {
  this.status = "resolved";
  this.resolvedByAdmin = adminId;
  this.adminNotes = note;
  this.resolvedAt = new Date();
  return this.save();
};

// dismiss the report
ReportSchema.methods.dismiss = function (adminId, note = "") {
  this.status = "dismissed";
  this.resolvedByAdmin = adminId;
  this.adminNotes = note;
  this.resolvedAt = new Date();
  return this.save();
};

// ban course based on report
ReportSchema.methods.banCourse = async function (adminId, note = "") {
  const Course = mongoose.model("Course");

  this.status = "banned";
  this.resolvedByAdmin = adminId;
  this.adminNotes = note;
  this.resolvedAt = new Date();

  // Update the course
  await Course.findByIdAndUpdate(this.course, {
    isBanned: true,
    banReason: this.reason,
    bannedAt: new Date(),
    banReportId: this._id,
  });

  return this.save();
};

/**
 * STATIC METHODS
 */

// fetch reports for admin dashboard with filters
ReportSchema.statics.fetchReports = async function (opts = {}) {
  const page = Math.max(1, Number(opts.page) || 1);
  const limit = Math.max(1, Number(opts.limit) || 10);
  const skip = (page - 1) * limit;

  const filter = {};

  if (opts.status && opts.status !== "all") {
    filter.status = opts.status;
  }

  if (opts.course) {
    filter.course = opts.course;
  }

  if (opts.user) {
    filter.user = opts.user;
  }

  const [total, reports] = await Promise.all([
    this.countDocuments(filter),
    this.find(filter)
      .populate("user", "full_name email")
      .populate("course", "title slug")
      .populate("review", "rating review")
      .populate("resolvedByAdmin", "full_name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    reports,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  };
};

const Report = mongoose.model("Report", ReportSchema);
export default Report;
