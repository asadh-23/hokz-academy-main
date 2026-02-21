import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Image as ImageIcon, DollarSign, UploadCloud } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { validateText } from "../../utils/validation";
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
import { fetchListedCategories, selectListedCategories } from "../../store/features/public/categorySlice";

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
    const categories = useSelector(selectListedCategories);

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
        dispatch(fetchListedCategories());
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

        const titleValidation = validateText(title, 5, 80, "Course title");
        if (!titleValidation.isValid) return toast.error(titleValidation.message || "Course title is required");

        if (!category) return toast.error("Please select a category");

        const descriptionValidation = validateText(description, 10, 2000, "Course Description");
        if (!descriptionValidation.isValid)
            return toast.error(descriptionValidation.message || "Course description is required");

        if (!thumbnailUrl) return toast.error("Please upload a course thumbnail");

        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0 || priceNum > 1000000) {
            return toast.error("Please enter a valid price (1 - 1,000,000)");
        }

        // 6. OFFER PERCENTAGE VALIDATION
        const offerNum = Number(offerPercentage) || 0;
        if (isNaN(offerNum) || offerNum >= 100 || offerNum < 0) {
            return toast.error("Offer percentage must be between 0 and 99");
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
                }),
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
  <div className="min-h-screen bg-[#FDFDFD] pb-12 font-sans text-gray-900">
    {/* Top Navigation Bar */}
    <nav className="sticky top-0 z-50 bg-[#FDFDFD]/80 backdrop-blur-md border-b border-[#14C4E7]/20 px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-[#1E2EDE] p-2.5 rounded-xl text-white shadow-lg shadow-[#1E2EDE]/20">
          <LayoutDashboard size={22} />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#1E2EDE] leading-none tracking-tight">Course Editor</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-[#E6D929] animate-pulse"></span>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Live Editing Mode</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isUpdating || isUploadingThumbnail}
        className={`flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white rounded-full transition-all transform active:scale-95 shadow-xl ${
          isUpdating || isUploadingThumbnail
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-[#1E2EDE] to-[#14C4E7] hover:shadow-[#14C4E7]/40 hover:-translate-y-0.5"
        }`}
      >
        {isUpdating ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            SAVING...
          </span>
        ) : (
          "SAVE CHANGES"
        )}
      </button>
    </nav>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: Editor */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Info Section */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#14C4E7] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#1E2EDE]">General Information</h2>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                  placeholder="Enter a descriptive title"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 transition-all outline-none text-gray-700 font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 appearance-none outline-none text-gray-700 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-[#14C4E7]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    rows="6"
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#14C4E7] focus:ring-4 focus:ring-[#14C4E7]/10 transition-all resize-none outline-none text-gray-700 font-medium"
                  />
                  <div className="absolute bottom-4 right-5 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100 text-[10px] font-bold text-[#14C4E7]">
                    {formData.description.length} CHARACTERS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 sm:p-10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#E6D929] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#1E2EDE]">Pricing & Economics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Base Price (₹)</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1E2EDE]">
                    <DollarSign size={20} />
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#14C4E7] outline-none transition-all font-bold text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Offer Percentage (%)</label>
                <input
                  type="number"
                  name="offerPercentage"
                  value={formData.offerPercentage}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50 focus:bg-white focus:border-[#E6D929] outline-none transition-all font-bold text-lg"
                />
              </div>
            </div>

            <div className="mt-10 bg-gradient-to-br from-[#1E2EDE] to-[#14C4E7] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between text-white shadow-lg shadow-blue-500/20">
              <div className="mb-4 sm:mb-0">
                <p className="text-white/70 text-sm font-bold uppercase tracking-wider">Final Student Price</p>
                <p className="text-xs text-white/50 italic">Calculated automatically after discount</p>
              </div>
              <div className="text-4xl font-black">₹{finalPrice}</div>
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#14C4E7] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#1E2EDE]">Media Assets</h2>
            </div>

            <div
              className={`group relative border-4 border-dashed rounded-[2rem] p-4 text-center transition-all cursor-pointer overflow-hidden
                ${formData.thumbnailUrl ? 'border-[#14C4E7]/30' : 'border-gray-100 hover:border-[#14C4E7] hover:bg-gray-50'}`}
              onClick={() => !isUploadingThumbnail && fileInputRef.current.click()}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} disabled={isUploadingThumbnail} />

              {formData.thumbnailUrl ? (
                <div className="relative w-full h-80 rounded-[1.5rem] overflow-hidden">
                  <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#1E2EDE]/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-4 rounded-full text-[#1E2EDE] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <UploadCloud size={30} />
                    </div>
                    <span className="text-white font-black mt-4 tracking-tighter">CHANGE THUMBNAIL</span>
                  </div>
                  {isUploadingThumbnail && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-[#14C4E7] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-[#1E2EDE] font-bold animate-pulse">UPLOADING...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#14C4E7]/10 text-[#14C4E7] rounded-3xl flex items-center justify-center mb-6 transform group-hover:rotate-12 transition-transform">
                    <ImageIcon size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-[#1E2EDE]">Drop your thumbnail here</h4>
                  <p className="text-gray-400 mt-2 max-w-xs mx-auto">High resolution 16:9 images work best for course engagement</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Preview */}
        <div className="hidden lg:block relative">
          <div className="sticky top-28 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-[#1E2EDE] uppercase tracking-widest">Live Preview</h3>
              <span className="px-2 py-1 bg-[#E6D929]/20 text-[#8b8214] text-[10px] font-black rounded-md">DESKTOP VIEW</span>
            </div>

            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 transition-all duration-500">
              {/* Card Image */}
              <div className="h-56 bg-gray-100 relative group overflow-hidden">
                {formData.thumbnailUrl ? (
                  <img src={formData.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={60} />
                  </div>
                )}
                {formData.offerPercentage > 0 && (
                  <div className="absolute top-4 right-4 bg-[#E6D929] text-[#1E2EDE] text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                    {formData.offerPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-8">
                <span className="text-[10px] font-black text-[#14C4E7] bg-[#14C4E7]/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {getCategoryName(formData.category) || "Uncategorized"}
                </span>

                <h3 className="font-bold text-xl text-[#1E2EDE] mt-4 mb-3 line-clamp-2 leading-tight min-h-[3.5rem]">
                  {formData.title || "Your Course Title Will Appear Here"}
                </h3>

                <p className="text-gray-400 text-sm line-clamp-3 mb-6 min-h-[3rem]">
                  {formData.description || "Start typing your course description to see how it looks to your students..."}
                </p>

                <div className="flex items-center gap-3 border-t border-gray-50 pt-6">
                  <span className="text-3xl font-black text-[#1E2EDE]">₹{finalPrice}</span>
                  {formData.offerPercentage > 0 && (
                    <span className="text-lg text-gray-300 line-through font-bold">₹{formData.price}</span>
                  )}
                </div>

                <button className="w-full mt-8 bg-[#1E2EDE] text-white py-4 rounded-2xl text-sm font-black shadow-lg shadow-blue-900/20 hover:bg-[#14C4E7] transition-colors">
                  ENROLL NOW
                </button>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-gradient-to-br from-[#1E2EDE] to-[#14C4E7] rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/10">
              <h4 className="font-black text-sm mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#E6D929] rounded-full"></div>
                PRO TIPS
              </h4>
              <ul className="text-xs space-y-3 font-medium text-white/80">
                <li className="flex gap-2"><span>•</span> Use actionable titles like "Mastering..."</li>
                <li className="flex gap-2"><span>•</span> Discounts between 10-30% convert best</li>
                <li className="flex gap-2"><span>•</span> Ensure your thumbnail text is readable</li>
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
