import { Award, Clock, FileText } from 'lucide-react';
import ExamStatsCard from './ExamStatsCard';
import ExamQuestionsList from './ExamQuestionsList';

const ExamDetailsView = ({ exam }) => {
    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ExamStatsCard 
                    icon={<Award size={28} />} 
                    label="Passing Score" 
                    value={`${exam.settings.passingScore}%`} 
                    color="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600" 
                />
                <ExamStatsCard 
                    icon={<Clock size={28} />} 
                    label="Time Limit" 
                    value={`${exam.settings.timeLimit} Mins`} 
                    color="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600" 
                />
                <ExamStatsCard 
                    icon={<FileText size={28} />} 
                    label="Total Questions" 
                    value={exam.questions.length} 
                    color="bg-gradient-to-br from-green-50 to-green-100 text-green-600" 
                />
            </div>

            {/* Questions List */}
            <ExamQuestionsList questions={exam.questions} />
        </div>
    );
};

export default ExamDetailsView;