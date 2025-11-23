import mongoose from "mongoose";

const { Schema } = mongoose;

const LessonSchema = new Schema(
    {
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true,
        },

        tutor: {
            type: Schema.Types.ObjectId,
            ref: "Tutor",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },

        description: {
            type: String,
            required: true,
            maxlength: 5000,
        },

        // store duration in seconds
        duration: {
            type: Number,
            default: 0,
            min: 0,
        },

        // S3 URLs
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        pdfUrl: { type: String, default: "" },

        // S3 keys for deletion/updating
        videoKey: { type: String, required: true },
        thumbnailKey: { type: String, required: true },
        pdfKey: { type: String, default: "" },

        // lesson order inside course
        order: {
            type: Number,
            default: 0,
            min: 0,
            index: true,
        },

        isPublished: {
            type: Boolean,
            default: false,
            index: true,
        },

        views: {
            type: Number,
            default: 0,
            min: 0,
        },
        isFreePreview: {
            type: Boolean,
            default: false,
        },
        isRequired: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// indexes for optimized queries
LessonSchema.index({ course: 1, order: 1 });
LessonSchema.index({ tutor: 1 });

export default mongoose.model("Lesson", LessonSchema);
