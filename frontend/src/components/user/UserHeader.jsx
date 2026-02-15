import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Search, ShoppingCart, User, LogOut, BookOpen, Heart, Menu, X } from "lucide-react";
import defaultProfileImage from "../../assets/images/default-profile-image.webp";
import { logoutUser, selectUser } from "../../store/features/auth/userAuthSlice";
import NotificationDropdown from "../common/NotificationDropdown";

const UserHeader = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Select User
    const user = useSelector(selectUser);

    // States
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // User Info
    const userName = user?.fullName || "Student";
    const userProfileImage = user?.profileImage || defaultProfileImage;

    // Handlers
    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/user/login");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/user/courses?search=${searchQuery}`);
            setIsMobileMenuOpen(false); // Close mobile menu if open
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* 1. LEFT: Logo & Menu */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onMenuClick}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>

                        <Link to="/user/dashboard" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-sm">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent hidden sm:block">
                                Hokz Academy
                            </span>
                        </Link>
                    </div>

                    {/* 2. MIDDLE: Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2.5 pl-12 pr-4 border-2 border-gray-100 bg-gray-50 rounded-full text-sm outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50/50"
                                />
                            </div>
                        </form>
                    </div>

                    {/* 3. RIGHT: Icons & Profile */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Desktop Links */}
                        <nav className="hidden lg:flex items-center gap-6 mr-4">
                            <Link
                                to="/user/courses"
                                className="text-gray-600 hover:text-teal-600 font-medium transition-colors hover:bg-gray-50 px-3 py-1.5 rounded-lg"
                            >
                                Courses
                            </Link>
                        </nav>

                        {/* Wishlist */}
                        <Link
                            to="/user/wishlist"
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative hidden sm:block text-gray-600 hover:text-red-500"
                        >
                            <Heart className="w-5 h-5" />
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/user/cart"
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative hidden sm:block text-gray-600 hover:text-teal-600"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </Link>

                        <NotificationDropdown />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-200"
                            >
                                <img
                                    src={userProfileImage}
                                    alt={userName}
                                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)}></div>

                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email}</p>
                                        </div>

                                        <div className="py-2">
                                            <Link
                                                to="/user/profile"
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 text-gray-700 hover:text-teal-700 transition-colors"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                <span className="text-sm font-medium">My Profile</span>
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-50 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors w-full text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-600" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-3">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search for courses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 border border-gray-200 bg-gray-50 rounded-lg text-sm outline-none focus:border-teal-500 focus:bg-white"
                            />
                        </div>
                    </form>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white absolute w-full shadow-lg">
                    <nav className="px-4 py-4 space-y-2">
                        <Link
                            to="/user/courses"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <BookOpen className="w-5 h-5" />
                            Courses
                        </Link>

                        <Link
                            to="/user/wishlist"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Heart className="w-5 h-5" />
                            Wishlist
                        </Link>

                        <Link
                            to="/user/cart"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-xl font-medium transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Cart
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default UserHeader;
