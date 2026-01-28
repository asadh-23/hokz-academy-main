import { Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ExamHeader = ({ examTitle, courseId }) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/tutor/courses");
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={handleGoBack} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{examTitle}</h1>
                        <p className="text-gray-600 text-lg">Manage final assessment and view student performance</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/tutor/course/${courseId}/edit-exam`)}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        <Edit size={20} />
                        Edit Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamHeader;
