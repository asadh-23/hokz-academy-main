import { useState, useRef, useEffect } from "react";
import { FiPlay, FiImage, FiEdit2 } from "react-icons/fi";
import { tutorAxios } from "../../api/tutorAxios";
import { toast } from "sonner";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AiFillFilePdf } from "react-icons/ai";
import { isNullOrWhitespace } from "../../utils/validation";
import LessonsList from "../../components/tutor/LessonsList";

const AddLesson = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const courseTitle = location.state?.courseTitle || "";
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);

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
                const response = await tutorAxios.get(`/courses/${courseId}/lessons`);

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

        // VALIDATION
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
        }
    };

    const handleAddLesson = async () => {
        if (isNullOrWhitespace(lessonForm.title)) return toast.error("Lesson title is required");
        if (isNullOrWhitespace(lessonForm.description)) return toast.error("Lesson description is required");
        if (!lessonForm.videoUrl) return toast.error("Please upload a lesson video");
        if (!lessonForm.thumbnailUrl) return toast.error("Please upload a lesson thumbnail");

        setIsSubmitting(true);

        try {
            const payload = {
                ...lessonForm,
                title: lessonForm.title.trim(),
                description: lessonForm.description.trim(),
            };

            const response = await tutorAxios.post(`/courses/${courseId}/lesson`, payload);

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
        if (isNullOrWhitespace(lessonForm.title)) return toast.error("Lesson title is required");
        if (isNullOrWhitespace(lessonForm.description)) return toast.error("Lesson description is required");

        try {
            const payload = {
                ...lessonForm,
                title: lessonForm.title.trim(),
                description: lessonForm.description.trim(),
            };

            const response = await tutorAxios.put(`/lessons/${editingLessonId}`, payload);

            if (!response.data?.success) {
                throw new Error(response.data?.message || "Update failed");
            }

            toast.success(response.data.message || "Lesson updated successfully");

            // update lesson in UI
            setLessons((prev) =>
                prev.map((l) => (l.id === editingLessonId ? { id: editingLessonId, ...response.data.lesson } : l))
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
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Add New Lesson</h1>
                    <p className="text-gray-600 mt-2">for {courseTitle}</p>
                </div>

                {/* Add Lesson Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Lesson Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={lessonForm.title}
                                    onChange={handleInputChange}
                                    placeholder="Introduction"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Lesson Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Description</label>
                                <textarea
                                    name="description"
                                    value={lessonForm.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter detailed lesson description"
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none outline-none"
                                />
                            </div>

                            {/* Upload Video (updated) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video</label>

                                <label htmlFor="video-upload" className="cursor-pointer block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 hover:border-teal-400 transition-colors relative">
                                        {lessonForm.videoUrl ? (
                                            <div className="w-full h-48 relative overflow-hidden rounded-t-lg bg-black">
                                                {/* Video fills entire box */}
                                                <video
                                                    src={lessonForm.videoUrl}
                                                    controls
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                />

                                                {/* Change icon */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        videoInputRef.current?.click();
                                                    }}
                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md"
                                                    title="Change video"
                                                >
                                                    <FiEdit2 className="text-teal-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-6 flex flex-col items-center justify-center">
                                                <FiPlay className="w-12 h-12 text-teal-500 mb-2" />
                                                <p className="text-teal-600 font-medium">Upload Video</p>
                                            </div>
                                        )}
                                        <p className="text-gray-400 text-sm text-center py-2">Click anywhere to upload</p>
                                    </div>
                                </label>

                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileChange(e, "video")}
                                    className="hidden"
                                    id="video-upload"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Upload PDF notes (updated) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Notes</label>

                                <label htmlFor="pdf-upload" className="cursor-pointer block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 hover:border-teal-400 transition-colors relative">
                                        {lessonForm.pdfUrl ? (
                                            <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 rounded-t-lg relative">
                                                {/* REAL PDF ICON */}
                                                <AiFillFilePdf className="w-14 h-14 text-red-600 mb-2" />

                                                {/* Edit Button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        pdfInputRef.current?.click();
                                                    }}
                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md"
                                                    title="Change PDF"
                                                >
                                                    <FiEdit2 className="text-teal-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-6 flex flex-col items-center justify-center">
                                                <AiFillFilePdf className="w-14 h-14 text-gray-400 mb-2" />
                                                <p className="text-teal-600 font-medium">Upload PDF</p>
                                            </div>
                                        )}

                                        <p className="text-gray-400 text-sm text-center py-2">Click anywhere to upload</p>
                                    </div>
                                </label>

                                <input
                                    ref={pdfInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(e, "pdfNotes")}
                                    className="hidden"
                                    id="pdf-upload"
                                />
                            </div>

                            {/* Upload Thumbnail (updated) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Thumbnail</label>

                                <label htmlFor="thumbnail-upload" className="cursor-pointer block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-0 hover:border-teal-400 transition-colors relative">
                                        {lessonForm.thumbnailUrl ? (
                                            <div className="w-full h-48 relative overflow-hidden rounded-t-lg bg-gray-200">
                                                <img
                                                    src={lessonForm.thumbnailUrl}
                                                    alt="thumbnail"
                                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                                />

                                                {/* Change Icon */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        thumbInputRef.current?.click();
                                                    }}
                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md"
                                                    title="Change thumbnail"
                                                >
                                                    <FiEdit2 className="text-teal-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-6 flex flex-col items-center justify-center">
                                                <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                                                <p className="text-gray-600 font-medium">Upload Thumbnail</p>
                                            </div>
                                        )}

                                        <p className="text-gray-400 text-sm text-center py-2">Click anywhere to upload</p>
                                    </div>
                                </label>

                                <input
                                    ref={thumbInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "thumbnail")}
                                    className="hidden"
                                    id="thumbnail-upload"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add Lesson Button */}
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={editingLessonId ? handleUpdateLesson : handleAddLesson}
                            className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                        >
                            + {editingLessonId !== null ? "Update Lesson" : "Add Lesson"}
                        </button>
                    </div>
                </div>

                {/* Lessons List */}
                <LessonsList lessons={lessons} onEditLesson={handleEditLesson} onRemoveLesson={handleRemoveLesson} />
            </div>
        </div>
    );
};

export default AddLesson;
