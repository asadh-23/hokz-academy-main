import { User, ShieldCheck, BookOpen } from "lucide-react";

const CoursesList = ({ courses }) => {
    if (!courses || courses.length === 0) return null;
     return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                        <BookOpen className="text-white w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Your Selection</h2>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                    {courses.length} {courses.length > 1 ? "Courses" : "Course"}
                </span>
            </div>

            <div className="divide-y divide-slate-100">
                {courses.map((course) => (
                    <div key={course._id} className="p-5 md:p-6 hover:bg-slate-50/30 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="relative shrink-0">
                                <img
                                    src={course.thumbnailUrl}
                                    alt={course.title}
                                    className="w-full sm:w-32 h-24 rounded-xl object-cover shadow-sm border border-slate-100"
                                />
                                <div className="absolute top-2 right-2 sm:hidden bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold">
                                    ₹{course.price}
                                </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight">{course.title}</h3>
                                    {course.tutor && (
                                        <div className="flex items-center gap-1.5 mb-3">
                                            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center">
                                                <User className="w-2.5 h-2.5 text-slate-500" />
                                            </div>
                                            <span className="text-sm text-slate-500 font-medium">by {course.tutor.fullName}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-tighter">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Lifetime Access
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-tighter">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Official Certificate
                                    </div>
                                </div>
                            </div>

                            <div className="hidden sm:block text-right shrink-0">
                                <p className="text-xl font-black text-slate-900">₹{course.price}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Single Purchase</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursesList;
