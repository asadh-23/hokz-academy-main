import { Award, Mail, Star, BadgeCheck, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseInstructor = ({ tutor, averageRating }) => {
    if (!tutor) return null;
    const navigate = useNavigate();
    // Rating formatting (Safe check)
    const ratingValue = averageRating ? Number(averageRating).toFixed(1) : "0.0";

    return (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#14C4E7]/5 rounded-bl-full pointer-events-none"></div>

            <h2 className="text-2xl font-black text-[#1E2EDE] mb-10 uppercase tracking-tight">
                Meet Your <span className="text-[#14C4E7]">Mentor</span>
            </h2>

            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
                {/* --- Profile Image Section --- */}
                <div className="relative shrink-0 mx-auto md:mx-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden ring-4 ring-[#14C4E7]/20 transition-all hover:ring-[#E6D929]">
                        {tutor.profileImage ? (
                            <img
                                src={tutor.profileImage}
                                alt={tutor.fullName}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1E2EDE] to-[#14C4E7] flex items-center justify-center text-white text-4xl font-black">
                                {tutor.fullName?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-[#E6D929] text-[#1E2EDE] p-2 rounded-2xl shadow-lg border-2 border-white">
                        <BadgeCheck size={20} fill="white" />
                    </div>
                </div>

                {/* --- Instructor Details Section --- */}
                <div className="flex-1 w-full">
                    <div className="mb-6 text-center md:text-left">
                        <h3 className="text-3xl font-black text-[#1E2EDE] leading-tight mb-1">{tutor.fullName}</h3>
                        <p className="text-[#14C4E7] text-[10px] font-black uppercase tracking-[0.3em]">
                            Chief Academic Lead
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#1E2EDE]/20 transition-colors">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1E2EDE] shadow-sm">
                                <Award size={20} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    Status
                                </p>
                                <p className="text-sm font-bold text-slate-700">Verified Professional</p>
                            </div>
                        </div>

                        {tutor.email && (
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#1E2EDE]/20 transition-colors">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1E2EDE] shadow-sm">
                                    <Mail size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                        Contact
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 truncate">{tutor.email}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 p-4 bg-[#E6D929]/5 rounded-2xl border border-[#E6D929]/20 transition-colors col-span-1 sm:col-span-2">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#E6D929] shadow-sm">
                                <Star size={20} fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    Public Reputation
                                </p>
                                <p className="text-sm font-bold text-[#1E2EDE]">{ratingValue} Average Student Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick CTA */}
                    <div className="flex justify-center md:justify-start">
                        <button
                            onClick={() => navigate(`/user/tutors/${tutor._id}`)}
                            className="flex items-center gap-3 px-8 py-4 bg-[#1E2EDE] text-[#FDFDFD] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 transition-all hover:bg-[#14C4E7] active:scale-95"
                        >
                            <MessageSquare size={16} />
                            View Full Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInstructor;
