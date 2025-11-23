import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { tutorAxios } from "../../api/tutorAxios";
import { ButtonLoader } from "../../components/common/LoadingSpinner";
import { isNullOrWhitespace } from "../../utils/validation";
import { useNavigate } from "react-router-dom";
import { FiImage, FiEdit2 } from "react-icons/fi";

const AddCourse = () => {
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        regularPrice: "",
        offerPercentage: "0",
        description: "",
        thumbnailUrl: null,
        thumbnailKey: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await tutorAxios.get("/categories");
                if (response.data?.success) {
                    setCategories(response.data.categories || []);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image size should be less than 10MB");
            return;
        }

        // Preview using Blob URL (BEST METHOD)
        setFormData((prev) => ({
            ...prev,
            thumbnailUrl: URL.createObjectURL(file),
        }));

        // Upload to backend
        const fd = new FormData();
        fd.append("file", file);

        try {
            const response = await tutorAxios.post("/courses/upload-thumbnail", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (!response.data?.success) {
                return toast.error("Thumbnail upload failed");
            }

            const { fileUrl, fileKey } = response.data;

            setFormData((prev) => ({
                ...prev,
                thumbnailUrl: fileUrl,
                thumbnailKey: fileKey,
            }));

            toast.success("Thumbnail uploaded successfully");
        } catch (error) {
            console.error("Thumbnail upload error:", error);
            toast.error("Failed to upload thumbnail");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { title, category, regularPrice, offerPercentage, description, thumbnailUrl, thumbnailKey } = formData;

        // VALIDATION
        if (isNullOrWhitespace(title)) return toast.error("Course title is required");
        if (isNullOrWhitespace(category)) return toast.error("Please select a category");
        if (isNullOrWhitespace(description)) return toast.error("Course description is required");
        if (!thumbnailUrl) return toast.error("Please upload a course thumbnail");

        const priceNum = Number(regularPrice);
        if (isNaN(priceNum) || priceNum <= 0) {
            return toast.error("Please enter a valid price");
        }

        const offerNum = isNullOrWhitespace(offerPercentage) ? 0 : Number(offerPercentage);

        if (isNaN(offerNum) || offerNum < 0 || offerNum > 100) {
            return toast.error("Please enter a valid discount percentage (0–100)");
        }

        setIsSubmitting(true);

        try {
            // We no longer send the file — only metadata now
            const payload = {
                title: title.trim(),
                category,
                regularPrice: priceNum,
                offerPercentage: offerNum,
                description: description.trim(),
                thumbnailUrl,
                thumbnailKey,
            };

            const response = await tutorAxios.post("/courses", payload);

            if (response.data?.success) {
                toast.success(response.data.message || "Course created successfully");

                setFormData({
                    title: "",
                    category: "",
                    regularPrice: "",
                    offerPercentage: "0",
                    description: "",
                    thumbnailUrl: null,
                    thumbnailKey: null,
                });
                if (fileInputRef.current) fileInputRef.current.value = "";

                navigate(`/tutor/courses/${response.data.courseId}/add-lesson`, { state: { courseTitle: title } });
            }
        } catch (error) {
            console.error("Failed to create course:", error);
            toast.error(error.response?.data?.message || "Failed to create course");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Add New Course</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Course Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter course title"
                                className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Course Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                disabled={isSubmitting}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Regular Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Regular Price <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="regularPrice"
                                value={formData.regularPrice}
                                onChange={handleInputChange}
                                placeholder="Enter price in ₹"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border-2 border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Offer Percentage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Offer Percentage</label>
                            <input
                                type="number"
                                name="offerPercentage"
                                value={formData.offerPercentage}
                                onChange={handleInputChange}
                                placeholder="Enter discount percentage"
                                min="0"
                                max="100"
                                className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Upload Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Thumbnail</label>

                            <div
                                onClick={handleImageClick}
                                className="border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:border-teal-500 transition-colors relative overflow-hidden"
                            >
                                {formData.thumbnailUrl ? (
                                    <div className="w-full h-full relative bg-gray-200">
                                        <img
                                            src={formData.thumbnailUrl}
                                            alt="thumbnail preview"
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />

                                        {/* Change Icon */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleImageClick();
                                            }}
                                            className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md"
                                            title="Change thumbnail"
                                        >
                                            <FiEdit2 className="text-teal-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-6 flex flex-col items-center justify-center h-full">
                                        <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                                        <p className="text-gray-600 font-medium">Upload Thumbnail</p>
                                    </div>
                                )}
                            </div>

                            {/* File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />

                            <p className="text-gray-400 text-sm text-center py-2">
                                {formData.thumbnail ? formData.thumbnail.name : "Click anywhere to upload"}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter course description"
                                rows="8"
                                className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-12 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg transition-all transform ${
                            isSubmitting
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:from-cyan-600 hover:to-teal-700 hover:scale-105 hover:shadow-xl"
                        }`}
                    >
                        {isSubmitting ? <ButtonLoader text="CREATING..." /> : "CREATE COURSE"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCourse;
