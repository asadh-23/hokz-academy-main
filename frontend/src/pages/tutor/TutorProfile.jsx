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
    if (!isEditing) {
        return (
            <div>
                <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                    {icon && <span>{icon}</span>}
                    {label}
                </label>
                <div className="bg-gray-50 py-3 px-4 rounded-lg text-gray-700 border-2 border-gray-200 min-h-[48px] flex items-center">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full py-3 px-4 bg-white rounded-lg border-2 border-gray-300 
                focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none
                text-gray-800 transition-all duration-200 hover:border-gray-400"
            />
        </div>
    );
}

function ReadOnlyField({ label, icon, value }) {
    return (
        <div>
            <label className="block text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {label}
            </label>
            <div
                className="bg-gray-100 py-3 px-4 rounded-lg text-gray-500 border-2 border-gray-200 
            cursor-not-allowed min-h-[48px] flex items-center"
            >
                {value || <span className="text-gray-400 italic">Not set</span>}
            </div>
        </div>
    );
}

function TextAreaField({ label, value, isEditing, onChange, rows = 4 }) {
    if (!isEditing) {
        return (
            <div>
                <label className="block text-sm text-gray-600 font-medium mb-1">{label}</label>
                <div className="bg-gray-50 py-3 px-4 rounded-lg text-gray-700 border-2 border-gray-200 min-h-[100px] whitespace-pre-wrap">
                    {value || <span className="text-gray-400 italic">Not set</span>}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 
                focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none 
                text-gray-800 resize-none transition duration-150 ease-in-out"
            />
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

    if (!isEditing) {
        return (
            <div>
                <label className="block text-gray-700 font-medium mb-2">{label}</label>
                <div className="bg-gray-50 py-3 px-4 rounded-lg border-2 border-gray-200 min-h-[60px] flex flex-wrap gap-2">
                    {subjects && subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                            <span
                                key={index}
                                className="bg-gradient-to-r from-cyan-100 to-emerald-100 text-cyan-800 text-sm font-medium px-3 py-1.5 rounded-full border border-cyan-200"
                            >
                                {subject}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 italic">No subjects added</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-gray-700 font-medium mb-2">{label}</label>
            <div className="space-y-3">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a subject and press Enter to add"
                    className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 
                    focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none 
                    text-gray-800 transition duration-150 ease-in-out"
                />
                <div className="bg-gray-50 py-3 px-4 rounded-lg border border-gray-200 min-h-[60px] flex flex-wrap gap-2">
                    {subjects && subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                            <span
                                key={index}
                                className="bg-gradient-to-r from-cyan-100 to-emerald-100 text-cyan-800 text-sm font-medium px-3 py-1.5 rounded-full border border-cyan-200 flex items-center gap-2 group hover:from-cyan-200 hover:to-emerald-200 transition-all"
                            >
                                {subject}
                                <button
                                    onClick={() => onRemove(index)}
                                    className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 text-red-600" />
                                </button>
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 italic">No subjects added yet</span>
                    )}
                </div>
                <p className="text-xs text-gray-500 italic">Press Enter after typing each subject to add it</p>
            </div>
        </div>
    );
}

function ProfileButtons({ isEditing, isSaving, onEdit, onSave, onCancel }) {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mt-8 md:mt-10">
            {!isEditing ? (
                <button
                    onClick={onEdit}
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-600 
                    text-white py-2.5 px-10 rounded-full font-semibold hover:from-cyan-600 
                    hover:to-emerald-700 transition-all transform hover:scale-105 hover:shadow-lg"
                >
                    Edit Profile
                </button>
            ) : (
                <>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className={`w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-600 
                        text-white py-2.5 px-8 rounded-full font-semibold transition-all 
                        ${
                            isSaving
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:from-cyan-600 hover:to-emerald-700 hover:scale-105 hover:shadow-lg"
                        }`}
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        onClick={onCancel}
                        disabled={isSaving}
                        className={`w-full sm:w-auto bg-gray-200 text-gray-700 py-2.5 px-8 rounded-full 
                        font-semibold hover:bg-gray-300 transition-all
                        ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
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
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
            <div className="mb-8">
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-600 text-white p-5 md:p-6 rounded-t-xl md:rounded-t-2xl shadow">
                    <h2 className="text-xl md:text-2xl font-semibold text-center">Tutor Profile</h2>
                </div>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-xl border border-gray-100 relative overflow-hidden">
                {/* IMAGE */}
                <div className="flex justify-center mb-8 md:mb-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-500 rounded-full animate-pulse opacity-20 group-hover:opacity-30"></div>

                        <img
                            src={profileData.profileImage || defaultProfileImage}
                            alt="Profile"
                            onError={(e) => (e.target.src = defaultProfileImage)}
                            className="relative w-28 h-28 md:w-36 md:h-36 object-cover rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-all"
                        />

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <button
                            onClick={triggerFileInput}
                            disabled={isUploading}
                            className={`absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all
                ${isUploading ? "opacity-50 cursor-not-allowed" : "opacity-0 group-hover:opacity-100"}`}
                        >
                            📷
                        </button>
                    </div>
                </div>

                {/* FIELDS */}
                <div className="space-y-5 md:space-y-6">
                    <Field
                        label="Full Name"
                        value={profileData.fullName}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("fullName", v)}
                        placeholder="Enter your full name"
                        icon="👤"
                    />

                    <ReadOnlyField label="Email" value={profileData.email} icon="📧" />

                    <Field
                        label="Phone Number"
                        value={profileData.phone}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("phone", v)}
                        icon="📱"
                    />

                    <SubjectsField
                        label="Teaching Subjects"
                        subjects={profileData.teachingSubjects}
                        isEditing={isEditing}
                        onAdd={handleAddSubject}
                        onRemove={handleRemoveSubject}
                    />

                    <TextAreaField
                        label="Bio"
                        value={profileData.bio}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("bio", v)}
                    />
                </div>

                {/* BUTTONS */}
                <ProfileButtons
                    isEditing={isEditing}
                    isSaving={isSaving}
                    onEdit={() => setIsEditing(true)}
                    onCancel={handleCancel}
                    onSave={handleSaveChanges}
                />
            </div>

            {/* SECURITY CARD */}
            <SecurityCard
                onEmailChange={() => setIsChangeEmailOpen(true)}
                onPasswordChange={() => setIsChangePasswordOpen(true)}
            />

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
