import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  Lock, 
  ChevronRight, 
  FileText, 
  Award, 
  AlertCircle 
} from 'lucide-react';

const CourseLearning = () => {
  // Mock Course Data
  const [course] = useState({
    id: "react-101",
    title: "Mastering React Server Components",
    hasExam: true, // Set to false to test the "No Exam" message
    lessons: [
      { id: "l1", title: "Introduction to RSC", duration: "05:20", description: "Learn the fundamentals of Server Components vs Client Components.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l2", title: "Setting up Next.js 14", duration: "12:45", description: "Step-by-step guide to initializing a modern React project.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l3", title: "Data Fetching Patterns", duration: "18:10", description: "Deep dive into async/await patterns in server components.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l4", title: "Streaming and Suspense", duration: "10:30", description: "Improve UX by streaming UI components to the browser.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ]
  });

  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const activeLesson = course.lessons[activeLessonIdx];

  const toggleComplete = (lessonId) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  const isAllCompleted = completedLessons.length === course.lessons.length;
  const progressPercent = Math.round((completedLessons.length / course.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* --- Main Content (Video & Description) --- */}
      <div className="flex-1 overflow-y-auto pb-12">
        {/* Video Player */}
        <div className="bg-black aspect-video w-full shadow-2xl">
          <iframe
            className="w-full h-full"
            src={activeLesson.videoUrl}
            title={activeLesson.title}
            allowFullScreen
          ></iframe>
        </div>

        <div className="max-w-4xl mx-auto p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
              <p className="text-gray-500">Course: {course.title}</p>
            </div>
            <button 
              onClick={() => toggleComplete(activeLesson.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                completedLessons.includes(activeLesson.id)
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              }`}
            >
              {completedLessons.includes(activeLesson.id) ? (
                <><CheckCircle2 size={20} /> Completed</>
              ) : (
                "Mark as Completed"
              )}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-10">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              Lesson Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {activeLesson.description}
            </p>
          </div>

          {/* --- Conditional Exam Section --- */}
          {isAllCompleted ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {course.hasExam ? (
                <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                      <Award size={48} className="text-yellow-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">Final Examination</h2>
                      <p className="text-indigo-100">Ready to certify your skills? Take the final test now.</p>
                    </div>
                  </div>
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black px-8 py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap">
                    TAKE EXAM NOW
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-8 flex items-center gap-4 text-blue-800">
                  <AlertCircle size={24} />
                  <div>
                    <h3 className="font-bold">Course Completed!</h3>
                    <p className="opacity-80">This specific course does not require a final exam. Your certificate will be generated shortly.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
              <p className="text-gray-400 italic">Complete all lessons in the sidebar to unlock the final section.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Sidebar Navigation --- */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Course Content</h2>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500 font-medium">{progressPercent}% Completed</span>
              <span className="text-indigo-600 font-bold">{completedLessons.length}/{course.lessons.length}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.lessons.map((lesson, index) => {
            const isActive = activeLessonIdx === index;
            const isDone = completedLessons.includes(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLessonIdx(index)}
                className={`w-full flex items-start gap-4 p-4 transition-all border-b border-gray-50 text-left ${
                  isActive ? "bg-indigo-50/50" : "hover:bg-gray-50"
                }`}
              >
                <div className="mt-1">
                  {isDone ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : isActive ? (
                    <PlayCircle size={20} className="text-indigo-600" />
                  ) : (
                    <Circle size={20} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${isActive ? "text-indigo-700" : "text-gray-700"}`}>
                    {index + 1}. {lesson.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><PlayCircle size={12} /> {lesson.duration}</span>
                    {isDone && <span className="text-green-600 font-medium">Finished</span>}
                  </div>
                </div>
                {isActive && <ChevronRight size={16} className="text-indigo-600 mt-1" />}
              </button>
            );
          })}
          
          {/* Exam Link in Sidebar (Disabled until complete) */}
          <div className={`p-4 flex items-center gap-4 border-b border-gray-50 ${isAllCompleted ? "opacity-100" : "opacity-50"}`}>
            <Lock size={20} className={isAllCompleted ? "text-indigo-600" : "text-gray-300"} />
            <div>
              <h4 className="text-sm font-bold text-gray-700">Final Exam</h4>
              <p className="text-xs text-gray-400">Unlock after all lessons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;