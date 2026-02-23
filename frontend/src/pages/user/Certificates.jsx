import React, { useState, useEffect } from "react";
import {
    Award,
    Trophy,
    Percent,
    Search,
    Calendar,
    Download,
    Eye,
    ExternalLink,
    CheckCircle,
    BookOpen,
    ChevronRight,
    User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { userAxios } from "../../api/userAxios";
import CertificatePDF from "../../components/user/pdfs/CertificatePDF";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import {
    fetchUserCertificates,
    selectAllCertificates,
    selectCertificatesLoading,
} from "../../store/features/user/certificatesSlice";
import { useDispatch, useSelector } from "react-redux";

const Certificates = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState("");

    const certificates = useSelector(selectAllCertificates);
    const loading = useSelector(selectCertificatesLoading);

    useEffect(() => {
        if (certificates.length === 0) {
            dispatch(fetchUserCertificates());
        }
    }, [dispatch, certificates.length]);

    const handleDownload = (certId) => {
        toast.success("Preparing your certificate for download...");
        // Logic to download PDF (usually window.open(pdf_url))
    };

    const filteredCertificates = certificates.filter((cert) =>
        cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Calculate Average Score
    const averageScore =
        certificates.length > 0
            ? Math.round(certificates.reduce((acc, curr) => acc + (curr.score || 0), 0) / certificates.length)
            : 0;

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* --- BRANDED HERO SECTION --- */}
            <div className="bg-[#1E2EDE] relative overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32 px-6">
                {/* Decorative Brand Shapes */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#14C4E7] opacity-10 rounded-full -translate-y-24 translate-x-24"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E6D929] opacity-10 rounded-full translate-y-12 -translate-x-12"></div>

                <div className="relative max-w-7xl mx-auto z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                        <Award className="text-[#E6D929] w-4 h-4" />
                        <span className="text-[#FDFDFD] text-[10px] font-black uppercase tracking-[0.2em]">
                            Verified Achievements
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-[#FDFDFD] tracking-tight mb-4">
                        Your <span className="text-[#E6D929]">Success</span> Story
                    </h1>
                    <p className="text-[#FDFDFD]/70 text-lg font-medium max-w-2xl mx-auto mb-12">
                        Collect your professional credentials and share your expertise with the world.
                    </p>

                    {/* STATS SUMMARY - Floating style */}
                    {!loading && certificates.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] flex flex-col items-center">
                                <div className="w-10 h-10 rounded-xl bg-[#E6D929] flex items-center justify-center mb-3 text-[#1E2EDE]">
                                    <Trophy size={20} />
                                </div>
                                <div className="text-2xl font-black text-[#FDFDFD]">{certificates.length}</div>
                                <div className="text-[#FDFDFD]/60 text-[10px] font-black uppercase tracking-widest mt-1">
                                    Earned
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] flex flex-col items-center">
                                <div className="w-10 h-10 rounded-xl bg-[#14C4E7] flex items-center justify-center mb-3 text-[#1E2EDE]">
                                    <Percent size={20} />
                                </div>
                                <div className="text-2xl font-black text-[#FDFDFD]">{averageScore}%</div>
                                <div className="text-[#FDFDFD]/60 text-[10px] font-black uppercase tracking-widest mt-1">
                                    Avg Score
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- SEARCH BAR SECTION --- */}
            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-4 md:p-6 border border-slate-50">
                    <div className="relative group">
                        <Search
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-[#14C4E7] group-focus-within:scale-110 transition-transform"
                            size={24}
                        />
                        <input
                            type="text"
                            placeholder="Search by course name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-[#1E2EDE] rounded-3xl outline-none font-bold text-[#1E2EDE] placeholder-slate-400 transition-all text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* --- CERTIFICATES GRID --- */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-[450px] bg-slate-100 animate-pulse rounded-[3rem]" />
                        ))
                    ) : filteredCertificates.length > 0 ? (
                        filteredCertificates.map((cert) => (
                            <div
                                key={cert.certificateId}
                                className="group bg-white rounded-[3rem] border border-slate-100 flex flex-col hover:shadow-[0_30px_60px_rgba(30,46,222,0.1)] transition-all duration-500 overflow-hidden relative transform hover:-translate-y-3"
                            >
                                {/* Certificate Visual Preview - Brand Style */}
                                <div className="relative h-52 m-4 overflow-hidden rounded-[2.5rem] bg-[#1E2EDE] p-8 flex flex-col justify-center items-center text-center border-b-4 border-[#E6D929]">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                                        <Award size={120} />
                                    </div>
                                    <div className="relative z-10 border border-white/20 p-4 rounded-2xl w-full h-full flex flex-col justify-center items-center">
                                        <p className="text-[8px] uppercase tracking-[0.3em] font-black text-[#14C4E7] mb-2">
                                            Completion Diploma
                                        </p>
                                        <h3 className="text-[#FDFDFD] text-sm font-bold line-clamp-2 leading-tight px-2">
                                            {cert.courseName}
                                        </h3>
                                        <div className="mt-4 w-12 h-[2px] bg-[#E6D929]"></div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="px-8 pb-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-black text-[#1E2EDE] leading-tight group-hover:text-[#14C4E7] transition-colors line-clamp-2">
                                                {cert.courseName}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                <Calendar size={14} className="text-[#14C4E7]" />
                                                <span>Issued: {new Date(cert.completedDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#E6D929]/10 px-3 py-1 rounded-lg text-[#1E2EDE] text-xs font-black border border-[#E6D929]/20">
                                            {cert.score}%
                                        </div>
                                    </div>

                                    {/* Instructor Info */}
                                    <div className="flex items-center gap-3 mb-8 bg-slate-50 p-3 rounded-2xl">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                                            <img
                                                src={cert.tutorProfileImage}
                                                alt={cert.tutorName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">
                                                Expert Mentor
                                            </p>
                                            <p className="text-sm font-bold text-slate-700 leading-none">
                                                {cert.tutorName}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions - Brand Themed */}
                                    <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                                        <PDFDownloadLink
                                            document={
                                                <CertificatePDF
                                                    studentName={cert.studentName}
                                                    courseName={cert.courseName}
                                                    completionDate={cert.completedDate}
                                                    score={cert.score}
                                                    instructorName={cert.tutorName}
                                                    certificateId={cert.certificateId}
                                                />
                                            }
                                            fileName={`${cert.courseName}-Certificate.pdf`}
                                            className="w-full"
                                        >
                                            {({ loading: pdfLoading }) => (
                                                <button
                                                    disabled={pdfLoading}
                                                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#1E2EDE] text-[#FDFDFD] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-[#14C4E7] transition-all disabled:opacity-50"
                                                >
                                                    <Download size={16} />
                                                    {pdfLoading ? "..." : "PDF"}
                                                </button>
                                            )}
                                        </PDFDownloadLink>

                                        <BlobProvider
                                            document={
                                                <CertificatePDF
                                                    studentName={cert.studentName}
                                                    courseName={cert.courseName}
                                                    completionDate={cert.completedDate}
                                                    score={cert.score}
                                                    instructorName={cert.tutorName}
                                                    certificateId={cert.certificateId}
                                                />
                                            }
                                        >
                                            {({ url }) => (
                                                <button
                                                    onClick={() => window.open(url, "_blank")}
                                                    className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#1E2EDE] hover:text-[#1E2EDE] transition-all"
                                                >
                                                    <Eye size={16} />
                                                    Preview
                                                </button>
                                            )}
                                        </BlobProvider>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Empty State - Standard Theme */
                        <div className="col-span-full py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 flex flex-col items-center text-center px-6 shadow-2xl shadow-blue-900/5">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                                <Award size={48} className="text-slate-200" />
                            </div>
                            <h3 className="text-3xl font-black text-[#1E2EDE] uppercase tracking-tight">
                                No Certificates Found
                            </h3>
                            <p className="text-slate-400 font-medium mt-3 max-w-sm mx-auto">
                                Complete your active modules and pass final assessments to unlock your credentials.
                            </p>
                            <button
                                onClick={() => navigate("/user/courses/my-courses")}
                                className="mt-10 inline-flex items-center gap-3 px-10 py-4 bg-[#1E2EDE] text-[#E6D929] font-black rounded-2xl shadow-xl shadow-blue-100 uppercase text-[10px] tracking-widest hover:bg-[#14C4E7] transition-all transform hover:scale-105"
                            >
                                <BookOpen size={20} />
                                Continue Learning
                            </button>
                        </div>
                    )}
                </div>

                {/* Verification Info Section - Premium Design */}
                {!loading && certificates.length > 0 && (
                    <div className="mt-20 bg-[#1E2EDE] rounded-[3rem] p-10 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-blue-900/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#14C4E7] opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[1.5rem] border border-white/20 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-10 h-10 text-[#E6D929]" />
                        </div>
                        <div className="flex-1 text-center md:text-left relative z-10">
                            <h4 className="text-2xl font-black text-[#FDFDFD] tracking-tight">Global Verification</h4>
                            <p className="text-[#FDFDFD]/70 mt-2 font-medium">
                                Every certificate from Hokz Academy is cryptographically signed and carries a unique ID.
                                Recruiters can verify your skills instantly via our public portal.
                            </p>
                        </div>
                        <button className="whitespace-nowrap px-8 py-4 bg-[#E6D929] text-[#1E2EDE] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#14C4E7] hover:text-[#FDFDFD] transition-all flex items-center gap-2 shadow-xl">
                            <ExternalLink size={18} />
                            Integration Guide
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificates;
