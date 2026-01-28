import { CheckCircle } from 'lucide-react';

const ExamQuestionsList = ({ questions }) => {
    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Questions Preview</h2>
                <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-2xl font-bold text-sm">
                    {questions.length} Questions
                </span>
            </div>
            <div className="space-y-8">
                {questions.map((question, index) => (
                    <QuestionCard 
                        key={index} 
                        question={question} 
                        index={index} 
                    />
                ))}
            </div>
        </div>
    );
};

const QuestionCard = ({ question, index }) => {
    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-gray-900 text-lg leading-relaxed flex-1 mr-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full text-sm font-bold mr-3">
                        {index + 1}
                    </span>
                    {question.question}
                </h4>
                <span className="text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-xl whitespace-nowrap">
                    {question.points} Pts
                </span>
            </div>
            <ul className="space-y-3 ml-11">
                {question.options.map((option, optionIndex) => (
                    <li 
                        key={optionIndex} 
                        className={`flex items-center gap-3 text-sm p-3 rounded-xl transition-all ${
                            optionIndex === question.correctAnswer 
                                ? "bg-green-50 text-green-700 font-semibold border border-green-200" 
                                : "text-gray-600 bg-white border border-gray-200"
                        }`}
                    >
                        {optionIndex === question.correctAnswer ? (
                            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                        ) : (
                            <div className="w-4 h-4 border-2 rounded-full border-gray-300 flex-shrink-0"></div>
                        )}
                        <span className="flex-1">{option}</span>
                        {optionIndex === question.correctAnswer && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg font-bold">
                                Correct
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExamQuestionsList;