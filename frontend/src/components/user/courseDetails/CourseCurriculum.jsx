import { PlayCircle } from "lucide-react";

const CourseCurriculum = ({ totalLessons, hours, minutes, seconds }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
            <div className="text-sm text-gray-500 mb-4 flex gap-2">
                <span>{totalLessons} lessons</span> •{" "}
                <span>
                    {hours > 0 && `${hours}h `}
                    {minutes > 0 && `${minutes}m `}
                    {seconds}s total length
                </span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white p-6">
                <div className="flex items-center justify-center flex-col gap-4 py-8">
                    <div className="p-4 bg-gray-100 rounded-full">
                        <PlayCircle className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                            Course Content Available After Enrollment
                        </p>
                        <p className="text-sm text-gray-600">
                            This course contains {totalLessons} lessons with{" "}
                            {hours > 0 && `${hours} hours, `}
                            {minutes > 0 && `${minutes} minutes, `}
                            and {seconds} seconds of video content.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Enroll now to access all course materials and start learning!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCurriculum;
