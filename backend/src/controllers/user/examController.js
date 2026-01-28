import Exam from "../../models/course/Exam.js"
import Enrollment from "../../models/course/Enrollment.js";
import ExamAttempt from "../../models/course/ExamAttempt.js";
import Course from "../../models/course/Course.js";

export const getExamByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user._id;

        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: "active"
        });

        if (!enrollment) {
            console.log("User not enrolled in enrollment collection");
            return res.status(403).json({ 
                success: false, 
                message: "You are not enrolled in this course." 
            });
        }

        const exam = await Exam.findOne({ course: courseId });

        if (!exam) {
            return res.status(404).json({ 
                success: false, 
                message: "No exam found for this course." 
            });
        }

        if (!exam.isActive) {
            return res.status(403).json({
                success: false,
                message: "This exam is currently inactive."
            });
        }

        const previousAttempts = await ExamAttempt.countDocuments({ 
            user: userId, 
            exam: exam._id 
        });

        const examData = {
            _id: exam._id,
            title: exam.title,
            description: exam.description,
            settings: exam.settings,
            userAttempts: previousAttempts,
            questions: exam.questions.map(q => ({
                _id: q._id,
                question: q.question,
                options: q.options,
                points: q.points
            }))
        };

        return res.status(200).json({
            success: true,
            data: examData
        });

    } catch (error) {
        console.error("Get Exam Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: error.message 
        });
    }
};

export const submitExam = async (req, res) => {
    try {
        const { courseId, examId, answers, timeSpent } = req.body;
        const userId = req.user._id;

        if (!examId || !answers) {
            return res.status(400).json({ success: false, message: "Invalid submission data." });
        }

        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
            status: "active"
        });

        if (!enrollment) {
            return res.status(403).json({ success: false, message: "You are not enrolled in this course." });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found." });
        }

        const previousAttempts = await ExamAttempt.countDocuments({ user: userId, exam: examId });
        if (exam.settings.maxAttempts && previousAttempts >= exam.settings.maxAttempts) {
            return res.status(400).json({ 
                success: false, 
                message: `Maximum attempts (${exam.settings.maxAttempts}) reached.` 
            });
        }

        const courseDetails = await Course.findById(courseId)
            .select("title tutor")
            .populate("tutor", "fullName profileImage email");

        let scoreObtained = 0;
        let totalPoints = 0;
        let correctCount = 0;
        let wrongCount = 0;

        const formattedAnswers = exam.questions.map((question, index) => {
            const studentAnswerIndex = answers[index];
            
            const isAnswered = studentAnswerIndex !== undefined && studentAnswerIndex !== null;
            
            const isCorrect = isAnswered && Number(studentAnswerIndex) === question.correctAnswer;
            const pointsForThisQuestion = isCorrect ? question.points : 0;

            if (isCorrect) {
                scoreObtained += pointsForThisQuestion;
                correctCount++;
            } else {
                wrongCount++;
            }
            totalPoints += question.points;

            return {
                questionId: question._id,
                selectedOption: isAnswered ? Number(studentAnswerIndex) : -1, 
                isCorrect: isCorrect,
                points: pointsForThisQuestion
            };
        });

        const percentage = totalPoints > 0 ? Math.round((scoreObtained / totalPoints) * 100) : 0;
        const isPassed = percentage >= exam.settings.passingScore;

        const newAttempt = new ExamAttempt({
            user: userId,
            exam: examId,
            course: courseId,
            answers: formattedAnswers,
            score: percentage,
            totalPoints: totalPoints,
            earnedPoints: scoreObtained,
            isPassed: isPassed,
            timeSpent: timeSpent || 0,
            completedAt: Date.now(),
        });

        await newAttempt.save();

        return res.status(200).json({
            success: true,
            message: "Exam submitted successfully.",
            data: {
                certificateId: newAttempt._id,
                score: percentage,
                earnedPoints: scoreObtained,
                totalPoints: totalPoints,
                isPassed: isPassed,
                correctCount,
                wrongCount,
                totalQuestions: exam.questions.length,
                timeSpent,
                completedAt: newAttempt.completedAt,
                course: courseDetails,
                instructor: courseDetails.tutor,
            }
        });

    } catch (error) {
        console.error("Submit Exam Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server Error",
            error: error.message 
        });
    }
};
