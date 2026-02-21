import React, { useState, useEffect, useRef } from "react";
import { Camera, Mail, User, ShieldCheck } from "lucide-react";
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
        <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-black text-[#1E2EDE] tracking-tighter uppercase">
                        Account <span className="text-[#14C4E7]">Profile</span>
                    </h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                        Administrator Profile & Security
                    </p>
                    <div className="h-1 w-20 bg-[#E6D929] mt-4 rounded-full mx-auto md:mx-0"></div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(30,46,222,0.06)] border border-slate-100 overflow-hidden relative">
                    {/* Decorative Background Flare */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#14C4E7]/5 to-transparent rounded-bl-full pointer-events-none"></div>

                    <div className="p-8 md:p-12 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            
                            {/* Left Side: Profile Image Section */}
                            <div className="flex-shrink-0">
                                <div className="relative group">
                                    <div className="w-44 h-44 rounded-[3rem] p-1.5 bg-gradient-to-tr from-[#1E2EDE] via-[#14C4E7] to-[#E6D929] shadow-2xl">
                                        <div className="w-full h-full rounded-[2.8rem] overflow-hidden border-4 border-white bg-white">
                                            <img
                                                src={profileData.profileImage || defaultProfileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => (e.target.src = defaultProfileImage)}
                                            />
                                        </div>
                                    </div>

                                    {/* File Input Logic */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    {/* Camera Button */}
                                    <button
                                        onClick={triggerFileInput}
                                        disabled={isUploading}
                                        className={`absolute -bottom-2 -right-2 w-14 h-14 bg-white text-[#1E2EDE] rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 hover:bg-[#1E2EDE] hover:text-white transition-all transform active:scale-90 ${
                                            isUploading ? "opacity-60 cursor-not-allowed" : "opacity-100"
                                        }`}
                                        title="Update Profile Photo"
                                    >
                                        {isUploading ? (
                                            <ButtonLoader />
                                        ) : (
                                            <Camera size={24} />
                                        )}
                                    </button>
                                </div>
                                <div className="mt-6 text-center">
                                    <span className="px-4 py-1.5 bg-[#14C4E7]/10 text-[#14C4E7] rounded-full text-[10px] font-black uppercase tracking-widest">
                                        System Admin
                                    </span>
                                </div>
                            </div>

                            {/* Right Side: Profile Details */}
                            <div className="flex-1 w-full space-y-8">
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Full Name Field */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest">
                                            <User size={14} className="text-[#14C4E7]" />
                                            Administrative Name
                                        </label>
                                        <div className="bg-gray-50 border border-slate-100 rounded-2xl px-6 py-4 flex items-center">
                                            <span className="text-gray-800 font-bold text-lg">
                                                {profileData.fullName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-[#1E2EDE] uppercase tracking-widest">
                                            <Mail size={14} className="text-[#14C4E7]" />
                                            Primary Email Address
                                        </label>
                                        <div className="bg-gray-50 border border-slate-100 rounded-2xl px-6 py-4 flex items-center justify-between group">
                                            <span className="text-slate-400 font-medium select-none italic">
                                                {profileData.email}
                                            </span>
                                            <div className="text-slate-300">
                                                <ShieldCheck size={20} />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium italic ml-2">
                                            Email changes must be requested through system security.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info Accent */}
                    <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Console Access Active</span>
                        </div>
                        <span className="text-[9px] font-black text-[#1E2EDE] uppercase tracking-widest opacity-40">Portal v2.4.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
