import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Trash2, Save, CheckCircle, Clock, Award, FileText, X, RotateCcw, ArrowLeft } from "lucide-react";
import { tutorAxios } from "../../api/tutorAxios"; // Use your axios instance
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditExam = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Initial State
    const [examData, setExamData] = useState({
        title: "",
        description: "",
        passingScore: 70,
        timeLimit: 30,
        maxAttempts: 3,
    });

    const [questions, setQuestions] = useState([]);

    // ✅ 1. Fetch Existing Exam Data
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await tutorAxios.get(`/exam/${courseId}`);
                const data = response.data.exam;

                // Populate State
                setExamData({
                    title: data.title,
                    description: data.description,
                    passingScore: data.settings.passingScore,
                    timeLimit: data.settings.timeLimit,
                    maxAttempts: data.settings.maxAttempts || 3
                });
                setQuestions(data.questions);
            } catch (error) {
                toast.error("Failed to fetch exam details");
                navigate(`/tutor/exam-management/${courseId}`);
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [courseId, navigate]);

    // --- Handlers (Same as AddExam) ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExamData({ ...examData, [name]: value });
    };

    const addNewQuestion = () => {
        setQuestions([
            ...questions,
            { question: "", options: ["", ""], correctAnswer: 0, points: 1 }
        ]);
    };

    const removeQuestion = (index) => {
        if (questions.length === 1) {
            toast.error("At least one question is required!");
            return;
        }
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleQuestionTextChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionTextChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].options.length >= 5) {
            toast.error("Maximum 5 options allowed.");
            return;
        }
        updatedQuestions[qIndex].options.push("");
        setQuestions(updatedQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].options.length <= 2) {
            toast.error("Minimum 2 options required.");
            return;
        }
        updatedQuestions[qIndex].options.splice(oIndex, 1);
        if (updatedQuestions[qIndex].correctAnswer >= oIndex) {
             updatedQuestions[qIndex].correctAnswer = Math.max(0, updatedQuestions[qIndex].correctAnswer - 1);
        }
        setQuestions(updatedQuestions);
    };

    const setCorrectAnswer = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].correctAnswer = oIndex;
        setQuestions(updatedQuestions);
    };

    // --- ✅ UPDATE EXAM ---
    const handleUpdate = async () => {
        // Validation
        if (!examData.title || !examData.description) {
            toast.error("Please fill exam title and description.");
            return;
        }
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].question.trim()) {
                toast.error(`Question ${i + 1} is empty!`);
                return;
            }
            if (questions[i].options.some(opt => !opt.trim())) {
                toast.error(`Some options in Question ${i + 1} are empty!`);
                return;
            }
        }

        setSubmitting(true);
        try {
            const payload = {
                title: examData.title,
                description: examData.description,
                settings: {
                    passingScore: Number(examData.passingScore),
                    timeLimit: Number(examData.timeLimit),
                    maxAttempts: Number(examData.maxAttempts),
                },
                questions: questions.map(q => ({
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    points: Number(q.points)
                }))
            };

            // ✅ PUT Request
            const response = await tutorAxios.put(`/exam/update/${courseId}`, payload);
            
            if (response.data.success) {
                toast.success("Exam updated successfully!");
                navigate(`/tutor/course/${courseId}/manage-exam`);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update exam");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                
                {/* Header with Back Button */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <button 
                            onClick={() => navigate(-1)} 
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-2 transition-colors"
                        >
                            <ArrowLeft size={20} /> Back
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Exam</h1>
                        <p className="text-gray-500 mt-1">Modify questions and settings.</p>
                    </div>
                </div>

                {/* --- Form Starts (Same UI as AddExam) --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-800">
                        <FileText size={20} className="text-indigo-600"/> Exam Details
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title</label>
                            <input type="text" name="title" value={examData.title} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={examData.description} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                            <div className="relative">
                                <Award size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                <input type="number" name="passingScore" value={examData.passingScore} onChange={handleInputChange} className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (Minutes)</label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                <input type="number" name="timeLimit" value={examData.timeLimit} onChange={handleInputChange} className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
                            <div className="relative">
                                <RotateCcw size={18} className="absolute left-3 top-3.5 text-gray-400" />
                                <input type="number" name="maxAttempts" value={examData.maxAttempts} onChange={handleInputChange} min="1" max="100" className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Builder */}
                <div className="space-y-6">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative group">
                            <button onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                            <div className="mb-4 pr-10">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Question {qIndex + 1}</label>
                                <input type="text" value={q.question} onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" />
                            </div>

                            <div className="space-y-3 mb-4">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Options (Select correct answer)</label>
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-3">
                                        <button onClick={() => setCorrectAnswer(qIndex, oIndex)} className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${q.correctAnswer === oIndex ? "border-green-500 bg-green-500 text-white" : "border-gray-300 hover:border-green-400"}`}>
                                            {q.correctAnswer === oIndex && <CheckCircle size={14} />}
                                        </button>
                                        <input type="text" value={opt} onChange={(e) => handleOptionTextChange(qIndex, oIndex, e.target.value)} className={`flex-1 p-2 px-4 border rounded-lg outline-none focus:border-indigo-500 ${q.correctAnswer === oIndex ? "bg-green-50 border-green-200 text-green-800" : "bg-white border-gray-200"}`} />
                                        {q.options.length > 2 && (<button onClick={() => removeOption(qIndex, oIndex)} className="text-gray-300 hover:text-red-500"><X size={16} /></button>)}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                <button onClick={() => addOption(qIndex)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><Plus size={16} /> Add Option</button>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Points:</span>
                                    <input type="number" min="1" value={q.points} onChange={(e) => { const updated = [...questions]; updated[qIndex].points = e.target.value; setQuestions(updated); }} className="w-16 p-1 pl-3 border border-gray-200 rounded-lg text-center font-bold text-gray-700" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center">
                    <button onClick={addNewQuestion} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"><Plus size={20} /> Add Another Question</button>
                </div>

                <div className="mt-12 sticky bottom-6 z-20">
                    <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium">Total Questions: {questions.length}</p>
                            <p className="font-bold text-lg">Ready to update?</p>
                        </div>
                        <button onClick={handleUpdate} disabled={submitting} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? "Updating..." : <><Save size={20} /> Update Exam</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditExam;