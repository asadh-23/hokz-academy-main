import React, { useState, useEffect } from "react";
import { Award, Download, Eye, Search, Trophy, Calendar, CheckCircle, ExternalLink, BookOpen, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { userAxios } from "../../api/userAxios";
import CertificatePDF from "../../components/user/pdfs/CertificatePDF";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";

const Certificates = () => {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setLoading(true);

                const response = await userAxios.get("/courses/certificates");
                if (response.data.success) {
                    setCertificates(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching certificates:", error);
                toast.error("Failed to load certificates");
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

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
        <div className="min-h-screen bg-[#f3f4f6] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Award className="w-6 h-6 text-amber-600" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Certificates</h1>
                        </div>
                        <p className="text-gray-500">Celebrate your achievements and share your success with the world.</p>
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by course name..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats Summary */}
                {!loading && certificates.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                                <Trophy className="text-indigo-600 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Earned</p>
                                <p className="text-xl font-bold text-gray-900">{certificates.length} Certificates</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                                <Percent className="text-emerald-600 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Average Score</p>
                                <p className="text-xl font-bold text-gray-900">{averageScore}%</p>
                            </div>
                        </div>
                       
                    </div>
                )}

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map((i) => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />)
                    ) : filteredCertificates.length > 0 ? (
                        filteredCertificates.map((cert) => (
                            <div
                                key={cert.certificateId}
                                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col"
                            >
                                {/* Certificate Visual Preview */}
                                <div className="relative h-48 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 flex flex-col justify-center items-center text-center text-white overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <Award size={100} />
                                    </div>
                                    <div className="relative z-10 border-2 border-white/30 p-4 rounded-md w-full h-full flex flex-col justify-center">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-100">
                                            Certificate of Completion
                                        </p>
                                        <h3 className="text-lg font-serif font-bold mt-1 line-clamp-2 leading-tight">
                                            {cert.courseName}
                                        </h3>
                                        <div className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                                        <p className="mt-2 text-[10px] italic text-indigo-100">
                                            Awarded to {cert.studentName}
                                        </p>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                                                {cert.courseName}
                                            </h4>
                                            <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
                                                <Calendar size={14} />
                                                <span>Issued on {cert.completedDate}</span>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 px-2 py-1 rounded text-emerald-700 text-xs font-bold border border-emerald-100">
                                            Score: {cert.score}
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={cert.tutorProfileImage}
                                                    alt={cert.tutorName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/default-avatar.png";
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                                    Instructor
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700">{cert.tutorName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
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
                                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-70"
                                                >
                                                    <Download size={16} />
                                                    {pdfLoading ? "Loading..." : "Download"}
                                                </button>
                                            )}
                                        </PDFDownloadLink>

                                        {/* 2. PREVIEW BUTTON */}
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
                                                    onClick={() => window.open(url, "_blank")} // Open in new tab
                                                    className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
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
                        /* Empty State */
                        <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center text-center px-6">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                <Award size={48} className="text-indigo-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">No Certificates Yet</h3>
                            <p className="text-gray-500 mt-2 max-w-sm">
                                Complete your active courses and pass the assessments to unlock your professional
                                certificates.
                            </p>
                            <button
                                onClick={() => navigate("/user/courses/my-courses")}
                                className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                            >
                                <BookOpen size={20} />
                                Continue Learning
                            </button>
                        </div>
                    )}
                </div>

                {/* Verification Info Section */}
                {!loading && certificates.length > 0 && (
                    <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-bold text-gray-900">Verified Credentials</h4>
                            <p className="text-gray-500 mt-1">
                                All certificates issued by Hokz Academy include a unique verification ID. You can share
                                these on LinkedIn or with potential employers.
                            </p>
                        </div>
                        <button className="whitespace-nowrap px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
                            <ExternalLink size={18} />
                            How to Share
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificates;
