import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    selectedOption: {
        type: Number,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    points: {
        type: Number,
        default: 0
    }
});

const examAttemptSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exam: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    answers: [answerSchema],
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    totalPoints: { type: Number, required: true },
    earnedPoints: { type: Number, required: true },
    isPassed: {
        type: Boolean,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

examAttemptSchema.index({ user: 1, exam: 1 });

examAttemptSchema.statics.canUserAttempt = async function (userId, examId, maxAttempts) {
    const attemptCount = await this.countDocuments({ user: userId, exam: examId });
    return attemptCount < maxAttempts;
};

export default mongoose.model('ExamAttempt', examAttemptSchema);
