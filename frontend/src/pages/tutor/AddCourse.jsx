import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ButtonLoader } from "../../components/common/LoadingSpinner";
import { validateText } from "../../utils/validation";
import { useNavigate } from "react-router-dom";
import { FiImage, FiEdit2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
// Redux thunks and selectors
import {
    createTutorCourse,
    uploadTutorCourseThumbnail,
    selectTutorCourseCreating,
    selectTutorThumbnailUploading,
} from "../../store/features/tutor/tutorCoursesSlice";
import {
    fetchListedCategories,
    selectCategoryLoading,
    selectListedCategories,
} from "../../store/features/public/categorySlice";

const AddCourse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        regularPrice: "",
        offerPercentage: "0",
        description: "",
        thumbnailUrl: null,
        thumbnailKey: null,
    });

    const fileInputRef = useRef(null);

    // Redux selectors
    const categories = useSelector(selectListedCategories);
    const categoriesLoading = useSelector(selectCategoryLoading);
    const isSubmitting = useSelector(selectTutorCourseCreating);
    const isUploadingThumbnail = useSelector(selectTutorThumbnailUploading);

    // Fetch categories on mount using Redux thunk
    useEffect(() => {
        dispatch(fetchListedCategories());
    }, [dispatch]);

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

        const { title, category, regularPrice, offerPercentage, description, thumbnailUrl, thumbnailKey } = formData;

        // 1. TITLE VALIDATION
        const titleValidation = validateText(title, 5, 80, "Course Title");
        if (!titleValidation.isValid) {
            return toast.error(titleValidation.message);
        }

        // 2. CATEGORY CHECK
        if (!category) return toast.error("Please select a category");

        // 3. DESCRIPTION VALIDATION
        const descriptionValidation = validateText(description, 10, 2000, "Description");
        if (!descriptionValidation.isValid) {
            return toast.error(descriptionValidation.message);
        }

        // 4. THUMBNAIL CHECK
        if (!thumbnailUrl) return toast.error("Please upload a course thumbnail");

        // 5. PRICE VALIDATION
        const priceNum = Number(regularPrice);
        if (isNaN(priceNum) || priceNum <= 0 || priceNum > 1000000) {
            return toast.error("Please enter a valid price (1 - 1,000,000)");
        }

        // 6. OFFER PERCENTAGE VALIDATION
        const offerNum = Number(offerPercentage) || 0;
        if (isNaN(offerNum) || offerNum >= 100 || offerNum < 0) {
            return toast.error("Offer percentage must be between 0 and 99");
        }

        try {
            const payload = {
                title: titleValidation.value,
                category,
                regularPrice: priceNum,
                offerPercentage: offerNum,
                description: descriptionValidation.value,
                thumbnailUrl,
                thumbnailKey,
            };

            // Dispatch Redux thunk instead of direct axios call
            const courseId = await dispatch(createTutorCourse(payload)).unwrap();

            toast.success("Course created successfully");

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

            navigate(`/tutor/courses/${courseId}/add-lesson`, { state: { courseTitle: payload.title } });
        } catch (error) {
            console.error("Failed to create course:", error);
            toast.error(error || "Failed to create course");
        }
    };

    return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E2EDE] tracking-tight">
          Add New <span className="text-[#14C4E7]">Course</span>
        </h1>
        <div className="h-1.5 w-20 bg-[#E6D929] mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Form Container */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#FDFDFD] rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-12">
            
            {/* Left Column */}
            <div className="space-y-6">
              {/* Course Title */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2EDE] mb-2 ml-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Advanced Web Development" 
                  className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 transition-all duration-200 placeholder:text-gray-400" 
                  disabled={isSubmitting} 
                />
              </div>

              {/* Course Category */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2EDE] mb-2 ml-1">
                  Course Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 transition-all duration-200 appearance-none cursor-pointer" 
                    disabled={isSubmitting || categoriesLoading} 
                  >
                    <option value=""> 
                      {categoriesLoading ? "Loading categories..." : "Select a category"} 
                    </option> 
                    {categories.map((cat) => ( 
                      <option key={cat._id} value={cat._id}> {cat.name} </option> 
                    ))} 
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#1E2EDE]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Regular Price */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E2EDE] mb-2 ml-1">
                    Regular Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    name="regularPrice" 
                    value={formData.regularPrice} 
                    onChange={handleInputChange} 
                    placeholder="0.00" 
                    min="0" 
                    step="0.01" 
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 transition-all" 
                    disabled={isSubmitting} 
                  />
                </div>

                {/* Offer Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E2EDE] mb-2 ml-1">
                    Offer %
                  </label>
                  <input 
                    type="number" 
                    name="offerPercentage" 
                    value={formData.offerPercentage} 
                    onChange={handleInputChange} 
                    placeholder="Discount" 
                    min="0" 
                    max="100" 
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#E6D929] focus:ring-4 focus:ring-[#E6D929]/10 transition-all" 
                    disabled={isSubmitting} 
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upload Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2EDE] mb-2 ml-1">
                  Upload Thumbnail
                </label>
                <div 
                  onClick={handleImageClick} 
                  className={`group relative border-2 border-dashed rounded-2xl h-52 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
                    ${formData.thumbnailUrl ? 'border-[#14C4E7]' : 'border-gray-300 hover:border-[#14C4E7] hover:bg-[#14C4E7]/5'}`}
                >
                  {formData.thumbnailUrl ? (
                    <div className="w-full h-full relative group">
                      <img 
                        src={formData.thumbnailUrl} 
                        alt="thumbnail preview" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); handleImageClick(); }} 
                          className="bg-white p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform" 
                          disabled={isUploadingThumbnail}
                        >
                          <FiEdit2 className="text-[#1E2EDE] w-5 h-5" />
                        </button>
                      </div>
                      {isUploadingThumbnail && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-[#14C4E7] border-t-transparent rounded-full animate-spin"></div>
                            <span className="mt-2 text-xs font-bold text-[#1E2EDE]">UPLOADING...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <div className="mb-4 bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:bg-[#14C4E7]/20 transition-colors">
                        <FiImage className="w-8 h-8 text-gray-400 group-hover:text-[#14C4E7]" />
                      </div>
                      <p className="text-[#1E2EDE] font-semibold">
                        {isUploadingThumbnail ? "Uploading..." : "Click to select image"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 italic text-wrap">Recommended: 1280x720 (16:9)</p>
                    </div>
                  )}
                </div>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange} 
                  disabled={isUploadingThumbnail} 
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2EDE] mb-2 ml-1">
                  Course Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Provide a detailed overview of what students will learn..." 
                  rows="5" 
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 transition-all resize-none" 
                  disabled={isSubmitting} 
                />
              </div>
            </div>
          </div>

          {/* Submit Button Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
            <button 
              type="submit" 
              disabled={isSubmitting || isUploadingThumbnail} 
              className={`relative px-16 py-4 rounded-xl text-white font-bold tracking-widest transition-all duration-300 shadow-xl overflow-hidden group
                ${isSubmitting || isUploadingThumbnail 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-[#1E2EDE] to-[#14C4E7] hover:shadow-[#14C4E7]/30 hover:scale-[1.02] active:scale-95"
                }`}
            >
              <span className="relative z-10">
                {isSubmitting ? <ButtonLoader text="CREATING..." /> : "CREATE COURSE"}
              </span>
              {!isSubmitting && !isUploadingThumbnail && (
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
};

export default AddCourse;
