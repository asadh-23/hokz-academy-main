import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        required: true,
        trim: true
    }],
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    points: {
        type: Number,
        default: 1,
        min: 1
    },
    explanation: {
        type: String,
        trim: true
    }
});

const examSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    questions: [questionSchema],
    settings: {
        passingScore: { type: Number, default: 70 },
        timeLimit: { type: Number, default: 30 },
        maxAttempts: { type: Number, default: 2 },
        shuffleQuestions: { type: Boolean, default: true }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

examSchema.virtual('totalPoints').get(function() {
    return this.questions.reduce((total, question) => total + question.points, 0);
});

export default mongoose.model('Exam', examSchema);
