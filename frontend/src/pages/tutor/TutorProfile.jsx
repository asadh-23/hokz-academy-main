import { useState, useEffect, useRef } from "react";
import ChangeEmailModal from "../../components/auth/ChangeEmailModal";
import ChangePasswordModal from "../../components/auth/ChangePasswordModal";
import SecurityCard from "../../components/common/SecurityCard";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { isNullOrWhitespace, validatePhone } from "../../utils/validation";
import { useDispatch } from "react-redux";

// Thunks from tutorProfile slice
import {
    fetchTutorProfile,
    updateTutorProfile,
    uploadTutorProfileImage,
} from "../../store/features/tutor/tutorProfileSlice";
import { patchTutor } from "../../store/features/auth/tutorAuthSlice";

// ============================================================
// INLINE COMPONENTS (previously in components/tutor/tutorProfile)
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
            <div className="bg-gray-100 py-3 px-4 rounded-lg text-gray-500 border-2 border-gray-200 
            cursor-not-allowed min-h-[48px] flex items-center">
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

function TagField({ label, value, isEditing, onChange, placeholder, color = "emerald" }) {
    const valueArray = Array.isArray(value) ? value : [];
    const joined = valueArray.join(", ");

    const colorMap = {
        emerald: "bg-emerald-100 text-emerald-700",
        cyan: "bg-cyan-100 text-cyan-700",
        gray: "bg-gray-200 text-gray-700",
    };

    if (!isEditing) {
        return (
            <div>
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <div className="bg-gray-50 py-2.5 px-4 rounded-lg text-gray-700 border border-gray-200 
                min-h-[44px] flex flex-wrap gap-2">
                    {valueArray.length > 0 ? (
                        valueArray.map((item, index) => (
                            <span
                                key={index}
                                className={`${colorMap[color]} text-xs font-medium px-2.5 py-1 rounded-full`}
                            >
                                {item}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-400 italic">No items listed</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className="block text-gray-700 font-medium mb-1">{label}</label>
            <input
                type="text"
                value={joined}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full py-2.5 px-4 bg-white rounded-lg border border-gray-300 
                focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none 
                text-gray-800 transition duration-150 ease-in-out"
            />
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
                        ${isSaving
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
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    // ============================================================
    // FETCH PROFILE (using thunk)
    // ============================================================
    useEffect(() => {
        const loadTutorProfile = async () => {
            setIsLoading(true);
            try {
                // dispatch thunk which returns the user object (per your slice)
                const user = await dispatch(fetchTutorProfile()).unwrap();
                const data = {
                    fullName: user.fullName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    profileImage: user.profileImage || null,
                    headline: user.headline || "",
                    expertiseArea: user.expertiseArea || "",
                    bio: user.bio || "",
                    yearsOfExperience: user.yearsOfExperience || "",
                    skills: user.skills || [],
                    languages: user.languages || [],
                    qualifications: user.qualifications || [],
                };
                setProfileData((prev) => ({
                    ...prev,
                    ...data,
                }));
                setOriginalData((prev) => ({
                    ...prev,
                    ...data,
                }));
                
                // Update Redux state so Header/Sidebar can access the profile data
                dispatch(patchTutor(data));
            } catch (error) {
                console.error("Failed to load tutor profile:", error);
                toast.error(error || "Failed to load tutor profile.");
            } finally {
                setIsLoading(false);
            }
        };

        loadTutorProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // ============================================================
    // INPUT HANDLER
    // ============================================================
    const handleInputChange = (field, value) => {
        const isArrayField = ["skills", "languages", "qualifications"].includes(field);

        setProfileData((prev) => ({
            ...prev,
            [field]: isArrayField ? value.split(",").map((v) => v.trim()) : value,
        }));
    };

    // ============================================================
    // IMAGE PREVIEW + UPLOAD (using thunk)
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

            // dispatch thunk that uploads and returns new imageUrl
            const imageUrl = await dispatch(uploadTutorProfileImage(fd)).unwrap();

            setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
            dispatch(patchTutor({ profileImage: imageUrl }));
            setOriginalData((prev) => ({ ...prev, profileImage: imageUrl }));

            toast.success("Profile photo updated!");
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error(error || "Image upload failed.");

            // revert preview if we had original data
            if (originalData) {
                setProfileData((prev) => ({ ...prev, profileImage: originalData.profileImage }));
            }
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => fileInputRef.current && fileInputRef.current.click();

    // ============================================================
    // SAVE PROFILE DETAILS (using thunk)
    // ============================================================
    const handleSaveChanges = async () => {
        if (isNullOrWhitespace(profileData.fullName)) {
            return toast.error("Full name is required");
        }

        const phoneValidation = validatePhone(profileData.phone);
        if (!phoneValidation.isValid) {
            return toast.error(phoneValidation.message || "Enter a valid phone number");
        }

        setIsSaving(true);
        try {
            const { email, profileImage, ...editable } = profileData;

            // clean arrays
            editable.skills = (editable.skills || []).filter(Boolean);
            editable.languages = (editable.languages || []).filter(Boolean);
            editable.qualifications = (editable.qualifications || []).filter(Boolean);

            // dispatch update thunk
            const updatedTutor = await dispatch(updateTutorProfile(editable)).unwrap();

            const updatedState = {
                fullName: updatedTutor.fullName || "",
                phone: updatedTutor.phone || "",
                headline: updatedTutor.headline || "",
                expertiseArea: updatedTutor.expertiseArea || "",
                bio: updatedTutor.bio || "",
                yearsOfExperience: updatedTutor.yearsOfExperience || "",
                skills: updatedTutor.skills || [],
                languages: updatedTutor.languages || [],
                qualifications: updatedTutor.qualifications || [],
            };

            setProfileData(updatedState);
            // Update Redux state with all updated fields
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
                    />

                    <ReadOnlyField label="Email" value={profileData.email} icon="📧" />

                    <Field
                        label="Phone Number"
                        value={profileData.phone}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("phone", v)}
                        icon="📱"
                    />

                    <Field
                        label="Professional Headline"
                        value={profileData.headline}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("headline", v)}
                        icon="✨"
                    />

                    <Field
                        label="Expertise Area"
                        value={profileData.expertiseArea}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("expertiseArea", v)}
                    />

                    <Field
                        label="Years of Experience"
                        value={profileData.yearsOfExperience}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("yearsOfExperience", v)}
                    />

                    <TextAreaField
                        label="Bio"
                        value={profileData.bio}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("bio", v)}
                    />

                    <TagField
                        label="Skills"
                        value={profileData.skills}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("skills", v)}
                        color="emerald"
                    />

                    <TagField
                        label="Languages"
                        value={profileData.languages}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("languages", v)}
                        color="cyan"
                    />

                    <TagField
                        label="Qualifications"
                        value={profileData.qualifications}
                        isEditing={isEditing}
                        onChange={(v) => handleInputChange("qualifications", v)}
                        color="gray"
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
