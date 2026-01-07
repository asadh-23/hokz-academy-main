import { User, ShieldCheck } from "lucide-react";

const CoursesList = ({ courses }) => {
    if (!courses || courses.length === 0) return null;
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">{courses.length}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Selected {courses.length > 1 ? "Courses" : "Course"}</h2>
            </div>

            <div className="space-y-4">
                {courses.map((course) => {
                    return (
                        <div key={course._id} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                            <img
                                src={course.thumbnailUrl}
                                alt={course.title}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                                {course.tutor && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="w-3 h-3 text-gray-500" />
                                        <span className="text-sm text-gray-600">by {course.tutor.fullName}</span>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Tutor Chat Support
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Exams Included
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Official Certificate
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CoursesList;
