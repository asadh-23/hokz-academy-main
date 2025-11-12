import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { authAxios } from "../../api/authAxios";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../store/features/auth/authSlice";
import defaultProfileImage from "../../assets/images/default-profile-image.webp"
import { use } from "react";

const TutorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useSelector((state)=> state.auth);

  const handleLogout = async () => {
    try {
      await authAxios.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      toast.success("Logout successfully");
      dispatch(logoutSuccess());
      navigate("/tutor/login", { replace: true });
    }
  };

  const tutorName = user.fullName || "Tutor";
  const tutorProfileImage = user.profileImage || defaultProfileImage;

  const menuItems = [
    { name: "Overview", icon: "👥", path: "/tutor/dashboard" },
    { name: "Profile", icon: "👥", path: "/tutor/profile" },
    { name: "Courses", icon: "📚", path: "/tutor/courses" },
    { name: "Revenues", icon: "📈", path: "/tutor/revenues" },
    { name: "Chat & Video", icon: "🎥", path: "/tutor/chat" },
    { name: "LogOut", icon: "🚪" }, // no path needed
  ];

  return (
    <>
      <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-screen">
        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-hide">
          {/* Profile Section */}
          <div className="text-center relative">
            <div className="mb-3">
              <img
                src={tutorProfileImage}
                alt="Jenny"
                className="w-20 h-20 rounded-full border-4 border-emerald-400 mx-auto"
              />
            </div>
            <h3 className="text-lg font-semibold text-emerald-600">{tutorName}</h3>
          </div>

          {/* Dashboard Section */}
          <div className="bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-2xl p-5 text-white shadow-md">
            <h4 className="text-lg font-semibold mb-4">Dashboard</h4>

            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;

                // ✅ For logout button, open confirmation modal instead
                const handleClick =
                  item.name === "LogOut"
                    ? () => setShowConfirm(true)
                    : () => navigate(item.path);

                return (
                  <div
                    key={item.name}
                    onClick={handleClick}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${
                      isActive
                        ? "bg-white text-emerald-600 font-semibold"
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

        {/* Add Course Button */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={() => navigate("/tutor/add-course")}
            className="w-full bg-gradient-to-br from-cyan-400 to-emerald-500 text-white py-3 px-5 rounded-full text-sm font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/30"
          >
            Add New Course
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
              Are you sure you want to log out?
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
                className="px-5 py-2 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 text-white font-semibold hover:opacity-90 transition-all"
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

export default TutorSidebar;

