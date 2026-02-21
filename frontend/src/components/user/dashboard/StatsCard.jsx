import React from "react";
import { BookOpen, Award, CheckCircle, TrendingUp } from "lucide-react";

const StatsCard = ({ courses, certificates }) => {
    const totalEnrolled = courses?.length || 0;
    const completedCount = courses?.filter((c) => (c.progress || 0) === 100).length || 0;
    const ongoingCount = totalEnrolled - completedCount;
    const certificateCount = certificates?.length || 0;

    const statsData = [
        {
            label: "Total Enrolled Courses",
            value: totalEnrolled,
            icon: <BookOpen className="w-6 h-6 text-[#1E2EDE]" />,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100",
        },
        {
            label: "Ongoing Learning",
            value: ongoingCount,
            icon: <TrendingUp className="w-6 h-6 text-[#14C4E7]" />,
            bgColor: "bg-cyan-50",
            borderColor: "border-cyan-100",
        },
        {
            label: "Completed",
            value: completedCount,
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            bgColor: "bg-green-50",
            borderColor: "border-green-100",
        },
        {
            label: "Certificates",
            value: certificateCount,
            icon: <Award className="w-6 h-6 text-[#E6D929]" />,
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsData.map((stat, index) => (
                <div 
                    key={index} 
                    className={`p-6 rounded-[2rem] bg-white border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group`}
                >
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                            {stat.label}
                        </p>
                        <h4 className="text-2xl font-black text-slate-800">
                            {stat.value}
                        </h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCard;