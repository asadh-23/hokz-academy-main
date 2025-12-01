import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, BookOpen, ShoppingBag, Heart, ShoppingCart, Award, LogOut, ChevronRight } from "lucide-react";

import { logoutUser, selectUser } from "../../store/features/auth/userAuthSlice";

import defaultProfileImage from "../../assets/images/default-profile-image.webp";

const UserSidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ New selector
    const user = useSelector(selectUser);

    const userName = user?.fullName || "Student";
    const userEmail = user?.email || "";
    const userProfileImage = user?.profileImage || defaultProfileImage;

    const handleLogout = async () => {
        const result = await dispatch(logoutUser());

        if (logoutUser.fulfilled.match(result)) {
            navigate("/user/login", { replace: true });
        }
    };

    const menuItems = [
        {
            name: "Profile",
            path: "/user/profile",
            icon: User,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            name: "My Courses",
            path: "/user/my-courses",
            icon: BookOpen,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            name: "My Orders",
            path: "/user/orders",
            icon: ShoppingBag,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            name: "Wishlist",
            path: "/user/wishlist",
            icon: Heart,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
        },
        {
            name: "Shopping Cart",
            path: "/user/cart",
            icon: ShoppingCart,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            name: "Certificates",
            path: "/user/certificates",
            icon: Award,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
    ];

    return (
        <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-gray-50 
                 border-r border-gray-200 z-40 shadow-xl
                 w-72 flex flex-col transition-transform duration-300 ease-in-out
                 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* User Profile Section */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-500 to-cyan-600">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={userProfileImage}
                            alt={userName}
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg truncate">{userName}</h3>
                        <p className="text-teal-100 text-sm truncate">{userEmail}</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">Navigation</p>

                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md transform scale-[1.02]"
                                                : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        isActive ? "bg-white/20" : item.bgColor
                                                    }`}
                                                >
                                                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : item.color}`} />
                                                </div>
                                                <span className="font-medium">{item.name}</span>
                                            </div>

                                            <ChevronRight
                                                className={`w-4 h-4 transition-transform ${
                                                    isActive ? "text-white" : "text-gray-400 group-hover:translate-x-1"
                                                }`}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-between px-4 py-3.5 w-full rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all font-semibold group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span>Logout</span>
                    </div>

                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </aside>
    );
};

export default UserSidebar;
