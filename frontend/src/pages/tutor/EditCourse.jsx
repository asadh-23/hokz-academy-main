import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Image as ImageIcon, DollarSign, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { isNullOrWhitespace } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
// Redux thunks and selectors
import {
    fetchTutorCourseById,
    updateTutorCourse,
    uploadTutorCourseThumbnail,
    selectTutorCourseLoading,
    selectTutorCourseUpdating,
    selectTutorThumbnailUploading,
    selectTutorSelectedCourse,
} from "../../store/features/tutor/tutorCoursesSlice";
import { fetchTutorCategories, selectTutorCategories } from "../../store/features/tutor/tutorCategorySlice";

const EditCourse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: 0,
        offerPercentage: 0,
        description: "",
        thumbnailUrl: null,
        thumbnailKey: null,
    });

    const fileInputRef = useRef(null);

    // Redux selectors
    const loading = useSelector(selectTutorCourseLoading);
    const isUpdating = useSelector(selectTutorCourseUpdating);
    const isUploadingThumbnail = useSelector(selectTutorThumbnailUploading);

    const selectedCourse = useSelector(selectTutorSelectedCourse);
    const categories = useSelector(selectTutorCategories);

    // Fetch course and categories on mount using Redux thunks
    useEffect(() => {
        const loadCourseData = async () => {
            try {
                // Fetch course details
                await dispatch(fetchTutorCourseById(courseId)).unwrap();
            } catch (error) {
                console.log("Failed to load course:", error);
                toast.error(error || "Failed to load course");
            }
        };

        loadCourseData();
    }, [dispatch, courseId]);

    useEffect(() => {
        dispatch(fetchTutorCategories());
    }, [dispatch]);

    // Update form data when course is loaded
    useEffect(() => {
        if (selectedCourse) {
            setFormData({
                title: selectedCourse.title || "",
                category: selectedCourse.category || "",
                price: selectedCourse.price || 0,
                offerPercentage: selectedCourse.offerPercentage || 0,
                description: selectedCourse.description || "",
                thumbnailUrl: selectedCourse.thumbnailUrl || null,
                thumbnailKey: selectedCourse.thumbnailKey || null,
            });
        }
    }, [selectedCourse]);

    // Calculate final price
    const finalPrice = (formData.price - formData.price * (formData.offerPercentage / 100)).toFixed(2);

    const getCategoryName = (id) => {
        const category = categories.find((c) => c._id === id);
        return category ? category.name : "Uncategorized";
    };

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

        // Preview using Blob URL
        setFormData((prev) => ({
            ...prev,
            thumbnailUrl: URL.createObjectURL(file),
        }));

        // Upload to backend using Redux thunk
        const fd = new FormData();
        fd.append("file", file);

        try {
            const result = await dispatch(uploadTutorCourseThumbnail(fd)).unwrap();

            const { fileUrl, fileKey } = result;

            setFormData((prev) => ({
                ...prev,
                thumbnailUrl: fileUrl,
                thumbnailKey: fileKey,
            }));

            toast.success("Thumbnail uploaded successfully");
        } catch (error) {
            console.error("Thumbnail upload error:", error);
            toast.error(error || "Failed to upload thumbnail");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { title, category, price, offerPercentage, description, thumbnailUrl, thumbnailKey } = formData;

        // VALIDATION
        if (isNullOrWhitespace(title)) return toast.error("Course title is required");
        if (isNullOrWhitespace(category)) return toast.error("Please select a category");
        if (isNullOrWhitespace(description)) return toast.error("Course description is required");
        if (!thumbnailUrl) return toast.error("Please upload a course thumbnail");

        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return toast.error("Please enter a valid price");
        }

        const offerNum = isNullOrWhitespace(offerPercentage) ? 0 : Number(offerPercentage);

        if (isNaN(offerNum) || offerNum < 0 || offerNum > 100) {
            return toast.error("Please enter a valid discount percentage (0–100)");
        }

        const payload = {
            title: title.trim(),
            description: description.trim(),
            price: priceNum,
            offerPercentage: offerNum,
            category,
            thumbnailUrl,
            thumbnailKey,
        };

        try {
            // Dispatch Redux thunk instead of direct axios call
            await dispatch(
                updateTutorCourse({
                    courseId,
                    payload,
                })
            ).unwrap();

            toast.success("Course updated successfully");
            navigate("/tutor/courses", { replace: true });
        } catch (error) {
            console.log("Failed to update course:", error);
            toast.error(error || "Failed to update course");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">Loading course...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans text-gray-900">
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-none">Course Manager</h1>
                        <p className="text-xs text-gray-500 mt-1">Editing Mode</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isUpdating || isUploadingThumbnail}
                        className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-lg shadow-indigo-200 ${
                            isUpdating || isUploadingThumbnail
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* General Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                General Information
                            </h2>

                            <div className="space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        disabled={isUpdating}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        disabled={isUpdating}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 bg-white outline-none"
                                    >
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <div className="relative">
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            disabled={isUpdating}
                                            rows="6"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none outline-none"
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                            {formData.description.length} chars
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                Pricing & Offers
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            disabled={isUpdating}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Discount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                    <input
                                        type="number"
                                        name="offerPercentage"
                                        value={formData.offerPercentage}
                                        onChange={handleInputChange}
                                        disabled={isUpdating}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Final Price */}
                            <div className="mt-6 bg-indigo-50 rounded-xl p-4 flex justify-between border border-indigo-100">
                                <span className="text-indigo-900 font-medium">Final Price:</span>
                                <span className="text-2xl font-bold text-indigo-600">${finalPrice}</span>
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                Course Thumbnail
                            </h2>

                            <div
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center 
                                       hover:border-indigo-400 hover:bg-gray-50 transition-all cursor-pointer"
                                onClick={() => !isUploadingThumbnail && fileInputRef.current.click()}
                            >
                                <input
                                    type="file"
                                    id="fileUpload"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isUploadingThumbnail}
                                />

                                {formData.thumbnailUrl ? (
                                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
                                        <img
                                            src={formData.thumbnailUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {isUploadingThumbnail ? (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-medium">Uploading...</span>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <span className="text-white font-medium flex items-center gap-2">
                                                    <UploadCloud size={20} /> Change Image
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-6">
                                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                                            <ImageIcon size={32} />
                                        </div>
                                        <p className="text-gray-900 font-medium">
                                            {isUploadingThumbnail ? "Uploading..." : "Click to upload"}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">JPG, PNG, GIF (Max 10MB)</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Preview) */}
                    <div className="hidden lg:block col-span-1">
                        <div className="sticky top-28">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Live Preview</h3>

                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                {/* Image */}
                                <div className="h-48 bg-gray-200 relative">
                                    {formData.thumbnailUrl ? (
                                        <img
                                            src={formData.thumbnailUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ImageIcon size={40} />
                                        </div>
                                    )}

                                    {formData.offerPercentage > 0 && (
                                        <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                                            {formData.offerPercentage}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                                        {getCategoryName(formData.category)}
                                    </span>

                                    <h3 className="font-bold text-gray-900 mt-3 mb-2 line-clamp-2 h-14 leading-snug">
                                        {formData.title || "Course Title Placeholder"}
                                    </h3>

                                    <p className="text-gray-500 text-xs line-clamp-3 mb-4 h-12">
                                        {formData.description || "Course description preview..."}
                                    </p>

                                    <div className="flex items-center gap-2 border-t pt-4">
                                        <span className="text-xl font-bold text-gray-900">${finalPrice}</span>
                                        {formData.offerPercentage > 0 && (
                                            <span className="text-sm text-gray-400 line-through">${formData.price}</span>
                                        )}
                                    </div>

                                    <button className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 bg-blue-50 rounded-xl p-5 border border-blue-100">
                                <h4 className="text-blue-900 font-semibold text-sm mb-2">Course Tips</h4>
                                <ul className="text-blue-800 text-xs space-y-2 list-disc pl-4">
                                    <li>Use a high-quality thumbnail (1280×720)</li>
                                    <li>Keep the title under 60 characters.</li>
                                    <li>Bullet points convert better.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditCourse;
