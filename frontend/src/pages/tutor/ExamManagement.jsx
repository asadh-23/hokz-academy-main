import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tutorAxios } from "../../api/tutorAxios";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ExamHeader from "../../components/tutor/exam/ExamHeader";
import ExamTabs from "../../components/tutor/exam/ExamTabs";
import ExamDetailsView from "../../components/tutor/exam/ExamDetailsView";
import ExamAnalyticsView from "../../components/tutor/exam/ExamAnalyticsView";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

const ExamManagement = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    // States
    const [activeTab, setActiveTab] = useState("details");
    const [examData, setExamData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Fetch Exam Details & Analytics concurrently
                const [examRes, analyticsRes] = await Promise.allSettled([
                    tutorAxios.get(`/exam/${courseId}`),
                    tutorAxios.get(`/exam/analytics/${courseId}`),
                ]);

                // Handle Exam Data
                if (examRes.status === "fulfilled") {
                    setExamData(examRes.value.data.exam);
                } else {
                    // If exam not found, show create exam option
                    if (examRes.reason.response?.status === 404) {
                        navigate(`/tutor/course/${courseId}/add-exam/`);
                        return;
                    }
                    setError("fetch_error");
                    toast.error("Failed to load exam details");
                }

                // Handle Analytics Data
                if (analyticsRes.status === "fulfilled") {
                    setAnalyticsData(analyticsRes.value.data.data);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setError("fetch_error");
                toast.error("Something went wrong while loading exam data");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [courseId, navigate]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600 font-medium">Loading exam data...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error === "fetch_error") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={48} className="text-red-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
                        <p className="text-gray-600 text-lg mb-8">We couldn't load the exam data. Please try again.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Content
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <ExamHeader examTitle={examData.title} courseId={courseId} />

                {/* TABS NAVIGATION */}
                <ExamTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* CONDITIONAL RENDERING BASED ON TAB */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === "details" ? (
                        <ExamDetailsView exam={examData} />
                    ) : (
                        <ExamAnalyticsView analytics={analyticsData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamManagement;
