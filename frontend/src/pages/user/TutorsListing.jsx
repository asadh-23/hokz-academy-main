import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Eye, Search, X } from "lucide-react";
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
        navigate(`/user/tutor/${tutorId}`);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Our Expert Tutors
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Discover and connect with verified instructors
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-medium">
                            {filteredTutors.length} {searchQuery ? "Result(s)" : "Verified Tutors"}
                        </span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search tutors by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white shadow-sm text-gray-900 placeholder-gray-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-teal-800">
                                    Searching for: "{searchQuery}"
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tutors Grid */}
                {filteredTutors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTutors.map((tutor) => (
                            <div
                                key={tutor._id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 hover:-translate-y-2"
                            >
                                {/* Profile Image */}
                                <div className="relative h-48 bg-gradient-to-br from-teal-100 to-cyan-100 overflow-hidden">
                                    {tutor.profileImage ? (
                                        <img
                                            src={tutor.profileImage}
                                            alt={tutor.fullName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Users className="w-20 h-20 text-teal-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </div>

                                {/* Tutor Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-600 transition-colors text-center">
                                        {formatText(tutor.fullName, 26)}
                                    </h3>

                                    {/* View Profile Button */}
                                    <button
                                        onClick={() => handleViewProfile(tutor._id)}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-5 h-5" />
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-20 text-center">
                        <div className="max-w-lg mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Users className="text-5xl text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {searchQuery ? "No Tutors Found" : "No Tutors Available"}
                            </h3>
                            <p className="text-gray-600 text-lg">
                                {searchQuery
                                    ? `No tutors match "${searchQuery}". Try a different search term.`
                                    : "There are currently no verified tutors available. Please check back later."}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-xl"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorsListing;
