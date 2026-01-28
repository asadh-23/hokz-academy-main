import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAxios } from "../../api/userAxios";
import { toast } from "sonner";
import {
    AlertTriangle,
    ChevronRight,
    FileText,
    Award,
    Timer,
    CheckCircle,
    XCircle,
    Download,
    RotateCcw,
    ArrowLeft,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import confetti from "canvas-confetti";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import CertificatePDF from "../../components/user/pdfs/CertificatePDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

const CourseExam = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const STORAGE_KEY = `exam_session_${courseId}`;

    // States
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [examStatus, setExamStatus] = useState("intro");
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const user = useSelector(selectUser);

    // Refs (Critical for fixing stale closure bugs)
    const timerRef = useRef(null);
    const answersRef = useRef(answers);

    // 1. Keep answersRef synced with answers state
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    // 2. Fetch Exam & Resume Logic
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await userAxios.get(`/exam/${courseId}`);
                if (response.data.success) {
                    const examData = response.data.data;
                    setExam(examData);

                    // Resume Logic
                    const savedSession = localStorage.getItem(STORAGE_KEY);
                    if (savedSession) {
                        const parsedSession = JSON.parse(savedSession);
                        const now = Date.now();

                        if (parsedSession.endTime > now && !parsedSession.isSubmitted) {
                            setExamStatus("active");
                            setAnswers(parsedSession.answers || {});
                            setCurrentQIndex(parsedSession.currentQIndex || 0);

                            // Calculate remaining seconds exactly based on wall-clock time
                            const remainingSeconds = Math.floor((parsedSession.endTime - now) / 1000);
                            setTimeLeft(remainingSeconds);
                            toast.info("Resuming your exam session...");
                        } else {
                            localStorage.removeItem(STORAGE_KEY);
                        }
                    } else {
                        setTimeLeft(examData.settings.timeLimit * 60);
                    }
                }
            } catch (error) {
                toast.error("Failed to load exam.");
                navigate(`/user/learn/${courseId}`);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();

        return () => clearInterval(timerRef.current);
    }, [courseId, navigate, STORAGE_KEY]);

    // 3. Timer Logic (Fixed for Tab Switching & Auto Submit)
    useEffect(() => {
        if (examStatus === "active" && timeLeft > 0) {
            const savedSession = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            const endTime = savedSession.endTime || Date.now() + timeLeft * 1000;

            timerRef.current = setInterval(() => {
                const now = Date.now();
                const secondsLeft = Math.ceil((endTime - now) / 1000);

                if (secondsLeft <= 0) {
                    clearInterval(timerRef.current);
                    setTimeLeft(0);
                    handleSubmit(true); // Auto submit
                } else {
                    setTimeLeft(secondsLeft);
                }
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [examStatus]);

    // 4. Save State Logic
    useEffect(() => {
        if (examStatus === "active" && exam) {
            const savedSession = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            const updatedSession = {
                ...savedSession,
                answers,
                currentQIndex,
                isSubmitted: false,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
        }
    }, [answers, currentQIndex, examStatus, exam, STORAGE_KEY]);

    // Start Exam
    const handleStart = () => {
        const durationSeconds = exam.settings.timeLimit * 60;
        const endTime = Date.now() + durationSeconds * 1000;

        const sessionData = {
            endTime: endTime,
            startTime: Date.now(),
            answers: {},
            currentQIndex: 0,
            isSubmitted: false,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));

        setExamStatus("active");
        setTimeLeft(durationSeconds);
    };

    // Option Select
    const handleOptionSelect = (optionIndex) => {
        setAnswers({ ...answers, [currentQIndex]: optionIndex });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Submit Exam
    const handleSubmit = async (isAuto = false) => {
        const finalAnswers = isAuto ? answersRef.current : answers;

        if (!isAuto && Object.keys(finalAnswers).length < exam.questions.length) {
            const confirm = window.confirm("You haven't answered all questions. Are you sure?");
            if (!confirm) return;
        }

        setSubmitting(true);
        clearInterval(timerRef.current);

        const savedSession = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
        const startTime = savedSession.startTime || Date.now();
        const timeSpentInSeconds = Math.floor((Date.now() - startTime) / 1000);

        try {
            const payload = {
                courseId,
                examId: exam._id,
                answers: finalAnswers,
                timeSpent: timeSpentInSeconds,
            };

            const response = await userAxios.post("/exam/submit", payload);

            if (response.data.success) {
                localStorage.removeItem(STORAGE_KEY);
                setResult(response.data.data);
                setExamStatus("result");
                if (response.data.data.isPassed) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#4f46e5", "#7c3aed", "#06b6d4", "#10b981"],
                    });
                }
            }
        } catch (error) {
            toast.error("Submission failed.");
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600 font-medium">Loading exam...</p>
                </div>
            </div>
        );
    }

    // INTRO SCREEN
    if (examStatus === "intro") {
        const maxAttempts = exam?.settings?.maxAttempts || Infinity;
        const userAttempts = exam?.userAttempts || 0;
        const attemptsLeft = maxAttempts - userAttempts;
        const isAttemptsExhausted = maxAttempts !== Infinity && attemptsLeft <= 0;

        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">{exam.title}</h1>
                        <p className="text-indigo-100 text-lg">{exam.description}</p>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Exam Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl text-center border border-blue-200">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <FileText size={24} className="text-white" />
                                </div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Questions</p>
                                <p className="text-2xl font-bold text-blue-900">{exam.questions.length}</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl text-center border border-purple-200">
                                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Timer size={24} className="text-white" />
                                </div>
                                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                                    Time Limit
                                </p>
                                <p className="text-2xl font-bold text-purple-900">{exam.settings.timeLimit}m</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl text-center border border-green-200">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Award size={24} className="text-white" />
                                </div>
                                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
                                    Passing Score
                                </p>
                                <p className="text-2xl font-bold text-green-900">{exam.settings.passingScore}%</p>
                            </div>

                            <div
                                className={`p-6 rounded-2xl text-center border-2 ${
                                    isAttemptsExhausted
                                        ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                                        : "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200"
                                }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                                        isAttemptsExhausted ? "bg-red-600" : "bg-indigo-600"
                                    }`}
                                >
                                    <RotateCcw size={24} className="text-white" />
                                </div>
                                <p
                                    className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                                        isAttemptsExhausted ? "text-red-600" : "text-indigo-600"
                                    }`}
                                >
                                    Attempts
                                </p>
                                <p
                                    className={`text-2xl font-bold ${
                                        isAttemptsExhausted ? "text-red-900" : "text-indigo-900"
                                    }`}
                                >
                                    {userAttempts} / {maxAttempts === Infinity ? "∞" : maxAttempts}
                                </p>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-6 rounded-2xl mb-8">
                            <div className="flex gap-4">
                                <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-bold text-yellow-800 mb-2">Important Instructions</h3>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• Do not refresh or close the browser during the exam</li>
                                        <li>• Your progress will be automatically saved</li>
                                        <li>• The exam will auto-submit when time expires</li>
                                        {!isAttemptsExhausted && (
                                            <li>
                                                •{" "}
                                                {maxAttempts === Infinity
                                                    ? "You have unlimited attempts"
                                                    : `You have ${attemptsLeft} attempts remaining`}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-all"
                            >
                                <ArrowLeft size={20} />
                                Back to Course
                            </button>

                            {isAttemptsExhausted ? (
                                <button
                                    disabled
                                    className="bg-gray-300 text-gray-500 cursor-not-allowed px-8 py-4 rounded-2xl font-bold text-lg"
                                >
                                    Maximum Attempts Reached
                                </button>
                            ) : (
                                <button
                                    onClick={handleStart}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:scale-105"
                                >
                                    Start Exam
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // RESULT SCREEN
    if (examStatus === "result" && result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div
                        className={`p-8 text-center ${
                            result.isPassed
                                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                                : "bg-gradient-to-r from-red-500 to-rose-600"
                        }`}
                    >
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            {result.isPassed ? (
                                <CheckCircle size={48} className="text-white" />
                            ) : (
                                <XCircle size={48} className="text-white" />
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {result.isPassed ? "Congratulations! 🎉" : "Keep Learning! 💪"}
                        </h2>
                        <p className="text-white/90 text-lg">
                            {result.isPassed
                                ? "You have successfully passed the exam!"
                                : "Don't give up! You can try again."}
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Score Display */}
                        <div className="text-center mb-8">
                            <div
                                className={`text-6xl font-black mb-2 ${
                                    result.isPassed ? "text-green-600" : "text-red-600"
                                }`}
                            >
                                {result.score}%
                            </div>
                            <p className="text-gray-500 font-medium">Your Final Score</p>
                            <div className="mt-4 bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${
                                        result.isPassed ? "bg-green-500" : "bg-red-500"
                                    }`}
                                    style={{ width: `${result.score}%` }}
                                />
                            </div>
                        </div>

                        {/* Result Details */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                <p className="text-sm text-gray-500 font-medium">Correct Answers</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {result.correctCount || 0} / {exam.questions.length}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl text-center">
                                <p className="text-sm text-gray-500 font-medium">Time Spent</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.floor((result.timeSpent || 0) / 60)}m {(result.timeSpent || 0) % 60}s
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {result.isPassed && (
                                <PDFDownloadLink
                                    document={
                                        <CertificatePDF
                                            studentName={user.fullName}
                                            courseName={result.course.title || exam.title}
                                            completionDate={result.completedAt || new Date()}
                                            score={result.score}
                                            instructor={result.instructor?.fullName || "Hokz Academy Instructor"}
                                            certificateId={`CRT-${result.certificateId.toString().slice(-8).toUpperCase()}`}
                                        />
                                    }
                                    fileName={`Certificate_${exam.title.replace(/\s+/g, "_")}.pdf`}
                                    className="w-full"
                                >
                                    {({ loading }) => (
                                        <button
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all flex justify-center items-center gap-3 shadow-lg transform hover:scale-105"
                                        >
                                            {loading ? (
                                                "Generating Certificate..."
                                            ) : (
                                                <>
                                                    <Download size={20} />
                                                    Download Certificate
                                                </>
                                            )}
                                        </button>
                                    )}
                                </PDFDownloadLink>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/user/learn/${courseId}`)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold transition-all"
                                >
                                    Back to Course
                                </button>

                                {!result.isPassed && (
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={18} />
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ACTIVE EXAM
    const question = exam?.questions?.[currentQIndex];
    if (!question) return <div>Error loading question...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 px-8 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <h2 className="font-bold text-gray-700 hidden md:block text-lg">{exam.title}</h2>
                <div
                    className={`flex items-center gap-3 font-mono text-2xl font-bold px-4 py-2 rounded-2xl ${
                        timeLeft < 60 ? "text-red-600 bg-red-50 animate-pulse" : "text-indigo-600 bg-indigo-50"
                    }`}
                >
                    <Timer size={24} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
                {/* Progress Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span className="font-medium">
                            Question {currentQIndex + 1} of {exam.questions.length}
                        </span>
                        <span className="font-bold text-indigo-600">
                            {Math.round(((currentQIndex + 1) / exam.questions.length) * 100)}% Complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentQIndex + 1) / exam.questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 mb-8">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">{currentQIndex + 1}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">{question.question}</h3>
                    </div>

                    <div className="space-y-4 ml-14">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 hover:shadow-md ${
                                    answers[currentQIndex] === idx
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100"
                                        : "border-gray-200 hover:border-indigo-300 text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                        answers[currentQIndex] === idx
                                            ? "border-indigo-600 bg-indigo-600"
                                            : "border-gray-300"
                                    }`}
                                >
                                    {answers[currentQIndex] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-lg">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQIndex === 0}
                        className="px-6 py-3 text-gray-500 font-bold hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Previous
                    </button>

                    {currentQIndex === exam.questions.length - 1 ? (
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-green-200 transition-all transform hover:scale-105 disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Exam"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQIndex((prev) => prev + 1)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-indigo-200 transition-all transform hover:scale-105"
                        >
                            Next Question
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseExam;
