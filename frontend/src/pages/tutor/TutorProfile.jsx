import React, { useState, useEffect, useRef } from "react";
import TutorHeader from "../../components/tutor/TutorHeader";
import TutorSidebar from "../../components/tutor/TutorSidebar";
import TutorFooter from "../../components/tutor/TutorFooter";
import ChangeEmailModal from "../../components/auth/ChangeEmailModal";
import ChangePasswordModal from "../../components/auth/ChangePasswordModal";
import { tutorAxios } from "../../api/tutorAxios";
import { toast } from "sonner";
import { PageLoader, ButtonLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { isNullOrWhitespace, validatePhone } from "../../utils/validation";
import { useDispatch } from "react-redux";
import { updateUserData } from "../../store/features/auth/authSlice";

const TutorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        profileImage: null,
        headline: "",
        expertiseArea: "",
        bio: "",
        yearsOfExperience: "",
        skills: [],
        languages: [],
        qualifications: [],
    });

    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // Saving text fields
    const [isUploading, setIsUploading] = useState(false); // Uploading image

    const dispatch = useDispatch();

    // ✅ Ref for the hidden file input
    const fileInputRef = useRef(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await tutorAxios.get("/profile");
                if (response.data?.success) {
                    const fetchedData = response.data.tutor;
                    const data = {
                        fullName: fetchedData.fullName,
                        email: fetchedData.email,
                        phone: fetchedData.phone,
                        profileImage: fetchedData.profileImage,
                        headline: fetchedData.headline,
                        expertiseArea: fetchedData.expertiseArea,
                        bio: fetchedData.bio,
                        yearsOfExperience: fetchedData.yearsOfExperience,
                        skills: fetchedData.skills || [],
                        languages: fetchedData.languages || [],
                        qualifications: fetchedData.qualifications || [],
                    };
                    setProfileData(data);
                    setOriginalData(data);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Could not load tutor profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (field, value) => {
        const arrayFields = ["skills", "languages", "qualifications"];

        if (arrayFields.includes(field)) {
            const newArray = value.split(",").map((s) => s.trim());

            setProfileData((prev) => ({
                ...prev,
                [field]: newArray,
            }));
        } else {
            setProfileData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    // ✅ Handle image file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Directly trigger upload after selection
            handleImageUpload(file);
        }
        // Reset file input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ✅ Function to upload the image file
    const handleImageUpload = async (file) => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("profileImageFile", file);

        try {
            const response = await tutorAxios.post("/profile/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Assuming backend returns { success: true, imageUrl: '...' }
            const newImageUrl = response.data.imageUrl;

            if (!newImageUrl) {
                throw new Error("Backend did not return a valid image URL.");
            }

            setProfileData((prev) => ({ ...prev, profileImage: newImageUrl }));

            dispatch(updateUserData({ profileImage: newImageUrl }));

            setOriginalData((prev) => ({ ...prev, profileImage: newImageUrl }));

            toast.success("Profile image updated successfully");
        } catch (error) {
            console.error("Image upload failed :", error);
            toast.error(error.response?.data?.message || "Image upload failed. Please try again.");
            if (originalData) {
                // Revert to last known good URL
                setProfileData((prev) => ({ ...prev, profileImage: originalData.profileImage }));
            }
        } finally {
            setIsUploading(false); // Stop upload indicator
        }
    };

    // ✅ Function to trigger hidden file input click
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };
    const handleCancel = () => {
        // 1. "Backup copy"-il (`originalData`) ninnu data thirichu
        //    "Working copy"-yilekku (`profileData`) set cheyyunnu.
        if (originalData) {
            setProfileData(originalData);
        }
        // 2. Edit mode off aakkunnu.
        setIsEditing(false);
    };

    const handleSaveChanges = async () => {
        if (isNullOrWhitespace(profileData.fullName)) {
            return toast.error("Full name is required");
        }

        const phonValidation = validatePhone(profileData.phone);
        if (!phonValidation.isValid) {
            return toast.error(phonValidation.message || "Enter a valid phone number");
        }

        setIsSaving(true);

        try {
            const { email, profileImage, ...editableFields } = profileData;

            const updatePayload = {
                ...editableFields,

                skills: editableFields.skills.filter((s) => s && s.trim() !== ""),
                languages: editableFields.languages.filter((l) => l && l.trim() !== ""),
                qualifications: editableFields.qualifications.filter((q) => q && q.trim() !== ""),
            };

            // --- 4. API CALL ---
            const response = await tutorAxios.put("/profile", updatePayload);
            const savedData = response.data.tutor;

            const dataToSet = {
                ...profileData,
                fullName: savedData.fullName || "",
                phone: savedData.phone || "",
                headline: savedData.headline || "",
                expertiseArea: savedData.expertiseArea || "",
                bio: savedData.bio || "",
                yearsOfExperience: savedData.yearsOfExperience || "",
                skills: savedData.skills || [],
                languages: savedData.languages || [],
                qualifications: savedData.qualifications || [],
            };

            // --- 6. UPDATE ALL STATES ---
            setProfileData(dataToSet);
            setOriginalData(dataToSet); // Update backup

            // Dispatch ONLY relevant data to authSlice
            dispatch(updateUserData({ fullName: dataToSet.fullName, phone: dataToSet.phone }));

            setIsEditing(false); // Exit edit mode
            toast.success("Profile details updated successfully!");
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(error.response?.data?.message || "Profile update failed.");

            if (originalData) {
                setProfileData(originalData);
            }
        } finally {
            setIsSaving(false);
        }
    };

    // --- Loading State ---
    if (isLoading) {
        return <PageLoader text="Loading Your Profile..." />;
    }

    // --- Render Component ---
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <TutorHeader />
            <div className="flex flex-1">
                <TutorSidebar />
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white p-5 md:p-6 rounded-t-xl md:rounded-t-2xl shadow">
                            <h2 className="text-xl md:text-2xl font-semibold text-center m-0">Tutor Profile</h2>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-xl border border-gray-100 relative overflow-hidden">
                        {/* Decorative background pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-emerald-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100 to-cyan-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

                        <div className="relative z-10">
                            {/* Profile Image */}
                            <div className="flex justify-center mb-8 md:mb-10">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full animate-pulse opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                    <img
                                        src={profileData.profileImage || defaultProfileImage}
                                        alt="Profile"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultProfileImage;
                                        }}
                                        className="relative w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                                    />
                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    {/* Edit button */}
                                    <button
                                        onClick={triggerFileInput}
                                        disabled={isUploading}
                                        className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg transform hover:scale-110 ${
                                            isUploading
                                                ? "opacity-50 cursor-not-allowed"
                                                : "opacity-0 group-hover:opacity-100"
                                        }`}
                                        aria-label="Edit profile picture"
                                    >
                                        {isUploading ? <ButtonLoader /> : "📷"}
                                    </button>
                                    {/* Upload indicator */}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                            <div className="text-white text-xs font-medium">Uploading...</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="space-y-5 md:space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                        <span>👤</span>
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.fullName}
                                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full py-3 px-4 bg-white rounded-lg border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-gray-800 transition-all duration-200 hover:border-gray-400"
                                        />
                                    ) : (
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-4 rounded-lg border border-gray-200 min-h-[48px] flex items-center">
                                            {profileData.fullName || <span className="text-gray-400 italic">Not set</span>}
                                        </div>
                                    )}
                                </div>
                                {/* Email (Read Only) */}
                                <div>
                                    <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                        <span>📧</span>
                                        Email
                                    </label>
                                    <div className="bg-gray-100 py-3 px-4 rounded-lg text-gray-500 border-2 border-gray-200 cursor-not-allowed min-h-[48px] flex items-center">
                                        {profileData.email || <span className="text-gray-400 italic">Not set</span>}
                                    </div>
                                </div>
                                {/* Phone */}
                                <div>
                                    <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                        <span>📱</span>
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="Enter your phone number"
                                            className="w-full py-3 px-4 bg-white rounded-lg border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-gray-800 transition-all duration-200 hover:border-gray-400"
                                        />
                                    ) : (
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-4 rounded-lg border border-gray-200 min-h-[48px] flex items-center">
                                            {profileData.phone || <span className="text-gray-400 italic">Not set</span>}
                                        </div>
                                    )}
                                </div>
                                {/* Headline */}
                                <div>
                                    <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                        <span>✨</span>
                                        Professional Headline
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.headline}
                                            onChange={(e) => handleInputChange("headline", e.target.value)}
                                            placeholder="e.g., Experienced Full-Stack Developer & Mentor"
                                            className="w-full py-3 px-4 bg-white rounded-lg border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-gray-800 transition-all duration-200 hover:border-gray-400"
                                        />
                                    ) : (
                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-4 rounded-lg border border-gray-200 min-h-[48px] flex items-center">
                                            {profileData.headline || <span className="text-gray-400 italic">Not set</span>}
                                        </div>
                                    )}
                                </div>
                                {/* Expertise Area */}
                                <div>
                                    <label className="block text-sm text-gray-600 font-medium mb-1">Expertise Area</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.expertiseArea}
                                            onChange={(e) => handleInputChange("expertiseArea", e.target.value)}
                                            className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-gray-800 transition duration-150 ease-in-out"
                                        />
                                    ) : (
                                        <p className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 min-h-[44px]">
                                            {profileData.expertiseArea || (
                                                <span className="text-gray-400 italic">Not set</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                {/* Years of Experience */}
                                <div>
                                    <label className="block text-sm text-gray-600 font-medium mb-1">
                                        Years of Experience
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text" // Keep as text to allow "5+" etc.
                                            value={profileData.yearsOfExperience}
                                            onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                                            className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-gray-800 transition duration-150 ease-in-out"
                                        />
                                    ) : (
                                        <p className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 min-h-[44px]">
                                            {profileData.yearsOfExperience || (
                                                <span className="text-gray-400 italic">Not set</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                {/* Bio */}
                                <div>
                                    <label className="block text-sm text-gray-600 font-medium mb-1">Bio</label>
                                    {isEditing ? (
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => handleInputChange("bio", e.target.value)}
                                            rows={4}
                                            className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-gray-800 resize-none transition duration-150 ease-in-out"
                                        />
                                    ) : (
                                        <p className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 min-h-[108px] whitespace-pre-wrap">
                                            {profileData.bio || <span className="text-gray-400 italic">Not set</span>}
                                        </p>
                                    )}
                                </div>
                                {/* Skills */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Skills (comma-separated)</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.skills.join(", ")}
                                            onChange={(e) => handleInputChange("skills", e.target.value)}
                                            placeholder="e.g., React, Node.js, Python"
                                            className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-gray-800 transition duration-150 ease-in-out" // Example styling
                                        />
                                    ) : (
                                        <div className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 min-h-[44px] flex flex-wrap gap-2">
                                            {/* ✅ "Brutally Honest" Improvement: View mode-il ithu plain text-inu pakaram "Tags" aayi kaanikkunnathu kooduthal bhangiyullathaanu */}
                                            {Array.isArray(profileData.skills) && profileData.skills.length > 0 ? (
                                                profileData.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic">No skills listed</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Languages */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">
                                        Languages (comma-separated)
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.languages.join(", ")}
                                            onChange={(e) => handleInputChange("languages", e.target.value)}
                                            placeholder="e.g., English, Malayalam, Hindi"
                                            className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-gray-800 transition duration-150 ease-in-out" // Example styling
                                        />
                                    ) : (
                                        <div className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 min-h-[44px] flex flex-wrap gap-2">
                                            {/* ✅ "Brutally Honest" Improvement: View mode-il ithu "Tags" aayi kaanikkunnu */}
                                            {Array.isArray(profileData.languages) && profileData.languages.length > 0 ? (
                                                profileData.languages.map((lang, index) => (
                                                    // Different color for language tags
                                                    <span
                                                        key={index}
                                                        className="bg-cyan-100 text-cyan-700 text-xs font-medium px-2.5 py-1 rounded-full"
                                                    >
                                                        {lang}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic">No languages listed</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Qualifications */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">
                                        Qualifications (comma-separated)
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.qualifications.join(", ")}
                                            onChange={(e) => handleInputChange("qualifications", e.target.value)}
                                            placeholder="e.g., B.Tech, AWS Certified"
                                            className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-gray-800 transition duration-150 ease-in-out" // Example styling
                                        />
                                    ) : (
                                        <div className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 min-h-[44px] flex flex-wrap gap-2">
                                            {/* ✅ "Brutally Honest" Improvement: View mode-il ithu "Tags" aayi kaanikkunnu */}
                                            {Array.isArray(profileData.qualifications) &&
                                            profileData.qualifications.length > 0 ? (
                                                profileData.qualifications.map((qual, index) => (
                                                    // Different style for qualification tags
                                                    <span
                                                        key={index}
                                                        className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-md"
                                                    >
                                                        {qual}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic">No qualifications listed</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mt-8 md:mt-10">
                            {!isEditing ? (
                                <button
                                    onClick={handleEditClick}
                                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-600 text-white py-2.5 px-10 rounded-full font-semibold hover:from-cyan-600 hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={isSaving || isUploading}
                                        className={`w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-600 text-white py-2.5 px-8 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                                            isSaving || isUploading
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:from-cyan-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg"
                                        }`}
                                    >
                                        {isSaving ? <ButtonLoader text="Saving..." /> : "Save Changes"}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving || isUploading}
                                        className={`w-full sm:w-auto bg-gray-200 text-gray-700 py-2.5 px-8 rounded-full font-semibold hover:bg-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
                                            isSaving || isUploading ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Security Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-3xl mx-auto mt-8 shadow-lg border border-gray-100">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-5 md:mb-6 border-b pb-3 border-gray-200">
                            Security Settings
                        </h3>

                        <div className="space-y-4 md:space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-800">Change Email</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Update the email linked to your account.</p>
                                </div>
                                <button
                                    onClick={() => setIsChangeEmailOpen(true)}
                                    className="mt-2 sm:mt-0 w-full sm:w-auto bg-gray-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-gray-700 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Change Email
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-800">Change Password</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Set a new password for your account.</p>
                                </div>
                                <button
                                    onClick={() => setIsChangePasswordOpen(true)}
                                    className="mt-2 sm:mt-0 w-full sm:w-auto bg-gray-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-gray-700 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TutorFooter />

            {/* Modals */}
            {isChangeEmailOpen && (
                <ChangeEmailModal
                    isOpen={isChangeEmailOpen}
                    onClose={() => setIsChangeEmailOpen(false)}
                    currentEmail={profileData.email}
                    role="tutor"
                />
            )}

            {isChangePasswordOpen && (
                <ChangePasswordModal
                    isOpen={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)}
                    role="tutor"
                />
            )}
        </div>
    );
};

export default TutorProfile;
