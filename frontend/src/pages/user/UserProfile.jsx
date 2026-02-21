import { useState, useEffect, useRef } from "react";
import ChangeEmailModal from "../../components/auth/ChangeEmailModal";
import ChangePasswordModal from "../../components/auth/ChangePasswordModal";
import SecurityCard from "../../components/common/SecurityCard";
import { toast } from "sonner";
import { PageLoader, ButtonLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { validatePhone, validateText } from "../../utils/validation";
import { useDispatch, useSelector } from "react-redux";
// Redux thunks and selectors
import {
    fetchUserProfile,
    updateUserProfile,
    uploadUserProfileImage,
    selectUserProfileLoading,
    selectUserUpdateLoading,
    selectUserImageUploadLoading,
} from "../../store/features/user/userProfileSlice";
import { patchUser } from "../../store/features/auth/userAuthSlice";
import { formatText } from "../../utils/formatText";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  ShieldCheck, 
  Edit3, 
  X as CloseIcon, 
  Check 
} from "lucide-react";

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        profileImage: null,
    });

    const [originalData, setOriginalData] = useState(null);

    const dispatch = useDispatch();

    // Redux selectors for loading states
    const isLoading = useSelector(selectUserProfileLoading);
    const isSaving = useSelector(selectUserUpdateLoading);
    const isUploading = useSelector(selectUserImageUploadLoading);

    // ✅ Ref for the hidden file input
    const fileInputRef = useRef(null);

    // --- Data Fetching using Redux thunk ---
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const user = await dispatch(fetchUserProfile()).unwrap();
                const data = {
                    fullName: user.fullName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    profileImage: user.profileImage || null,
                };
                setProfileData(data);
                setOriginalData(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error(error || "Could not load profile data.");
            }
        };
        loadUserProfile();
    }, [dispatch]);

    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // ✅ Handle image file selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setProfileData((prev) => ({ ...prev, profileImage: URL.createObjectURL(file) }));

        handleImageUpload(file);

        event.target.value = "";
    };

    // ✅ Function to upload the image file using Redux thunk
    const handleImageUpload = async (file) => {
        if (!file) return;

        const fd = new FormData();
        fd.append("profileImageFile", file);

        try {
            // Dispatch upload thunk - loading state managed by Redux
            const newImageUrl = await dispatch(uploadUserProfileImage(fd)).unwrap();
            // Update local state
            setProfileData((prev) => ({ ...prev, profileImage: newImageUrl }));
            dispatch(patchUser({ profileImage: newImageUrl }));
            setOriginalData((prev) => ({ ...prev, profileImage: newImageUrl }));

            toast.success("Profile image updated successfully");
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error(error || "Image upload failed. Please try again.");
            if (originalData) {
                // Revert to last known good URL
                setProfileData((prev) => ({ ...prev, profileImage: originalData.profileImage }));
            }
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
        setIsEditing(true);
    };
    const handleCancel = () => {
        if (originalData) {
            setProfileData(originalData);
        }
        setIsEditing(false);
    };

    // --- Save Text Changes Handler using Redux thunk ---
    const handleSaveChanges = async () => {
        // Check Full Name
        const nameValidation = validateText(profileData.fullName, 2, 50, "Full Name");
        if (!nameValidation.isValid) {
            return toast.error(nameValidation.message || "Enter a Valid Name");
        }

        const phoneValidation = validatePhone(profileData.phone);
        if (!phoneValidation.isValid) {
            return toast.error(phoneValidation.message || "Enter a valid phone number");
        }

        try {
            const { email, profileImage, ...editableFields } = profileData;

            const savedData = await dispatch(updateUserProfile(editableFields)).unwrap();

            const dataToSet = {
                fullName: savedData.fullName,
                phone: savedData.phone || "",
            };

            // --- UPDATE ALL STATES ---
            setProfileData((prev) => ({
                ...prev,
                ...dataToSet,
            }));

            dispatch(patchUser(dataToSet));

            setOriginalData((prev) => ({
                ...prev,
                ...dataToSet,
            }));

            setIsEditing(false); // Exit edit mode
            toast.success("Profile details updated successfully!");
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(error || "Profile update failed.");

            // Revert form data on error
            if (originalData) {
                setProfileData(originalData);
            }
        }
    };

    // --- Loading State ---
    if (isLoading) {
        return <PageLoader text="Loading Your Profile..." />;
    }

    // --- Render Component ---
    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-12">
            {/* Header / Hero Section */}
            <div className="bg-[#1E2EDE] h-48 md:h-64 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#14C4E7]/20 rounded-full translate-y-10 -translate-x-10"></div>
                
                <div className="max-w-4xl mx-auto h-full flex flex-col justify-center px-6">
                    <h2 className="text-3xl md:text-4xl font-black text-[#FDFDFD] tracking-tight">
                        Account <span className="text-[#E6D929]">Settings</span>
                    </h2>
                    <p className="text-[#FDFDFD]/70 text-sm mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={16} /> Verified Profile
                    </p>
                </div>
            </div>

            {/* Profile Card Container */}
            <div className="max-w-4xl mx-auto px-4 -mt-16 md:-mt-24 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden">
                    
                    <div className="p-8 md:p-12">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-[#14C4E7]/30 transition-all duration-300 group-hover:ring-[#E6D929]">
                                    <img
                                        src={profileData.profileImage || defaultProfileImage}
                                        alt="Profile"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultProfileImage;
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    
                                    {/* Loading Overlay */}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <ButtonLoader />
                                        </div>
                                    )}
                                </div>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {/* Camera Action Button */}
                                <button
                                    onClick={triggerFileInput}
                                    disabled={isUploading}
                                    className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-10 h-10 bg-[#E6D929] text-[#1E2EDE] rounded-full flex items-center justify-center shadow-lg hover:bg-[#14C4E7] transition-all transform hover:scale-110 active:scale-90 disabled:opacity-50"
                                    aria-label="Edit profile picture"
                                >
                                    <Camera size={20} />
                                </button>
                            </div>
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student ID: #HKZ-9921</p>
                        </div>

                        {/* Form Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                                    <User size={14} className="text-[#14C4E7]" />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={profileData.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full py-4 px-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#1E2EDE] focus:bg-white transition-all outline-none font-bold text-slate-700 shadow-inner"
                                    />
                                ) : (
                                    <div className="group bg-slate-50/50 py-4 px-6 rounded-2xl border border-slate-100 min-h-[56px] flex items-center justify-between">
                                        <span className="font-bold text-slate-700">
                                            {profileData.fullName || <span className="text-slate-300 font-medium italic tracking-normal">Name not provided</span>}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                                    <Mail size={14} className="text-[#14C4E7]" />
                                    Email Address
                                </label>
                                <div className="bg-slate-100 py-4 px-6 rounded-2xl text-slate-400 border border-slate-200 cursor-not-allowed min-h-[56px] flex items-center font-bold">
                                    {profileData.email}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 px-1 italic">* Email is used for account verification.</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                                    <Phone size={14} className="text-[#14C4E7]" />
                                    Phone Number
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        placeholder="Ex: +1 234 567 890"
                                        className="w-full py-4 px-6 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#1E2EDE] focus:bg-white transition-all outline-none font-bold text-slate-700 shadow-inner"
                                    />
                                ) : (
                                    <div className="bg-slate-50/50 py-4 px-6 rounded-2xl border border-slate-100 min-h-[56px] flex items-center">
                                        <span className="font-bold text-slate-700">
                                            {profileData.phone || <span className="text-slate-300 font-medium italic tracking-normal">Phone not set</span>}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col sm:flex-row justify-center items-center gap-4">
                            {!isEditing ? (
                                <button
                                    onClick={handleEditClick}
                                    className="w-full sm:w-auto min-w-[200px] bg-[#1E2EDE] text-[#FDFDFD] py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-[#14C4E7] transition-all transform hover:scale-105 active:scale-95"
                                >
                                    <Edit3 size={18} />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={isSaving || isUploading}
                                        className="w-full sm:w-auto min-w-[180px] bg-[#E6D929] text-[#1E2EDE] py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-yellow-100 hover:bg-[#14C4E7] disabled:opacity-50 transition-all transform hover:scale-105 active:scale-95"
                                    >
                                        {isSaving ? <ButtonLoader /> : <Check size={20} />}
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving || isUploading}
                                        className="w-full sm:w-auto min-w-[140px] bg-slate-100 text-slate-500 py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 disabled:opacity-50 transition-all"
                                    >
                                        <CloseIcon size={20} />
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Section (Handled by SecurityCard) */}
                <div className="mt-8">
                    <SecurityCard
                        onEmailChange={() => setIsChangeEmailOpen(true)}
                        onPasswordChange={() => setIsChangePasswordOpen(true)}
                    />
                </div>
            </div>

            {/* Modals (No logic change) */}
            {isChangeEmailOpen && (
                <ChangeEmailModal
                    isOpen={isChangeEmailOpen}
                    onClose={() => setIsChangeEmailOpen(false)}
                    currentEmail={profileData.email}
                    role="user"
                />
            )}

            {isChangePasswordOpen && (
                <ChangePasswordModal
                    isOpen={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)}
                    role="user"
                />
            )}
        </div>
    );
};

export default UserProfile;
