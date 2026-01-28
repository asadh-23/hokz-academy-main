import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    CheckCircle2,
    Circle,
    PlayCircle,
    Lock,
    ChevronRight,
    FileText,
    Award,
    AlertCircle,
    Download,
    File,
    Eye,
} from "lucide-react";
import { toast } from "sonner";

import {
    fetchCourseAccess,
    updateProgress,
    setActiveLesson,
    resetCourseState,
    selectLearningCourse,
    selectCourseLessons,
    selectProgressData,
    selectActiveLesson,
    selectCourseProgressLoading,
    selectcertificateData,
} from "../../store/features/user/courseProgressSlice";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { selectUser } from "../../store/features/auth/userAuthSlice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CertificatePDF from "../../components/user/pdfs/CertificatePDF";

const CourseLearning = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const shouldAutoPlay = useRef(false);

    const learningCourse = useSelector(selectLearningCourse);
    const lessons = useSelector(selectCourseLessons);
    const activeLesson = useSelector(selectActiveLesson);
    const progressData = useSelector(selectProgressData);
    const isLoading = useSelector(selectCourseProgressLoading);
    const certificateData = useSelector(selectcertificateData);

    const user = useSelector(selectUser);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseAccess(courseId))
                .unwrap()
                .catch(() => {
                    toast.error("Failed to load course.");
                });
        }
        return () => {
            dispatch(resetCourseState());
        };
    }, [courseId, dispatch, navigate]);

    const navigateToNextLesson = () => {
        const currentIndex = lessons.findIndex((l) => l._id === activeLesson._id);
        if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
            shouldAutoPlay.current = true;
            const nextLesson = lessons[currentIndex + 1];
            dispatch(setActiveLesson(nextLesson));
        }
    };

    const handleToggleComplete = async (lessonId) => {
        if (!progressData.completedLessons.includes(lessonId)) {
            try {
                await dispatch(updateProgress({ courseId, lessonId })).unwrap();
                toast.success("Lesson Completed!");
            } catch {
                toast.error("Failed to update progress");
            }
        }
    };
    console.log(progressData.certificateData?.score);

    const handleManualComplete = async () => {
        await handleToggleComplete(activeLesson._id);
        navigateToNextLesson();
    };

    const handleVideoEnded = () => {
        if (activeLesson) {
            handleToggleComplete(activeLesson._id);
            navigateToNextLesson();
        }
    };

    const handleLessonChange = (lesson) => {
        shouldAutoPlay.current = true;
        dispatch(setActiveLesson(lesson));
    };

    const handleDownloadPDF = async (url, title) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${title.replace(/\s+/g, "_")}_Notes.pdf`; // File Name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed", error);
            window.open(url, "_blank");
        }
    };

    if (isLoading || !learningCourse || !activeLesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    const isExamPassed = progressData.isExamPassed;
    const isLessonCompleted = progressData.completedLessons.includes(activeLesson._id);
    const isAllCompleted = progressData.isCompleted;
    const progressPercent = progressData.completionPercentage;
    const hasExam = !!learningCourse.exam;
    const hasNotes = activeLesson.pdfUrl ? true : false;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            <div className="flex-1 overflow-y-auto pb-12">
                <div className="bg-black aspect-video w-full shadow-2xl relative z-10 flex items-center justify-center">
                    <video
                        ref={videoRef}
                        key={activeLesson._id}
                        src={activeLesson.videoUrl}
                        controls
                        autoPlay={shouldAutoPlay.current}
                        onEnded={handleVideoEnded}
                        controlsList="nodownload"
                        className="w-full h-full"
                        style={{ maxHeight: "100%" }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="max-w-4xl mx-auto p-6 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
                            <p className="text-gray-500">Course: {learningCourse.title}</p>
                        </div>

                        <button
                            onClick={handleManualComplete}
                            disabled={isLessonCompleted}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                isLessonCompleted
                                    ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                            }`}
                        >
                            {isLessonCompleted ? (
                                <>
                                    <CheckCircle2 size={20} /> Completed
                                </>
                            ) : (
                                "Mark as Completed"
                            )}
                        </button>
                    </div>

                    {hasNotes && (
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:shadow-md transition-all gap-4">
                                {/* Left Side: Icon & Text */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-50 p-3 rounded-xl">
                                        <File className="text-indigo-600" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Lesson Notes & Resources</h4>
                                        <p className="text-sm text-gray-500">Available in PDF format</p>
                                    </div>
                                </div>

                                {/* Right Side: Action Buttons */}
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {/* 1. View Button */}
                                    <a
                                        href={activeLesson.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                                    >
                                        <Eye size={18} />
                                        View
                                    </a>

                                    {/* 2. Download Button */}
                                    <button
                                        onClick={() => handleDownloadPDF(activeLesson.pdfUrl, activeLesson.title)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                                    >
                                        <Download size={18} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-10">
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            <FileText size={18} className="text-indigo-600" />
                            Lesson Description
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{activeLesson.description}</p>
                    </div>

                    {isAllCompleted ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {hasExam ? (
                                isExamPassed ? (
                                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                                <Award size={48} className="text-yellow-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black">Congratulations! 🎉</h2>
                                                <p className="text-green-100">You have passed the exam and certified.</p>
                                            </div>
                                        </div>

                                        {/* Download Certificate Button (Future Feature) */}
                                        <button
                                            onClick={() => navigate("/user/certificates")}
                                            className="w-full bg-white text-green-700 font-black px-8 py-4 rounded-xl shadow-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2 border border-green-200"
                                        >
                                            <Award size={20} />
                                            VIEW CERTIFICATE
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                                <Award size={48} className="text-yellow-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black">Final Examination</h2>
                                                <p className="text-indigo-100">Ready to certify your skills?</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/user/course/${courseId}/exam`)}
                                            className="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black px-8 py-4 rounded-xl transition-all"
                                        >
                                            TAKE EXAM NOW
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-8 flex items-center gap-4 text-blue-800">
                                    <AlertCircle size={24} />
                                    <div>
                                        <h3 className="font-bold">Course Completed!</h3>
                                        <p className="opacity-80">Course completed successfully.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                            <p className="text-gray-400 italic">
                                Complete all lessons in the sidebar to unlock the final section.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col h-screen">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900 mb-4">Course Content</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500 font-medium">{progressPercent}% Completed</span>
                            <span className="text-indigo-600 font-bold">
                                {progressData.completedLessons.length}/{lessons.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${progressPercent}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {lessons.map((lesson, index) => {
                        const isActive = activeLesson._id === lesson._id;
                        const isDone = progressData.completedLessons.includes(lesson._id);

                        return (
                            <button
                                key={lesson._id}
                                onClick={() => handleLessonChange(lesson)}
                                className={`w-full flex items-start gap-4 p-4 transition-all border-b border-gray-50 text-left ${
                                    isActive ? "bg-indigo-50/50" : "hover:bg-gray-50"
                                }`}
                            >
                                <div className="mt-1">
                                    {isDone ? (
                                        <CheckCircle2 size={20} className="text-green-500" />
                                    ) : isActive ? (
                                        <PlayCircle size={20} className="text-indigo-600" />
                                    ) : (
                                        <Circle size={20} className="text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-bold ${isActive ? "text-indigo-700" : "text-gray-700"}`}>
                                        {index + 1}. {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <PlayCircle size={12} /> {lesson.duration}s
                                        </span>
                                        {isDone && <span className="text-green-600 font-medium">Finished</span>}
                                    </div>
                                </div>
                                {isActive && <ChevronRight size={16} className="text-indigo-600 mt-1" />}
                            </button>
                        );
                    })}

                    <div
                        className={`p-4 flex items-center gap-4 border-b border-gray-50 ${
                            isAllCompleted ? "opacity-100" : "opacity-50"
                        }`}
                    >
                        <Lock size={20} className={isAllCompleted ? "text-indigo-600" : "text-gray-300"} />
                        <div>
                            <h4 className="text-sm font-bold text-gray-700">Final Exam</h4>
                            <p className="text-xs text-gray-400">Unlock after all lessons</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseLearning;
