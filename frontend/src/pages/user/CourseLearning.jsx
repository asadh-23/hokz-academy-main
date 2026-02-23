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
    MessageCircle,
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
} from "../../store/features/user/courseProgressSlice";

import LoadingSpinner from "../../components/common/LoadingSpinner";

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <LoadingSpinner />
            </div>
        );
    }

    if (!learningCourse || lessons.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <AlertCircle size={48} className="text-gray-400 mb-4" />
                <h2 className="text-xl font-bold">No Lessons Found</h2>
                <p className="text-gray-500">This course doesn't have any published lessons yet.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold">
                    Go Back
                </button>
            </div>
        );
    }

    if (!activeLesson) return <LoadingSpinner />;

    const isExamPassed = progressData.isExamPassed;
    const isLessonCompleted = progressData.completedLessons.includes(activeLesson._id);
    const isAllCompleted = progressData.isCompleted;
    const progressPercent = progressData.completionPercentage;
    const hasExam = !!learningCourse.exam;
    const hasNotes = activeLesson.pdfUrl ? true : false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col lg:flex-row">
            <div className="flex-1 overflow-y-auto pb-12">
                <div className="bg-black aspect-video w-full shadow-2xl relative z-10 flex items-center justify-center">
                    <video
                        ref={videoRef}
                        key={activeLesson._id}
                        src={activeLesson.videoUrl}
                        controls
                        autoPlay={shouldAutoPlay.current}
                        playsInline
                        onEnded={handleVideoEnded}
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-full h-full"
                        style={{ maxHeight: "100%" , backgroundColor: 'black' }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="max-w-5xl mx-auto p-6 md:p-10">
                    {/* Header Section with Title and Action Buttons */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-2">
                                    {activeLesson.title}
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    {learningCourse.title}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                                <button
                                    onClick={() =>
                                        navigate("/user/chat", {
                                            state: { tutorId: learningCourse?.tutor?._id },
                                            replace: true,
                                        })
                                    }
                                    className="group relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <MessageCircle size={20} className="relative z-10" />
                                    <span className="relative z-10">Chat with Tutor</span>
                                </button>

                                <button
                                    onClick={handleManualComplete}
                                    disabled={isLessonCompleted}
                                    className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                                        isLessonCompleted
                                            ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200 cursor-default"
                                            : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg hover:shadow-xl hover:scale-105"
                                    }`}
                                >
                                    {isLessonCompleted ? (
                                        <>
                                            <CheckCircle2 size={20} className="animate-pulse" />
                                            <span>Completed</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} />
                                            <span>Mark as Completed</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {hasNotes && (
                        <div className="mb-6">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    {/* Left Side: Icon & Text */}
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3.5 rounded-xl shadow-lg">
                                            <File className="text-white" size={26} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Lesson Notes & Resources</h4>
                                            <p className="text-sm text-gray-600 mt-0.5">Download or view PDF materials</p>
                                        </div>
                                    </div>

                                    {/* Right Side: Action Buttons */}
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <a
                                            href={activeLesson.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl transition-all shadow-sm hover:shadow-md border border-indigo-200"
                                        >
                                            <Eye size={18} />
                                            View
                                        </a>

                                        <button
                                            onClick={() => handleDownloadPDF(activeLesson.pdfUrl, activeLesson.title)}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <Download size={18} />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 shadow-lg mb-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-gray-900">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <FileText size={20} className="text-indigo-600" />
                            </div>
                            Lesson Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-base">{activeLesson.description}</p>
                    </div>

                    {isAllCompleted ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {hasExam ? (
                                isExamPassed ? (
                                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-emerald-400/30">
                                        <div className="flex items-center gap-5">
                                            <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-md shadow-xl">
                                                <Award size={52} className="text-yellow-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black mb-1">Congratulations! 🎉</h2>
                                                <p className="text-green-100 text-lg">
                                                    You have passed the exam and earned your certificate.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate("/user/certificates")}
                                            className="w-full md:w-auto bg-white text-green-700 font-black px-8 py-4 rounded-xl shadow-xl hover:bg-green-50 transition-all flex items-center justify-center gap-3 border-2 border-green-200 hover:scale-105"
                                        >
                                            <Award size={22} />
                                            VIEW CERTIFICATE
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-indigo-400/30">
                                        <div className="flex items-center gap-5">
                                            <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-md shadow-xl">
                                                <Award size={52} className="text-yellow-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black mb-1">Final Examination</h2>
                                                <p className="text-indigo-100 text-lg">Ready to certify your skills?</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/user/course/${courseId}/exam`)}
                                            className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black px-8 py-4 rounded-xl transition-all shadow-xl hover:scale-105"
                                        >
                                            TAKE EXAM NOW
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-8 flex items-center gap-5 text-blue-900 shadow-lg">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <AlertCircle size={28} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">Course Completed!</h3>
                                        <p className="text-blue-700">You've successfully finished all lessons.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 text-center bg-white/50 backdrop-blur-sm">
                            {hasExam ? <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                <Lock size={28} className="text-gray-400" />
                            </div> : <span></span>}
                            <p className="text-gray-500 font-medium text-lg">
                                {hasExam ? "Complete all lessons to unlock the final section" : "No exam is available for this course at the moment."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm border-l border-gray-200 flex flex-col h-screen shadow-2xl">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <h2 className="font-bold text-gray-900 mb-4 text-lg">Course Content</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-semibold">{progressPercent}% Completed</span>
                            <span className="text-indigo-700 font-bold bg-indigo-100 px-3 py-1 rounded-full">
                                {progressData.completedLessons.length}/{lessons.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                            <div
                                className="bg-gradient-to-r from-indigo-600 to-violet-600 h-3 rounded-full transition-all duration-500 shadow-lg"
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
                                className={`w-full flex items-start gap-4 p-4 transition-all border-b border-gray-100 text-left ${
                                    isActive
                                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-l-indigo-600"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                <div className="mt-1">
                                    {isDone ? (
                                        <CheckCircle2 size={22} className="text-green-500" />
                                    ) : isActive ? (
                                        <PlayCircle size={22} className="text-indigo-600" />
                                    ) : (
                                        <Circle size={22} className="text-gray-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4
                                        className={`text-sm font-bold mb-1 ${isActive ? "text-indigo-700" : "text-gray-700"}`}
                                    >
                                        {index + 1}. {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <PlayCircle size={12} /> {lesson.duration}s
                                        </span>
                                        {isDone && (
                                            <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                                                Finished
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isActive && <ChevronRight size={18} className="text-indigo-600 mt-1" />}
                            </button>
                        );
                    })}

{hasExam ? <div
                        className={`p-4 flex items-center gap-4 border-b border-gray-100 ${
                            isAllCompleted ? "bg-indigo-50" : "opacity-50"
                        }`}
                    >
                        <Lock size={22} className={isAllCompleted ? "text-indigo-600" : "text-gray-300"} />
                        <div>
                            <h4 className="text-sm font-bold text-gray-700">Final Exam</h4>
                            <p className="text-xs text-gray-500">Unlock after all lessons</p>
                        </div>
                    </div>
                    : ""}
                    
                </div>
            </div>
        </div>
    );
};

export default CourseLearning;
