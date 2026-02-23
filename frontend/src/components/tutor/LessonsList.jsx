import { FiPlay, FiEdit2, FiTrash2 } from 'react-icons/fi';

const LessonsList = ({ lessons, onEditLesson, onRemoveLesson }) => {


  if (lessons.length === 0) return null;

  return (
    // Mobile-il padding kuraykkuka (p-4 instead of p-8)
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 uppercase tracking-tight">
        Lessons
      </h2>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            // flex-col for mobile, flex-row for desktop
            className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-2xl hover:shadow-md transition-all bg-white group"
          >
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {/* Thumbnail: Mobile-il size kurachu koodi balancing aakkuka */}
              <div className="w-16 h-12 md:w-20 md:h-14 bg-gray-900 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {lesson.thumbnailUrl ? (
                  <img
                    src={lesson.thumbnailUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiPlay className="text-white text-lg md:text-2xl" />
                )}
              </div>

              {/* Lesson Info */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">
                  {lesson.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {lesson.description || 'No description available'}
                </p>
              </div>
            </div>

            {/* Actions: Mobile-il full width buttons */}
            <div className="flex items-center gap-2 md:gap-3 border-t md:border-t-0 pt-3 md:pt-0">
              <button
                onClick={() => onRemoveLesson(lesson.id)}
                className="flex-1 md:flex-none justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <FiTrash2 />
                <span>Remove</span>
              </button>

              <button
                onClick={() => onEditLesson(lesson)}
                className="flex-1 md:flex-none justify-center px-4 py-2 bg-[#14C4E7]/10 text-[#14C4E7] rounded-xl text-xs font-bold hover:bg-[#14C4E7]/20 transition-colors flex items-center gap-2"
              >
                <FiEdit2 />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsList;
