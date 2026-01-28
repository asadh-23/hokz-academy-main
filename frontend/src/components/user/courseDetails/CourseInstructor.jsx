import { Award, Mail, Star } from "lucide-react"; // 1. Globe മാറ്റി Mail ആക്കി

const CourseInstructor = ({ tutor, averageRating }) => {
    if (!tutor) return null;

    // Rating formatting (Safe check)
    const ratingValue = averageRating ? Number(averageRating).toFixed(1) : "0.0";

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
            <div>
                <h3 className="font-bold text-indigo-600 text-lg mb-1">{tutor.fullName}</h3>
                <p className="text-gray-500 mb-4">Course Instructor</p>

                <div className="flex items-start gap-4 sm:gap-6">
                    {/* Profile Image / Avatar */}
                    {tutor.profileImage ? (
                        <img
                            src={tutor.profileImage}
                            alt={tutor.fullName}
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-sm">
                            {tutor.fullName?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Instructor Details */}
                    <div className="space-y-3 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-2.5">
                            <Award className="w-4 h-4 text-indigo-600" /> {/* Color added */}
                            <span className="font-medium">Professional Instructor</span>
                        </div>

                        {/* Email Section (Changed Icon to Mail) */}
                        {tutor.email && (
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-indigo-600" />
                                <span>{tutor.email}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2.5">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {/* Star Colored */}
                            <span className="font-medium">{ratingValue} Instructor Rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInstructor;