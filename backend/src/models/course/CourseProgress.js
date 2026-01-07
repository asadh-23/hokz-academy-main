import mongoose from "mongoose";

const CourseProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completedLessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson"
        }
    ],
  
    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
   
    lastPlayedLesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    
    completedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });


CourseProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const CourseProgress = mongoose.model("CourseProgress", CourseProgressSchema);
export default CourseProgress;