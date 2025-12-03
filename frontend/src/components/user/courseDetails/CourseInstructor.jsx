import { Award, Globe, Star } from "lucide-react";

const CourseInstructor = ({ tutor, averageRating }) => {
    if (!tutor) return null;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
            <div>
                <h3 className="font-bold text-indigo-600 text-lg mb-1">{tutor.fullName}</h3>
                <p className="text-gray-500 mb-4">Course Instructor</p>

                <div className="flex items-start gap-4 sm:gap-6">
                    {tutor.profileImage ? (
                        <img
                            src={tutor.profileImage}
                            alt={tutor.fullName}
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                            {tutor.fullName.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-900" />
                            <span>Professional Instructor</span>
                        </div>
                        {tutor.email && (
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-900" />
                                <span>{tutor.email}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-gray-900" />
                            <span>{averageRating || 0} Course Rating</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseInstructor;
