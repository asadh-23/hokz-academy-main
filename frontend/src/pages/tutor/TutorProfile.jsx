import { useState, useEffect, useRef } from "react";
import ChangeEmailModal from "../../components/auth/ChangeEmailModal";
import ChangePasswordModal from "../../components/auth/ChangePasswordModal";
import SecurityCard from "../../components/common/SecurityCard";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { validateArray, validatePhone, validateText } from "../../utils/validation";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";

// Thunks from tutorProfile slice
import {
    fetchTutorProfile,
    updateTutorProfile,
    uploadTutorProfileImage,
} from "../../store/features/tutor/tutorProfileSlice";
import { patchTutor } from "../../store/features/auth/tutorAuthSlice";

// ============================================================
// INLINE COMPONENTS
// ============================================================

function Field({ label, icon, value, isEditing, onChange, placeholder }) {
    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-[#1e2ede] mb-2 flex items-center gap-2 uppercase tracking-wider">
                {icon && <span className="text-base">{icon}</span>}
                {label}
            </label>
            {!isEditing ? (
                <div className="bg-[#fdfdfd] py-3.5 px-5 rounded-xl text-gray-700 border border-gray-100 shadow-sm min-h-[52px] flex items-center font-medium">
                    {value || <span className="text-gray-400 italic font-normal">Not provided</span>}
                </div>
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full py-3.5 px-5 bg-white rounded-xl border-2 border-gray-100 
                    focus:border-[#14c4e7] focus:ring-4 focus:ring-[#14c4e7]/10 outline-none
                    text-gray-800 transition-all duration-300 font-medium"
                />
            )}
        </div>
    );
}

function ReadOnlyField({ label, icon, value }) {
    return (
        <div className="w-full opacity-80">
            <label className="block text-sm font-bold text-gray-500 mb-2 flex items-center gap-2 uppercase tracking-wider">
                {icon && <span>{icon}</span>}
                {label}
            </label>
            <div className="bg-gray-50 py-3.5 px-5 rounded-xl text-gray-500 border border-gray-200 cursor-not-allowed min-h-[52px] flex items-center font-medium">
                {value}
            </div>
        </div>
    );
}

function TextAreaField({ label, value, isEditing, onChange, rows = 4 }) {
    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-[#1e2ede] mb-2 uppercase tracking-wider">{label}</label>
            {!isEditing ? (
                <div className="bg-[#fdfdfd] py-4 px-5 rounded-xl text-gray-700 border border-gray-100 shadow-sm min-h-[120px] whitespace-pre-wrap leading-relaxed font-medium">
                    {value || <span className="text-gray-400 italic font-normal">No bio added yet...</span>}
                </div>
            ) : (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    className="w-full py-4 px-5 bg-white rounded-xl border-2 border-gray-100 
                    focus:border-[#14c4e7] focus:ring-4 focus:ring-[#14c4e7]/10 outline-none 
                    text-gray-800 resize-none transition-all duration-300 font-medium"
                />
            )}
        </div>
    );
}

function SubjectsField({ label, subjects, isEditing, onAdd, onRemove }) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            onAdd(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-[#1e2ede] mb-2 uppercase tracking-wider">{label}</label>
            <div className="space-y-4">
                {isEditing && (
                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a subject and press Enter"
                            className="w-full py-3.5 px-5 bg-white rounded-xl border-2 border-gray-100 
                            focus:border-[#14c4e7] focus:ring-4 focus:ring-[#14c4e7]/10 outline-none 
                            text-gray-800 transition-all duration-300 font-medium"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 hidden md:block">
                            PRESS ENTER ↵
                        </div>
                    </div>
                )}
                <div
                    className={`flex flex-wrap gap-2 p-4 rounded-xl border border-gray-100 ${!isEditing ? "bg-[#fdfdfd]" : "bg-gray-50/50"}`}
                >
                    {subjects && subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                            <span
                                key={index}
                                className="bg-gradient-to-r from-[#1e2ede] to-[#14c4e7] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-2 group transition-all"
                            >
                                {subject}
                                {isEditing && (
                                    <button
                                        onClick={() => onRemove(index)}
                                        className="bg-white/20 hover:bg-white/40 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 italic text-sm">No subjects listed</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function ProfileButtons({ isEditing, isSaving, onEdit, onSave, onCancel }) {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            {!isEditing ? (
                <button
                    onClick={onEdit}
                    className="w-full sm:w-auto bg-[#1e2ede] text-white py-4 px-12 rounded-2xl font-bold hover:bg-[#14c4e7] transition-all duration-300 shadow-lg hover:shadow-[#14c4e7]/30 transform hover:-translate-y-1"
                >
                    Edit Profile Details
                </button>
            ) : (
                <>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className={`w-full sm:w-auto bg-gradient-to-r from-[#1e2ede] to-[#14c4e7] 
                        text-white py-4 px-10 rounded-2xl font-bold transition-all duration-300 shadow-lg
                        ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-1"}`}
                    >
                        {isSaving ? "Saving Changes..." : "Save All Changes"}
                    </button>

                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className="w-full sm:w-auto bg-gray-100 text-gray-600 py-4 px-10 rounded-2xl font-bold hover:bg-gray-200 transition-all duration-300"
                    >
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
}

const TutorProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        phone: "",
        profileImage: null,
        teachingSubjects: [],
        bio: "",
    });

    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    // ============================================================
    // FETCH PROFILE
    // ============================================================
    useEffect(() => {
        const loadTutorProfile = async () => {
            setIsLoading(true);
            try {
                const user = await dispatch(fetchTutorProfile()).unwrap();
                const data = {
                    fullName: user.fullName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    profileImage: user.profileImage || null,
                    teachingSubjects: user.teachingSubjects || [],
                    bio: user.bio || "",
                };
                setProfileData(data);
                setOriginalData(data);

                dispatch(patchTutor(data));
            } catch (error) {
                console.error("Failed to load tutor profile:", error);
                toast.error(error || "Failed to load tutor profile.");
            } finally {
                setIsLoading(false);
            }
        };

        loadTutorProfile();
    }, [dispatch]);

    // ============================================================
    // INPUT HANDLERS
    // ============================================================
    const handleInputChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddSubject = (subject) => {
        if (!profileData.teachingSubjects.includes(subject)) {
            setProfileData((prev) => ({
                ...prev,
                teachingSubjects: [...prev.teachingSubjects, subject],
            }));
        } else {
            toast.info("Subject already added");
        }
    };

    const handleRemoveSubject = (index) => {
        setProfileData((prev) => ({
            ...prev,
            teachingSubjects: prev.teachingSubjects.filter((_, i) => i !== index),
        }));
    };

    // ============================================================
    // IMAGE UPLOAD
    // ============================================================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setProfileData((prev) => ({ ...prev, profileImage: previewUrl }));

        handleImageUpload(file);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setIsUploading(true);

        try {
            const fd = new FormData();
            fd.append("profileImageFile", file);

            const imageUrl = await dispatch(uploadTutorProfileImage(fd)).unwrap();

            setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
            dispatch(patchTutor({ profileImage: imageUrl }));
            setOriginalData((prev) => ({ ...prev, profileImage: imageUrl }));

            toast.success("Profile photo updated!");
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error(error || "Image upload failed.");

            if (originalData) {
                setProfileData((prev) => ({ ...prev, profileImage: originalData.profileImage }));
            }
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => fileInputRef.current && fileInputRef.current.click();

    // ============================================================
    // SAVE PROFILE
    // ============================================================
    const handleSaveChanges = async () => {
        const nameValidation = validateText(profileData.fullName, 2, 50, "Full Name");
        if (!nameValidation.isValid) {
            return toast.error(nameValidation.message || "Enter a valid Full Name");
        }

        const phoneValidation = validatePhone(profileData.phone);
        if (!phoneValidation.isValid) {
            return toast.error(phoneValidation.message || "Enter a valid phone number");
        }

        const bioValidation = validateText(profileData.bio, 20, 200, "Bio");
        if (!bioValidation.isValid) {
            return toast.error(bioValidation.message || "Enter a valid Bio");
        }

        const subjectValidation = validateArray(profileData.teachingSubjects, "Subjects");

        if (!subjectValidation.isValid) {
            return toast.error(subjectValidation.message || "Enter a valid array");
        }

        setIsSaving(true);
        try {
            const { email, profileImage, ...editable } = profileData;

            // Clean subjects array
            editable.teachingSubjects = (editable.teachingSubjects || []).filter(Boolean);

            const updatedTutor = await dispatch(updateTutorProfile(editable)).unwrap();

            const updatedState = {
                fullName: updatedTutor.fullName || "",
                email,
                phone: updatedTutor.phone || "",
                profileImage,
                teachingSubjects: updatedTutor.teachingSubjects || [],
                bio: updatedTutor.bio || "",
            };

            setProfileData(updatedState);
            dispatch(patchTutor(updatedState));
            setOriginalData(updatedState);

            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (err) {
            console.error("Profile update failed:", err);
            toast.error(err?.message || err || "Failed to update profile.");
            if (originalData) setProfileData(originalData);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setProfileData(originalData);
        setIsEditing(false);
    };

    // ============================================================
    // LOADING
    // ============================================================
    if (isLoading) return <PageLoader text="Loading Your Profile..." />;

    // ============================================================
    // UI
    // ============================================================
    return (
    <div className="flex-1 min-h-screen bg-[#fdfdfd] p-4 md:p-8 overflow-y-auto">
        {/* HEADER SECTION */}
        <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-[#1e2ede] to-[#14c4e7] p-6 md:p-10 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center tracking-tight">
                    Tutor Profile
                </h2>
                <p className="text-white/80 text-center mt-2 text-sm md:text-base">Manage your professional presence</p>
            </div>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-10 max-w-4xl mx-auto shadow-[0_10px_40px_rgba(30,46,222,0.08)] border border-gray-100 relative mb-10">
            {/* IMAGE SECTION */}
            <div className="flex justify-center mb-10">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1e2ede] to-[#14c4e7] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>

                    <div className="relative">
                        {/* Conditional Rendering: Image or First Letter Placeholder */}
                        {profileData.profileImage ? (
                            <img
                                src={profileData.profileImage}
                                alt="Profile"
                                onError={(e) => {
                                    // Fallback to null if image fails to load to show the Letter placeholder
                                    handleInputChange("profileImage", null);
                                }}
                                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-white shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        ) : (
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#1e2ede] rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white text-5xl md:text-6xl font-black transition-transform duration-500 group-hover:scale-[1.02]">
                                {profileData.fullName?.charAt(0).toUpperCase() || "T"}
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {/* Fixed Mobile Button: Added z-index and removed MD-only restriction for interaction */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                triggerFileInput();
                            }}
                            disabled={isUploading}
                            className={`absolute bottom-1 right-1 md:bottom-2 md:right-2 w-11 h-11 bg-[#1e2ede] text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white transition-all duration-300 hover:bg-[#14c4e7] z-10 active:scale-90
                            ${isUploading ? "opacity-50 cursor-not-allowed" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"}`}
                        >
                            <span className="text-lg">📷</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* FIELDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Field
                        label="Full Name"
                        value={profileData.fullName}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("fullName", v)}
                        placeholder="Enter your full name"
                        icon="👤"
                    />
                </div>

                <ReadOnlyField label="Email Address" value={profileData.email} icon="📧" />

                <Field
                    label="Phone Number"
                    value={profileData.phone}
                    isEditing={isEditing}
                    onChange={(v) => handleInputChange("phone", v)}
                    icon="📱"
                />

                <div className="md:col-span-2">
                    <SubjectsField
                        label="Teaching Subjects"
                        subjects={profileData.teachingSubjects}
                        isEditing={isEditing}
                        onAdd={handleAddSubject}
                        onRemove={handleRemoveSubject}
                    />
                </div>

                <div className="md:col-span-2">
                    <TextAreaField
                        label="Bio"
                        value={profileData.bio}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("bio", v)}
                    />
                </div>
            </div>

            {/* ACTION BUTTONS */}
            <ProfileButtons
                isEditing={isEditing}
                isSaving={isSaving}
                onEdit={() => setIsEditing(true)}
                onCancel={handleCancel}
                onSave={handleSaveChanges}
            />
        </div>

        {/* SECURITY SECTION */}
        <div className="max-w-4xl mx-auto mb-10">
            <SecurityCard
                onEmailChange={() => setIsChangeEmailOpen(true)}
                onPasswordChange={() => setIsChangePasswordOpen(true)}
            />
        </div>

        {/* MODALS */}
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
