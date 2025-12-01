import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { authAxios } from "../../api/authAxios";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminAuthState, logoutAdmin } from "../../store/features/auth/adminAuthSlice";
import defaultProfileImage from "../../assets/images/default-profile-image.webp"

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [showConfirm, setShowConfirm] = useState(false);
    const { admin } = useSelector((state) => state.adminAuth);

    const handleLogout = async () => {
        try {
            await dispatch(logoutAdmin()).unwrap();
            toast.success("Logout successfully");
            dispatch(clearAdminAuthState());
            navigate("/admin/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed");
        }
    };

    const adminName = admin?.fullName || "Admin";
    const adminProfileImage = admin?.profileImage || defaultProfileImage;

    const menuItems = [
        { name: "Dashboard", icon: "📊", path: "/admin/dashboard" },
        { name: "Profile", icon: "👤", path: "/admin/profile" },
        { name: "Category", icon: "📂", path: "/admin/categories" },
        { name: "Students", icon: "🎓", path: "/admin/users" },
        { name: "Tutors", icon: "👨‍🏫", path: "/admin/tutors" },
        { name: "Orders", icon: "📋", path: "/admin/orders" },
        { name: "Coupon", icon: "🎫", path: "/admin/coupon" },
        { name: "Courses", icon: "📚", path: "/admin/courses" },
        { name: "Legal", icon: "⚖️", path: "/admin/legal" },
        { name: "Logout", icon: "🚪" }, // no path needed
    ];

    return (
        <>
            <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-70px)] sticky top-0">
                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
                    {/* Profile Section */}
                    <div className="text-center relative">
                        <div className="mb-3">
                            <img
                                src={adminProfileImage}
                                alt="Admin"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultProfileImage;
                                }}
                                className="w-20 h-20 rounded-full border-4 border-cyan-400 mx-auto object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-cyan-600">{adminName}</h3>
                        <p className="text-sm text-gray-500">Administrator</p>
                    </div>

                    {/* Admin Panel Section */}
                    <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-5 text-white shadow-md">
                        <h4 className="text-lg font-semibold mb-4">Admin Panel</h4>

                        <div className="flex flex-col gap-2">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;

                                // ✅ For logout button, open confirmation modal instead
                                const handleClick =
                                    item.name === "Logout"
                                        ? () => setShowConfirm(true)
                                        : () => navigate(item.path);

                                return (
                                    <div
                                        key={item.name}
                                        onClick={handleClick}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${isActive
                                                ? "bg-white text-cyan-600 font-semibold shadow-sm"
                                                : "hover:bg-white/20 hover:text-white"
                                            }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* System Settings Button */}
                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={() => navigate("/admin/settings")}
                        className="w-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white py-3 px-5 rounded-full text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                        System Settings
                    </button>
                </div>
            </aside>

            {/* 🔹 Logout Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-lg text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to log out of the admin panel?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-semibold hover:opacity-90 transition-all"
                            >
                                Yes, Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminSidebar;