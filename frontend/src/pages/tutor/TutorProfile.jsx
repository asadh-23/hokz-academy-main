import React, { useState, useEffect, useRef} from "react";
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

    // ✅ Ref for the hidden file input
    const fileInputRef = useRef(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await tutorAxios.get("/profile");
                const fetchedData = response.data.tutor;
                const data = {
                    fullName: fetchedData.fullName || "",
                    email: fetchedData.email || "", // Store email from fetched data
                    phone: fetchedData.phone || "",
                    profileImage: fetchedData.profileImage || null, // Use null or the URL
                    headline: fetchedData.headline || "",
                    expertiseArea: fetchedData.expertiseArea || "",
                    bio: fetchedData.bio || "",
                    yearsOfExperience: fetchedData.yearsOfExperience || "",
                    skills: fetchedData.skills || [],
                    languages: fetchedData.languages || [],
                    qualifications: fetchedData.qualifications || [],
                };
                setProfileData(data);
                setOriginalData(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Could not load profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCommaSeparatedInput = (field, value) => {
        const formattedValue = value.replace(/,(?!\s)/g, ', ');
        
        setProfileData((prev) => ({ ...prev, [field + '_editing']: formattedValue }));
    };

    // Get display value for comma-separated fields
    const getCommaSeparatedDisplayValue = (field) => {
        // If we're editing, use the editing string value
        if (isEditing && profileData.hasOwnProperty(field + '_editing')) {
            return profileData[field + '_editing'] || '';
        }
        // Otherwise, convert array to string
        const value = profileData[field];
        return Array.isArray(value) ? value.join(', ') : '';
    };

    // Convert comma-separated string to array when saving
    const convertCommaSeparatedToArray = (field) => {
        const editingValue = profileData[field + '_editing'];
        if (editingValue !== undefined) {
            // Allow empty fields by checking if the trimmed value is empty
            if (editingValue.trim() === '') {
                return [];
            }
            return editingValue.split(',').map(item => item.trim()).filter(item => item !== '');
        }
        return profileData[field] || [];
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

        setIsUploading(true); // Start upload indicator
        const formData = new FormData();
        // Ensure 'profileImageFile' matches the field name expected by your backend middleware (e.g., Multer)
        formData.append('profileImageFile', file);

        try {
           
            const response = await tutorAxios.post('/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Crucial for file uploads
                },
            });

            // Assuming backend returns { success: true, imageUrl: '...' }
            const newImageUrl = response.data.imageUrl;

            if (!newImageUrl) {
                 throw new Error("Backend did not return a valid image URL.");
            }

            // Update state with the *permanent* URL from the backend
            setProfileData(prev => ({ ...prev, profileImage: newImageUrl }));
            setOriginalData(prev => ({ ...prev, profileImage: newImageUrl })); // Keep backup in sync

            toast.success("Profile image updated successfully");

        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error(error.response?.data?.message || "Image upload failed. Please try again.");
             if (originalData) { // Revert to last known good URL
                 setProfileData(prev => ({ ...prev, profileImage: originalData.profileImage }));
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


    // --- Edit Mode Handlers ---
    const handleEditClick = () => {
        // Initialize editing states for comma-separated fields
        setProfileData(prev => ({
            ...prev,
            skills_editing: Array.isArray(prev.skills) && prev.skills.length > 0 ? prev.skills.join(', ') : '',
            languages_editing: Array.isArray(prev.languages) && prev.languages.length > 0 ? prev.languages.join(', ') : '',
            qualifications_editing: Array.isArray(prev.qualifications) && prev.qualifications.length > 0 ? prev.qualifications.join(', ') : ''
        }));
        setIsEditing(true);
    };
    const handleCancel = () => {
        if (originalData) {
            // Reset from backup and clear editing states
            const resetData = { ...originalData };
            // Remove any editing states
            Object.keys(resetData).forEach(key => {
                if (key.endsWith('_editing')) {
                    delete resetData[key];
                }
            });
            setProfileData(resetData);
        }
        setIsEditing(false);
    };

    // --- Save Text Changes Handler ---
    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            // Validate required fields
            if (!profileData.fullName || profileData.fullName.trim() === '') {
                setIsSaving(false);
                return toast.error("Full name is required");
            }

            if (!profileData.phone || profileData.phone.trim() === '') {
                setIsSaving(false);
                return toast.error("Phone number is required");
            }

            // Validate phone number format
            const phoneRegex = /^(\+91)?\d{10}$/;
            if (!phoneRegex.test(profileData.phone.trim())) {
                setIsSaving(false);
                return toast.error("Please enter a valid 10-digit phone number");
            }
            const { profileImage, email, ...updatePayload } = profileData;
             if (updatePayload.hasOwnProperty('fullName')) {
                 updatePayload.fullName = updatePayload.fullName;
             }

            // Convert comma-separated strings to arrays for saving
            updatePayload.skills = convertCommaSeparatedToArray('skills');
            updatePayload.languages = convertCommaSeparatedToArray('languages');
            updatePayload.qualifications = convertCommaSeparatedToArray('qualifications');


            const response = await tutorAxios.put("/profile", updatePayload);
            const savedData = response.data.tutor;

            const dataToSet = {
                fullName: savedData.fullName || "",
                email: savedData.email || profileData.email,
                phone: savedData.phone || "",
                profileImage: savedData.profileImage || profileData.profileImage,
                headline: savedData.headline || "",
                expertiseArea: savedData.expertiseArea || "",
                bio: savedData.bio || "",
                yearsOfExperience: savedData.yearsOfExperience || "",
                skills: savedData.skills || [],
                languages: savedData.languages || [],
                qualifications: savedData.qualifications || [],
            };

            // Clear editing states
            const cleanDataToSet = { ...dataToSet };
            Object.keys(cleanDataToSet).forEach(key => {
                if (key.endsWith('_editing')) {
                    delete cleanDataToSet[key];
                }
            });
            
            setProfileData(cleanDataToSet);
            setOriginalData(cleanDataToSet);
            setIsEditing(false);
            toast.success("Profile details updated successfully!");

        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(error.response?.data?.message || "Profile update failed.");
            if (originalData) setProfileData(originalData);
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
                                    onError={(e) => { e.target.onerror = null; e.target.src = defaultProfileImage; }}
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
                                    className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 w-10 h-10 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-emerald-600 transition-all shadow-lg transform hover:scale-110 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'}`}
                                    aria-label="Edit profile picture"
                                >
                                    {isUploading ? <ButtonLoader /> : '📷'}
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
                                <div className={`bg-gray-100 py-3 px-4 rounded-lg text-gray-500 border-2 border-gray-200 cursor-not-allowed min-h-[48px] relative flex items-center transition-all duration-200 ${isEditing ? 'hover:border-red-400 hover:bg-red-50 hover:cursor-not-allowed' : ''}`}>
                                     {originalData?.email || profileData.email || <span className="text-gray-400 italic">Not set</span>}
                                     {isEditing && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                                            <span className="text-white text-xs">!</span>
                                        </div>
                                     )}
                                </div>
                                {isEditing && (
                                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1 bg-red-50 p-2 rounded border border-red-200">
                                        <span>🚫</span>
                                        Email cannot be edited here. Use "Change Email" in Security Settings.
                                    </p>
                                )}
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
                                        {profileData.expertiseArea || <span className="text-gray-400 italic">Not set</span>}
                                    </p>
                                )}
                            </div>


                            {/* Years of Experience */}
                             <div>
                                <label className="block text-sm text-gray-600 font-medium mb-1">Years of Experience</label>
                                {isEditing ? (
                                    <input
                                        type="text" // Keep as text to allow "5+" etc.
                                        value={profileData.yearsOfExperience}
                                        onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                                        className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-gray-800 transition duration-150 ease-in-out"
                                    />
                                ) : (
                                     <p className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 min-h-[44px]">
                                        {profileData.yearsOfExperience || <span className="text-gray-400 italic">Not set</span>}
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
                                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                    <span>💼</span>
                                    Skills
                                    {isEditing && <span className="text-xs text-gray-400 ml-1">(comma-separated)</span>}
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getCommaSeparatedDisplayValue('skills')}
                                            onChange={(e) => handleCommaSeparatedInput('skills', e.target.value)}
                                            placeholder="e.g., JavaScript, React, Node.js"
                                            className="w-full py-3 px-4 bg-white rounded-lg border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-gray-800 transition-all duration-200 hover:border-gray-400"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                            {profileData.skills?.length || 0} skills
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-4 rounded-lg border border-gray-200 min-h-[44px]">
                                         {Array.isArray(profileData.skills) && profileData.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.skills.map((skill, index) => (
                                                    <span key={index} className="bg-emerald-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-emerald-600 transition-colors">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                         ) : (
                                             <span className="text-gray-400 italic flex items-center gap-2">
                                                <span>💼</span>
                                                No skills listed
                                             </span>
                                         )}
                                    </div>
                                )}
                            </div>


                            {/* Languages */}
                            <div>
                                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                    <span>🌍</span>
                                    Languages
                                    {isEditing && <span className="text-xs text-gray-400 ml-1">(comma-separated)</span>}
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getCommaSeparatedDisplayValue('languages')}
                                            onChange={(e) => handleCommaSeparatedInput('languages', e.target.value)}
                                            placeholder="e.g., English, Spanish, French"
                                            className="w-full py-3 px-4 bg-white rounded-lg border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-gray-800 transition-all duration-200 hover:border-gray-400"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                            {profileData.languages?.length || 0} languages
                                        </div>
                                    </div>
                                ) : (
                                     <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-4 rounded-lg border border-gray-200 min-h-[44px]">
                                         {Array.isArray(profileData.languages) && profileData.languages.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.languages.map((lang, index) => (
                                                     <span key={index} className="bg-cyan-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-cyan-600 transition-colors">
                                                        {lang}
                                                    </span>
                                                ))}
                                            </div>
                                         ) : (
                                             <span className="text-gray-400 italic flex items-center gap-2">
                                                <span>🌍</span>
                                                No languages listed
                                             </span>
                                         )}
                                    </div>
                                )}
                            </div>

                            {/* Qualifications */}
                             <div>
                                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                                    <span>🎓</span>
                                    Qualifications
                                    {isEditing && <span className="text-xs text-gray-400 ml-1">(comma-separated)</span>}
                                </label>
                                {isEditing ? (
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getCommaSeparatedDisplayValue('qualifications')}
                                            onChange={(e) => handleCommaSeparatedInput('qualifications', e.target.value)}
                                            placeholder="e.g., Bachelor's in Computer Science, AWS Certified"
                                            className="w-full py-3 px-4 bg-white rounded-lg border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-gray-800 transition-all duration-200 hover:border-gray-400"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                            {profileData.qualifications?.length || 0} qualifications
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-4 rounded-lg border border-gray-200 min-h-[44px]">
                                         {Array.isArray(profileData.qualifications) && profileData.qualifications.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.qualifications.map((qual, index) => (
                                                     <span key={index} className="bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-indigo-600 transition-colors">
                                                        {qual}
                                                    </span>
                                                ))}
                                            </div>
                                         ) : (
                                             <span className="text-gray-400 italic flex items-center gap-2">
                                                <span>🎓</span>
                                                No qualifications listed
                                             </span>
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
                                        className={`w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-600 text-white py-2.5 px-8 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${(isSaving || isUploading) ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg'}`}
                                    >
                                        {isSaving ? <ButtonLoader text="Saving..."/> : "Save Changes"}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving || isUploading}
                                        className={`w-full sm:w-auto bg-gray-200 text-gray-700 py-2.5 px-8 rounded-full font-semibold hover:bg-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${(isSaving || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Security Card */}
                     <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-3xl mx-auto mt-8 shadow-lg border border-gray-100">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-5 md:mb-6 border-b pb-3 border-gray-200">Security Settings</h3>

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
                    email = {originalData.email}
                    role="tutor"
                />
             )}
        </div>
    );
};

export default TutorProfile;