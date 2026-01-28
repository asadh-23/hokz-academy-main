import { List, BarChart2 } from 'lucide-react';

const ExamTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        {
            id: 'details',
            label: 'Exam Details',
            icon: <List size={20} />
        },
        {
            id: 'analytics',
            label: 'Analytics & Results',
            icon: <BarChart2 size={20} />
        }
    ];

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 mb-8">
            <div className="flex items-center gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                            activeTab === tab.id
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                    >
                        {tab.icon} 
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExamTabs;