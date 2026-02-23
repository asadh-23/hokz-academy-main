import { useState, useRef, useEffect } from "react";
import { FiPlay, FiImage, FiEdit2, FiArrowLeft } from "react-icons/fi";
import { tutorAxios } from "../../api/tutorAxios";
import { toast } from "sonner";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AiFillFilePdf } from "react-icons/ai";
import { validateText } from "../../utils/validation";
import LessonsList from "../../components/tutor/LessonsList";

const AddLesson = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const courseTitle = location.state?.courseTitle || "";
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileUploading, setfileUploading] = useState({
        video: false,
        thumbnail: false,
        pdfNotes: false,
    });

    // file input refs so we can clear them programmatically
    const videoInputRef = useRef(null);
    const pdfInputRef = useRef(null);
    const thumbInputRef = useRef(null);

    const [lessonForm, setLessonForm] = useState({
        title: "",
        description: "",

        // VIDEO
        videoUrl: "",
        videoKey: "",
        duration: 0,

        // THUMBNAIL
        thumbnailUrl: "",
        thumbnailKey: "",

        // PDF
        pdfUrl: null,
        pdfKey: null,
    });

    const [lessons, setLessons] = useState([]);
    const [editingLessonId, setEditingLessonId] = useState(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await tutorAxios.get(`/lessons/courses/${courseId}/lessons`);

                if (!response.data?.success) {
                    toast.error("Failed to load lessons");
                    return;
                }

                const lessons = response.data.lessons || [];

                const transformed = lessons.map(({ _id, ...rest }) => ({
                    id: _id,
                    ...rest,
                }));

                setLessons(transformed);
            } catch (error) {
                console.error("Failed to load existing lessons:", error);
                toast.error(error.response?.data?.message || "Failed to load existing lessons");
            }
        };

        fetchLessons();
    }, [courseId]);

    // Input handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLessonForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setfileUploading((prev) => ({ ...prev, [fieldName]: true }));

        if (fieldName === "pdfNotes" && file.type !== "application/pdf")
            return toast.error("Please upload a valid PDF file");

        if (fieldName === "thumbnail" && !file.type.startsWith("image/"))
            return toast.error("Please upload a valid image file");

        if (fieldName === "video" && !file.type.startsWith("video/"))
            return toast.error("Please upload a valid video file");

        const localURL = URL.createObjectURL(file);
        if (fieldName === "video") setLessonForm((prev) => ({ ...prev, videoUrl: localURL }));
        if (fieldName === "thumbnail") setLessonForm((prev) => ({ ...prev, thumbnailUrl: localURL }));
        if (fieldName === "pdfNotes") setLessonForm((prev) => ({ ...prev, pdfUrl: file.name }));

        // duration calculation
        if (fieldName === "video") {
            const temp = document.createElement("video");
            temp.preload = "metadata";

            temp.onloadedmetadata = () => {
                const duration = Math.floor(temp.duration);
                setLessonForm((prev) => ({ ...prev, duration }));
            };

            temp.src = URL.createObjectURL(file);
        }

        // UPLOAD TO BACKEND
        const fd = new FormData();
        fd.append("type", fieldName);
        fd.append("file", file);

        try {
            const response = await tutorAxios.post("/lessons/upload/lesson-file", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data?.success) {
                const { fileUrl, fileKey } = response.data;

                setLessonForm((prev) => ({
                    ...prev,
                    ...(fieldName === "video" && { videoUrl: fileUrl, videoKey: fileKey }),
                    ...(fieldName === "thumbnail" && { thumbnailUrl: fileUrl, thumbnailKey: fileKey }),
                    ...(fieldName === "pdfNotes" && { pdfUrl: fileUrl, pdfKey: fileKey }),
                }));

                toast.success(`${fieldName} uploaded successfully`);
            }
        } catch (error) {
            console.error("File upload error:", error);
            toast.error("Failed to upload file");
        } finally {
            setfileUploading((prev) => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleAddLesson = async () => {
        const titleValidation = validateText(lessonForm.title, 5, 80, "Lesson Title");
        if (!titleValidation.isValid) {
            return toast.error(titleValidation.message || "Enter a valid lesson title");
        }
        const descriptionValidation = validateText(lessonForm.description, 5, 1000, "Lesson description");
        if (!descriptionValidation.isValid) {
            return toast.error(descriptionValidation.message || "Enter a valid Lesson Description");
        }
        if (!lessonForm.videoUrl) return toast.error("Please upload a lesson video");
        if (!lessonForm.thumbnailUrl) return toast.error("Please upload a lesson thumbnail");

        setIsSubmitting(true);

        try {
            const payload = {
                ...lessonForm,
                title: titleValidation.value,
                description: descriptionValidation.value,
            };

            const response = await tutorAxios.post(`/lessons/courses/${courseId}/lesson`, payload);

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Failed to save lesson");
            }

            toast.success(response.data.message || `${payload.title} saved successfully`);

            // add to UI list
            setLessons((prev) => [...prev, response.data.lesson]);

            // clear form
            setLessonForm({
                title: "",
                description: "",

                videoUrl: "",
                videoKey: "",
                duration: 0,

                thumbnailUrl: "",
                thumbnailKey: "",

                pdfUrl: null,
                pdfKey: null,
            });

            if (videoInputRef.current) videoInputRef.current.value = "";
            if (pdfInputRef.current) pdfInputRef.current.value = "";
            if (thumbInputRef.current) thumbInputRef.current.value = "";
        } catch (error) {
            console.error("Lesson save error:", error);
            toast.error(error.response?.data?.message || "Failed to save lesson");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditLesson = (lesson) => {
        setLessonForm({
            title: lesson.title,
            description: lesson.description,

            videoUrl: lesson.videoUrl,
            videoKey: lesson.videoKey,
            duration: lesson.duration,

            thumbnailUrl: lesson.thumbnailUrl,
            thumbnailKey: lesson.thumbnailKey,

            pdfUrl: lesson.pdfUrl || null,
            pdfKey: lesson.pdfKey || null,
        });

        setEditingLessonId(lesson.id);
    };

    const handleUpdateLesson = async () => {
        const titleValidation = validateText(lessonForm.title, 5, 70, "Lesson title");
        if (!titleValidation.isValid) return toast.error(titleValidation.message || "Lesson title is required");

        const lessonDescriptionValidation = validateText(lessonForm.description, 10, 1000, "Lesson description");
        if (!lessonDescriptionValidation.isValid)
            return toast.error(lessonDescriptionValidation.message || "Lesson description is required");

        try {
            const payload = {
                ...lessonForm,
                title: titleValidation.value,
                description: lessonDescriptionValidation.value,
            };

            const response = await tutorAxios.put(`/lessons/${editingLessonId}`, payload);

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Update failed");
            }

            toast.success(response.data.message || "Lesson updated successfully");

            // update lesson in UI
            setLessons((prev) =>
                prev.map((l) => (l.id === editingLessonId ? { id: editingLessonId, ...response.data.lesson } : l)),
            );

            // clear form
            setEditingLessonId(null);
            setLessonForm({
                title: "",
                description: "",
                videoUrl: "",
                videoKey: "",
                duration: 0,
                thumbnailUrl: "",
                thumbnailKey: "",
                pdfUrl: null,
                pdfKey: null,
            });
        } catch (error) {
            console.error("Lesson update error:", error);
            toast.error(error.response?.data?.message || "Failed to update lesson");
        }
    };

    const handleRemoveLesson = async (lessonId) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return;

        try {
            const response = await tutorAxios.delete(`/lessons/${lessonId}`);

            if (!response.data?.success) {
                return toast.error(response.data.message || "Failed to delete lesson");
            }

            toast.success(response.data.message || "Lesson deleted successfully");
            setLessonForm({
                title: "",
                description: "",

                // VIDEO
                videoUrl: "",
                videoKey: "",
                duration: 0,

                // THUMBNAIL
                thumbnailUrl: "",
                thumbnailKey: "",

                // PDF
                pdfUrl: null,
                pdfKey: null,
            });
            // Remove from UI state
            setLessons((prev) => prev.filter((l) => l.id !== lessonId));
        } catch (error) {
            console.error("Delete lesson error:", error);
            toast.error(err.response?.data?.message || "Failed to delete lesson");
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#14C4E7]/10 via-[#FDFDFD] to-[#1E2EDE]/5 p-4 md:p-8">
            <div className="mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-500 hover:text-[#1E2EDE] transition-all duration-300 font-bold text-sm uppercase tracking-widest"
                >
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-[#1E2EDE] group-hover:text-white transition-all duration-300">
                        <FiArrowLeft size={18} />
                    </div>
                    <span>Back to <span className="text-gray-400 group-hover:text-[#1E2EDE]/70">{courseTitle || 'Course'}</span></span>
                </button>
            </div>
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-[#1E2EDE] uppercase bg-[#14C4E7]/10 rounded-full">
                        Course Management
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Update / Add New <span className="text-[#1E2EDE]">Lesson</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Updating content for <span className="text-[#14C4E7] font-semibold">{courseTitle}</span>
                    </p>
                    <div className="mt-4 flex justify-center gap-1">
                        <div className="h-1.5 w-12 bg-[#E6D929] rounded-full"></div>
                        <div className="h-1.5 w-4 bg-[#14C4E7] rounded-full"></div>
                    </div>
                </div>

                {/* Form Section */}
                <div
                    className={`transition-all duration-500 ${isSubmitting ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                >
                    <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(30,46,222,0.1)] border border-gray-100 overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Side: Inputs */}
                            <div className="flex-1 p-8 md:p-12 space-y-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                            Lesson Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={lessonForm.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Master the Fundamentals"
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 outline-none transition-all font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                            Detailed Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={lessonForm.description}
                                            onChange={handleInputChange}
                                            placeholder="Explain what students will achieve in this lesson..."
                                            rows="6"
                                            className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 outline-none transition-all resize-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Media Uploads */}
                            <div className="flex-1 p-8 md:p-12 bg-gray-50/50 space-y-8">
                                {/* Video Upload Section */}
                                <div className="relative">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Lesson Video</label>
                                    <div
                                        className={`relative group border-2 border-dashed rounded-[1.5rem] transition-all duration-300 min-h-[180px] flex flex-col items-center justify-center overflow-hidden
                                    ${fileUploading.video ? "border-[#E6D929] bg-[#E6D929]/5" : "border-gray-300 hover:border-[#14C4E7] bg-white"}`}
                                    >
                                        {fileUploading.video ? (
                                            <div className="flex flex-col items-center animate-pulse text-[#E6D929]">
                                                <div className="w-12 h-12 border-4 border-t-transparent border-[#E6D929] rounded-full animate-spin mb-3"></div>
                                                <p className="font-bold">Uploading Video...</p>
                                            </div>
                                        ) : lessonForm.videoUrl ? (
                                            <div className="w-full h-48 relative bg-black">
                                                <video
                                                    src={lessonForm.videoUrl}
                                                    className="w-full h-full object-contain"
                                                    controls
                                                />
                                                <button
                                                    onClick={() => videoInputRef.current?.click()}
                                                    className="absolute top-3 right-3 p-2 bg-white rounded-xl shadow-lg hover:text-[#14C4E7] transition-colors"
                                                >
                                                    <FiEdit2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => videoInputRef.current?.click()}
                                                className="p-8 text-center w-full"
                                            >
                                                <FiPlay className="mx-auto w-12 h-12 text-[#14C4E7] mb-3 group-hover:scale-110 transition-transform" />
                                                <p className="font-bold text-gray-600">Click to Upload MP4</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Recommended: 1080p High Quality
                                                </p>
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e, "video")}
                                        className="hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* PDF Upload Section */}
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                                            Study Notes
                                        </label>
                                        <div
                                            className={`relative h-32 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center
                                        ${fileUploading.pdfNotes ? "border-[#E6D929] bg-[#E6D929]/5" : "border-gray-300 bg-white hover:border-[#14C4E7]"}`}
                                        >
                                            {fileUploading.pdfNotes ? (
                                                <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-[#E6D929] rounded-full"></div>
                                            ) : lessonForm.pdfUrl ? (
                                                <div className="text-center group">
                                                    <AiFillFilePdf className="w-10 h-10 text-red-500 mx-auto" />
                                                    <button
                                                        onClick={() => pdfInputRef.current?.click()}
                                                        className="text-[10px] font-bold text-[#14C4E7] mt-1 underline"
                                                    >
                                                        Change PDF
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => pdfInputRef.current?.click()}
                                                    className="text-center w-full h-full"
                                                >
                                                    <AiFillFilePdf className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                                    <span className="text-xs font-bold text-gray-500">Add PDF</span>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={pdfInputRef}
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileChange(e, "pdfNotes")}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Thumbnail Upload Section */}
                                    <div className="relative">
                                        <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                                            Lesson Cover
                                        </label>
                                        <div
                                            className={`relative h-32 rounded-2xl border-2 border-dashed overflow-hidden transition-all flex flex-col items-center justify-center
                                        ${fileUploading.thumbnail ? "border-[#E6D929] bg-[#E6D929]/5" : "border-gray-300 bg-white hover:border-[#14C4E7]"}`}
                                        >
                                            {fileUploading.thumbnail ? (
                                                <div className="animate-spin w-8 h-8 border-4 border-t-transparent border-[#E6D929] rounded-full"></div>
                                            ) : lessonForm.thumbnailUrl ? (
                                                <div className="relative w-full h-full group">
                                                    <img
                                                        src={lessonForm.thumbnailUrl}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            onClick={() => thumbInputRef.current?.click()}
                                                            className="p-2 bg-white rounded-lg text-black"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => thumbInputRef.current?.click()}
                                                    className="text-center w-full h-full"
                                                >
                                                    <FiImage className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                                                    <span className="text-xs font-bold text-gray-500">Add Image</span>
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={thumbInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, "thumbnail")}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button Area */}
                        <div className="p-8 bg-white flex justify-center">
                            <button
                                onClick={editingLessonId ? handleUpdateLesson : handleAddLesson}
                                disabled={isSubmitting || Object.values(fileUploading).some(Boolean)}
                                className={`
                                relative overflow-hidden group px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3
                                ${
                                    isSubmitting || Object.values(fileUploading).some(Boolean)
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#1E2EDE] to-[#14C4E7] text-white shadow-[0_10px_30px_rgba(30,46,222,0.3)] hover:shadow-[0_15px_35px_rgba(30,46,222,0.4)] hover:-translate-y-1 active:scale-95"
                                }
                            `}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving Lesson...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-2xl leading-none">+</span>
                                        <span>{editingLessonId ? "Update Lesson" : "Add Lesson"}</span>
                                    </>
                                )}
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lesson List Container */}
                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Current Curriculum</h2>
                        <div className="h-1 flex-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full"></div>
                    </div>
                   <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-0 md:p-2 border border-gray-100">
                        <LessonsList
                            lessons={lessons}
                            onEditLesson={handleEditLesson}
                            onRemoveLesson={handleRemoveLesson}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes shine {
                    100% {
                        left: 125%;
                    }
                }
                .animate-shine {
                    animation: shine 0.75s;
                }
            `}</style>
        </div>
    );
};

export default AddLesson;
