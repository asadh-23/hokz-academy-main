import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    FiMenu,
    FiBell,
    FiShoppingCart,
    FiHeart, // Wishlist icon
    FiUser,  // Profile icon
    FiLogOut // Logout icon
} from 'react-icons/fi';
import { toast } from 'sonner';

// Import all necessary actions and services
// "Brutally honest" note: Pathukal ningal shariyaakkum ennu karuthunnu
import { logoutSuccess } from '../../store/features/auth/authSlice';
import { authAxios } from '../../api/authAxios';
import defaultProfileImage from '../../assets/images/default-profile-image.webp';

const UserHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get user data from Redux authSlice
    const { user } = useSelector((state) => state.auth);

    // State for profile dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref for dropdown to detect outside clicks

    // "Brutally Honest" Standard Logout Function
    const handleLogout = async () => {
        try {
            await authAxios.post('/logout');
        } catch (error) {
            console.error("Backend logout failed:", error);
        } finally {
            dispatch(logoutSuccess());
            toast.success("Logged out successfully");
            navigate('/user/login', { replace: true });
        }
    };

    // "Brutally Honest" Standard Click Outside Handler for Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        // Add listener when dropdown is open
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);


    return (
        <header className="w-full bg-white flex items-center h-[52px] px-4 md:px-8 shadow-sm border-b border-gray-200 sticky top-0 z-40">
            
            {/* Left: Hamburger + Logo (links to Dashboard, NOT landing page) */}
            <div className="flex items-center gap-3 mr-4">
                <button aria-label="Open menu" className="text-xl text-gray-700">
                     <FiMenu /> {/* TODO: Add onClick for mobile sidebar */}
                </button>
               
                {/* Logo or App Name */}
                <Link to="/user/dashboard" className="flex items-center gap-2">
                     {/* <img src="/logo.png" alt="Logo" className="h-6 w-auto" /> */}
                     <span className="text-xl font-bold tracking-tight text-cyan-600">
                         {import.meta.env.VITE_APP_NAME || "Hokz Academy"}
                     </span>
                </Link>
            </div>

            {/* Center: Search Bar & Core Links */}
            <div className="flex-1 flex items-center gap-6 justify-start">
                 {/* Search Bar */}
                <div className="hidden md:block">
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        className="w-full max-w-[450px] bg-gray-100 border border-transparent focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 text-sm pl-4 pr-4 py-2 rounded-full outline-none transition duration-200"
                    />
                </div>
                 {/* Nav links (Corrected) */}
                <nav className="hidden lg:flex items-center gap-6 ml-5 text-sm font-medium text-gray-600">
                    {/* Replaced <a> with <Link> and fixed paths */}
                    <Link to="/user/dashboard" className="hover:text-cyan-600 transition-colors">
                        My Courses
                    </Link>
                    <Link to="/courses" className="hover:text-cyan-600 transition-colors">
                        Browse Courses
                    </Link>
                    {/* Removed Home, Contact, Tutors */}
                </nav>
            </div>

            {/* Right: Icons + Avatar Dropdown */}
            <div className="flex items-center gap-4 md:gap-5 ml-auto">
                {/* Wishlist Icon */}
                <Link to="/user/wishlist" className="text-xl text-gray-500 hover:text-cyan-600 transition-colors relative" aria-label="Wishlist">
                     <FiHeart />
                     {/* Optional: Wishlist count badge */}
                     {/* <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span> */}
                </Link> {/* ✅ Corrected closing tag */}

                {/* Notifications Icon */}
                <button className="text-xl text-gray-500 hover:text-cyan-600 transition-colors relative" aria-label="Notifications">
                    <FiBell />
                </button>
                {/* Cart Icon */}
                <Link to="/user/cart" className="text-xl text-gray-500 hover:text-cyan-600 transition-colors relative" aria-label="Shopping Cart">
                    <FiShoppingCart />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    {/* Avatar Button */}
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="block focus:outline-none">
                        <img
                            src={user?.profileImage || defaultProfileImage}
                            alt="User Avatar"
                            onError={(e) => { e.target.onerror = null; e.target.src = defaultProfileImage; }}
                            className="w-9 h-9 rounded-full object-cover border-2 border-transparent hover:border-cyan-500 transition-all"
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-12 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                            {/* User Info Header */}
                            <div className="p-4 border-b border-gray-100">
                                <p className="font-semibold text-gray-800 truncate">
                                    {user?.fullName || "Student"}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user?.email || "student@example.com"}
                                </p>
                            </div>
                            {/* Links */}
                            <div className="py-2">
                                <Link
                                    to="/user/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-cyan-600 transition-colors"
                                >
                                    <FiUser className="text-base" />
                                    <span>View Profile</span>
                                </Link>
                                 {/* Add other links like Purchase History here */}
                                {/* <Link
                                    to="/user/purchase-history"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-cyan-600 transition-colors"
                                >
                                    <FiShoppingBag className="text-base" />
                                    <span>Purchase History</span>
                                </Link> */}
                            </div>
                             {/* Logout Button */}
                            <div className="border-t border-gray-100 p-2">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FiLogOut className="text-base" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default UserHeader;