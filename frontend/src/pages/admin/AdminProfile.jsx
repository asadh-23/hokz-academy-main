import React, { useState, useEffect, useRef } from "react";
import ChangePasswordModal from "../../components/auth/ChangePasswordModal";
import { adminAxios } from "../../api/adminAxios";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { updateUserData } from "../../store/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { ButtonLoader } from "../../components/common/LoadingSpinner";

const AdminProfile = () => {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const [profileData, setProfileData] = useState({
        fullName: "",
        email: "",
        profileImage: null,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    // --- Data Fetching ---
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await adminAxios.get("/profile");
                const fetchedData = response.data.admin;
                const data = {
                    fullName: fetchedData.fullName,
                    email: fetchedData.email,
                    profileImage: fetchedData.profileImage,
                };
                setProfileData(data);
            } catch (error) {
                console.error("Failed to fetch profile: ", error);
                toast.error("Could not load profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("profileImageFile", file);

        try {
            const response = await adminAxios.post("/profile/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const newImageUrl = response.data.imageUrl || null;

            if (!newImageUrl) {
                throw new Error("Backend did not return a valid image URL.");
            }

            setProfileData((prev) => ({ ...prev, profileImage: newImageUrl }));

            dispatch(updateUserData({ profileImage: newImageUrl }));

        } catch (error) {
            console.error("Image upload failed :", error);
            toast.error(error.response?.data?.message || "Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // 1. Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileData((prev) => ({
                ...prev,
                profileImage: reader.result,
            }));
            dispatch(updateUserData({ profileImage: reader.result }));
            toast.success("Profile image updated successfully");
        };
        reader.readAsDataURL(file);

        // 2. Upload to backend
        handleImageUpload(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --- Loading State ---
    if (isLoading) {
        return <PageLoader text="Loading Your Profile..." />;
    }

    // --- Render Component ---
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex flex-1">
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-5 md:p-6 rounded-t-xl md:rounded-t-2xl shadow">
                            <h2 className="text-xl md:text-2xl font-semibold text-center m-0">Admin Profile</h2>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-xl border border-gray-100 relative overflow-hidden">
                        {/* Decorative background pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

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
                                        📷
                                    </button>
                                    
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
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-4 rounded-lg border border-gray-200 min-h-[48px] flex items-center">
                                        {profileData.fullName || <span className="text-gray-400 italic">Not set</span>}
                                    </div>
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
                            </div>
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
                                    <p className="font-medium text-gray-800">Change Password</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Set a new password for your admin account.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsChangePasswordOpen(true)}
                                    className="mt-2 sm:mt-0 w-full sm:w-auto bg-cyan-600 text-white py-2 px-5 rounded-full font-semibold hover:bg-cyan-700 transition-all text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isChangePasswordOpen && (
                <ChangePasswordModal
                    isOpen={isChangePasswordOpen}
                    onClose={() => setIsChangePasswordOpen(false)}
                    role="admin"
                />
            )}
        </div>
    );
};

export default AdminProfile;
