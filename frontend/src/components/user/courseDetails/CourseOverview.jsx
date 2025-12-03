import { PlayCircle, Clock, Award, Globe } from "lucide-react";

const CourseOverview = ({ course, totalLessons, hours, minutes, seconds }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Overview</h2>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-50 rounded-lg">
                        <PlayCircle className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Lessons</p>
                        <p className="text-lg font-bold text-gray-900">{totalLessons}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <Clock className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="text-lg font-bold text-gray-900">
                            {hours > 0 && `${hours}h `}
                            {minutes > 0 && `${minutes}m `}
                            {seconds}s
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Level</p>
                        <p className="text-lg font-bold text-gray-900 capitalize">
                            {course.level || "All"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 rounded-lg">
                        <Globe className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Language</p>
                        <p className="text-lg font-bold text-gray-900">{course.language || "English"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseOverview;
