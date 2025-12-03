import { Award, Check } from "lucide-react";

const CourseMotivation = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-100 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -ml-24 -mb-24"></div>
            
            <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Why This Course?</h3>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                    This course is designed to give you <span className="font-semibold text-indigo-700">real, practical skills</span> you can actually use. Every lesson is structured to help you understand concepts clearly, apply them confidently, and make real progress step by step.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                    Whether you're starting fresh or trying to take your skills to the next level, this course gives you everything you need in one place — <span className="font-semibold text-purple-700">clear explanations</span>, <span className="font-semibold text-purple-700">guided examples</span>, <span className="font-semibold text-purple-700">hands-on learning</span>, and support whenever you need it.
                </p>
                
                <div className="flex items-start gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200/50">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex-shrink-0 mt-1">
                        <Check className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-800 leading-relaxed font-medium">
                        If you're serious about upgrading your knowledge and building a stronger future, this is the right place to begin.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourseMotivation;
