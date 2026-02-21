import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, MessageCircle } from "lucide-react";
import { selectUserAuth } from "../../store/features/auth/userAuthSlice";
import NotificationDropdown from "./NotificationDropdown";

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const { isAuthenticated, user } = useSelector(selectUserAuth);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/user/aboutus" },
        { name: "Courses", path: "/user/courses" },
        { name: "Tutors", path: "/user/tutors" },
        { name: "Contact", path: "/user/contact" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? "bg-[#FDFDFD]/90 backdrop-blur-md shadow-lg py-3" : "bg-transparent py-5"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-[#1E2EDE] rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
                            <span className="text-[#E6D929] font-black text-xl">H</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-[#1E2EDE]">
                            HOKZ<span className="text-[#14C4E7]">ACADEMY</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-bold text-[#1E2EDE] hover:text-[#14C4E7] transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E6D929] transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                {/* Wishlist Icon */}
                                <button
                                    onClick={() => navigate("/user/wishlist")}
                                    className="p-2 text-[#1E2EDE] hover:text-[#14C4E7] transition-colors relative"
                                    title="Wishlist"
                                >
                                    <Heart className="w-5 h-5" />
                                </button>

                                {/* Cart Icon */}
                                <button
                                    onClick={() => navigate("/user/cart")}
                                    className="p-2 text-[#1E2EDE] hover:text-[#14C4E7] transition-colors relative"
                                    title="Cart"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </button>

                                {/* Chat Icon */}
                                <button
                                    onClick={() => navigate("/user/chat")}
                                    className="p-2 text-[#1E2EDE] hover:text-[#14C4E7] transition-colors relative"
                                    title="Chat"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </button>

                                {/* Notification Dropdown */}
                                <NotificationDropdown />

                                {/* User Profile Image */}
                                <button
                                    onClick={() => navigate("/user/profile")}
                                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1E2EDE] hover:border-[#14C4E7] transition-colors"
                                    title="Profile"
                                >
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.fullName || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#1E2EDE] flex items-center justify-center text-white font-bold">
                                            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                        </div>
                                    )}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/user/login"
                                    className="text-sm font-bold text-[#1E2EDE] hover:text-[#14C4E7] transition-colors px-4 py-2"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/user/register"
                                    className="bg-[#1E2EDE] text-[#FDFDFD] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#14C4E7] hover:text-[#1E2EDE] transition-all shadow-md active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#1E2EDE] p-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L16 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`lg:hidden absolute top-full left-0 w-full bg-[#FDFDFD] border-t border-slate-100 transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
                }`}
            >
                <div className="px-4 py-6 space-y-4 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="block text-lg font-bold text-[#1E2EDE] hover:text-[#14C4E7]"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 flex flex-col gap-3">
                        {!isAuthenticated && (
                            <>
                                <Link
                                    to="/user/login"
                                    className="w-full py-3 text-[#1E2EDE] font-bold border-2 border-[#1E2EDE] rounded-xl text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/user/register"
                                    className="w-full py-3 bg-[#1E2EDE] text-[#FDFDFD] font-bold rounded-xl text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
