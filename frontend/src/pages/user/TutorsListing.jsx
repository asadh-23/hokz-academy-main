import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, X, Eye, BadgeCheck, GraduationCap } from 'lucide-react';
import { userAxios } from "../../api/userAxios";
import { toast } from "sonner";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { formatText } from "../../utils/formatText";
import { publicAxios } from "../../api/publicAxios";

const TutorsListing = () => {
    const navigate = useNavigate();
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        try {
            setLoading(true);
            const response = await publicAxios.get("/user/tutors");
            setTutors(response.data.data);
        } catch (error) {
            console.error("Failed to fetch tutors:", error);
            toast.error(error.response?.data?.message || "Failed to load tutors");
        } finally {
            setLoading(false);
        }
    };

    // Filter tutors based on search query
    const filteredTutors = useMemo(() => {
        if (!searchQuery.trim()) {
            return tutors;
        }

        const query = searchQuery.toLowerCase();
        return tutors.filter((tutor) =>
            tutor.fullName.toLowerCase().includes(query)
        );
    }, [tutors, searchQuery]);

    const handleViewProfile = (tutorId) => {
        navigate(`/user/tutors/${tutorId}`);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* --- HERO HEADER SECTION --- */}
            <div className="bg-[#1E2EDE] relative overflow-hidden py-16 md:py-24">
                {/* Decorative Brand Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#14C4E7] opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E6D929] opacity-10 rounded-full translate-y-10 -translate-x-10"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                        <GraduationCap className="text-[#E6D929] w-5 h-5" />
                        <span className="text-[#FDFDFD] text-[10px] font-black uppercase tracking-[0.2em]">Hokz Academy Faculty</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#FDFDFD] tracking-tight mb-4">
                        Learn from the <span className="text-[#14C4E7]">Best</span>
                    </h1>
                    <p className="text-[#FDFDFD]/70 text-lg font-medium max-w-2xl mx-auto">
                        Connect with industry-leading experts and verified educators chosen specifically for your growth.
                    </p>
                </div>
            </div>

            {/* --- SEARCHBAR SECTION (FLOATING) --- */}
            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-4 md:p-6 border border-slate-50">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] transition-transform group-focus-within:scale-110" size={24} />
                        <input
                            type="text"
                            placeholder="Find your mentor by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-12 py-5 bg-slate-50 border-2 border-transparent focus:border-[#1E2EDE] rounded-3xl outline-none font-bold text-[#1E2EDE] placeholder-slate-400 transition-all text-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <div className="mt-4 px-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#14C4E7] rounded-full animate-ping"></span>
                            <p className="text-xs font-black text-[#1E2EDE] uppercase tracking-widest">
                                Showing results for: <span className="text-[#14C4E7]">{searchQuery}</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- TUTORS GRID --- */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-6">
                    <h2 className="text-sm font-black text-[#1E2EDE] uppercase tracking-[0.3em]">
                        {searchQuery ? "Filtered Results" : "Verified Instructors"}
                    </h2>
                    <span className="bg-[#14C4E7]/10 text-[#14C4E7] px-4 py-1.5 rounded-full text-[10px] font-black">
                        {filteredTutors.length} ACTIVE
                    </span>
                </div>

                {filteredTutors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredTutors.map((tutor) => (
                            <div
                                key={tutor._id}
                                className="group bg-white rounded-[3rem] border border-slate-100 flex flex-col hover:shadow-[0_20px_50px_rgba(30,46,222,0.1)] transition-all duration-500 overflow-hidden relative"
                            >
                                {/* Profile Image Container */}
                                <div className="relative h-64 m-4 overflow-hidden rounded-[2.5rem]">
                                    {tutor.profileImage ? (
                                        <img
                                            src={tutor.profileImage}
                                            alt={tutor.fullName}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <Users className="w-16 h-16 text-slate-200" />
                                        </div>
                                    )}
                                    
                                    {/* Verified Badge */}
                                    <div className="absolute top-4 left-4 bg-[#E6D929] text-[#1E2EDE] p-2 rounded-2xl shadow-lg border-2 border-white">
                                        <BadgeCheck size={20} fill="white" />
                                    </div>
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2EDE]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>

                                {/* Content */}
                                <div className="px-8 pb-8 text-center">
                                    <h3 className="text-xl font-bold text-slate-800 mb-6 group-hover:text-[#1E2EDE] transition-colors leading-tight">
                                        {formatText(tutor.fullName, 26)}
                                    </h3>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleViewProfile(tutor._id)}
                                        className="w-full py-4 bg-slate-50 text-[#14C4E7] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 group-hover:bg-[#1E2EDE] group-hover:text-[#E6D929] group-hover:shadow-xl group-hover:shadow-blue-200"
                                    >
                                        <Eye size={18} />
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-slate-200">
                            <Users className="text-slate-300" size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-[#1E2EDE] mb-3 uppercase tracking-tight">
                            {searchQuery ? "No Matches Found" : "Academy Empty"}
                        </h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto mb-8">
                            {searchQuery
                                ? `We couldn't find any mentors matching "${searchQuery}". Please try another search.`
                                : "Our verification team is currently onboarding new experts. Please check back shortly."}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="bg-[#14C4E7] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#1E2EDE] transition-all"
                            >
                                Reset Search
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorsListing;
