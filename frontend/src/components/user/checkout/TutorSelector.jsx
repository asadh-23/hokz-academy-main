const TutorSelector = ({ tutors, selectedTutor, onTutorSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (!tutors || tutors.length <= 1) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-black text-slate-900">
                            {selectedTutor ? selectedTutor.fullName : "Choose Tutor"}
                        </p>
                        {selectedTutor && (
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                {selectedTutor.courseCount} {selectedTutor.courseCount > 1 ? "Courses" : "Course"} in Cart
                            </p>
                        )}
                    </div>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-500" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-[1.5rem] shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="py-2">
                        {tutors.map((tutor) => (
                            <button
                                key={tutor._id}
                                onClick={() => {
                                    onTutorSelect(tutor);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-5 py-4 hover:bg-indigo-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-indigo-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900">{tutor.fullName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            Included Courses: {tutor.courseCount}
                                        </p>
                                    </div>
                                </div>
                                {selectedTutor?._id === tutor._id && (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
