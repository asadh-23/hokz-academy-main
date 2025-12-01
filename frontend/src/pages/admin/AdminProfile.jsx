import React, { useState, useEffect, useRef } from "react";
import ChangePasswordModal from "../../components/auth/ChangePasswordModal";
import SecurityCard from "../../components/common/SecurityCard";
import { toast } from "sonner";
import { PageLoader, ButtonLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { useDispatch, useSelector } from "react-redux";
import { patchAdmin } from "../../store/features/auth/adminAuthSlice";
// Redux thunks and selectors
import {
    fetchAdminProfile,
    uploadAdminProfileImage,
    selectAdminProfileLoading,
    selectAdminImageUploadLoading,
} from "../../store/features/admin/adminProfileSlice";

const AdminProfile = () => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    // Redux selectors
    const isLoading = useSelector(selectAdminProfileLoading);
    const isUploading = useSelector(selectAdminImageUploadLoading);

    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        profileImage: null,
    });

    // =============================
    // Fetch Admin Profile using Redux thunk
    // =============================
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const admin = await dispatch(fetchAdminProfile()).unwrap();
                setProfileData(admin);
            } catch (err) {
                console.error(err);
                toast.error(err || "Failed to load admin profile");
            }
        };

        loadProfile();
    }, [dispatch]);

    // =============================
    // Trigger hidden file input
    // =============================
    const triggerFileInput = () => fileInputRef.current?.click();

    // =============================
    // Upload image to backend using Redux thunk
    // =============================
    const uploadProfileImage = async (file) => {
        if (!file) return;

        try {
            const fd = new FormData();
            fd.append("profileImageFile", file);

            // Dispatch upload thunk - loading state managed by Redux
            const imageUrl = await dispatch(uploadAdminProfileImage(fd)).unwrap();

            setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
            dispatch(patchAdmin({ profileImage: imageUrl }));
            toast.success("Profile image updated");
        } catch (err) {
            console.error(err);
            toast.error(err || "Image upload failed");
        }
    };

    // =============================
    // Handle file input change
    // =============================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview image immediately

        setProfileData((prev) => ({ ...prev, profileImage: URL.createObjectURL(file) }));
        // Upload to backend
        uploadProfileImage(file);

        e.target.value = "";
    };

    // =============================
    // Render
    // =============================
    if (isLoading) {
        return <PageLoader text="Loading your profile..." />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-5 md:p-6 rounded-xl shadow mb-8">
                    <h2 className="text-xl md:text-2xl font-semibold text-center">Admin Profile</h2>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto shadow-lg relative overflow-hidden border border-gray-100">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-10">
                        <div className="relative group">
                            <img
                                src={profileData.profileImage || defaultProfileImage}
                                alt="Profile"
                                className="relative w-36 h-36 object-cover rounded-full border-4 border-white shadow-xl group-hover:scale-105 transition-all"
                                onError={(e) => (e.target.src = defaultProfileImage)}
                            />

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            <button
                                onClick={triggerFileInput}
                                disabled={isUploading}
                                className={`absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all ${
                                    isUploading ? "opacity-60 cursor-not-allowed" : "opacity-90"
                                }`}
                            >
                                {isUploading ? <ButtonLoader /> : "📷"}
                            </button>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                            <div className="bg-gray-100 rounded-lg px-4 py-3 border">{profileData.fullName}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <div className="bg-gray-100 rounded-lg px-4 py-3 border text-gray-500 cursor-not-allowed">
                                {profileData.email}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
