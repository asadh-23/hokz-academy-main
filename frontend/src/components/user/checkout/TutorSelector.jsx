import { useState } from "react";
import { ChevronDown, User, Check } from "lucide-react";

const TutorSelector = ({ tutors, selectedTutor, onTutorSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!tutors || tutors.length <= 1) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose a Tutor</h3>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">
                                {selectedTutor ? selectedTutor.fullName : "Select a tutor"}
                            </p>
                            {selectedTutor && (
                                <p className="text-xs text-gray-500">
                                    {selectedTutor.courseCount} course{selectedTutor.courseCount > 1 ? 's' : ''} in cart
                                </p>
                            )}
                        </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {tutors.map((tutor) => (
                            <button
                                key={tutor._id}
                                onClick={() => {
                                    onTutorSelect(tutor);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <User className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{tutor.fullName}</p>
                                        <p className="text-xs text-gray-500">
                                            {tutor.courseCount} course{tutor.courseCount > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                {selectedTutor && selectedTutor._id === tutor._id && (
                                    <Check className="w-4 h-4 text-green-600" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorSelector;