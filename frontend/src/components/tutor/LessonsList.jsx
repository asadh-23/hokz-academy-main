import { FiPlay, FiEdit2, FiTrash2 } from 'react-icons/fi';

const LessonsList = ({ lessons, onEditLesson, onRemoveLesson }) => {


  if (lessons.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Lessons</h2>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-14 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                {lesson.thumbnailUrl ? (
                  <img
                    src={lesson.thumbnailUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiPlay className="text-white text-2xl" />
                )}
              </div>

              {/* Lesson Info */}
              <div>
                <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                <p className="text-sm text-gray-500">
                  {(lesson.description || '').substring(0, 50)}...
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onRemoveLesson(lesson.id)}
                className="px-4 py-1.5 bg-red-100 text-red-600 rounded text-sm font-medium hover:bg-red-200 transition-colors flex items-center gap-1"
              >
                <FiTrash2 className="text-sm" />
                Remove
              </button>

              <button
                onClick={() => onEditLesson(lesson)}
                className="px-4 py-1.5 bg-teal-100 text-teal-600 rounded text-sm font-medium hover:bg-teal-200 transition-colors flex items-center gap-1"
              >
                <FiEdit2 className="text-sm" />
                Edit Lesson
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default LessonsList;
