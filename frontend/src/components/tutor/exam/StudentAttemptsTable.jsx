import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User } from 'lucide-react';

const StudentAttemptsTable = ({ students }) => {
    const [expandedStudent, setExpandedStudent] = useState(null);

    const toggleRow = (id) => {
        setExpandedStudent(expandedStudent === id ? null : id);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!students || students.length === 0) {
        return (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Student Attempts</h3>
                <p className="text-gray-600 text-lg">
                    Student attempts will appear here once they start taking the exam.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Student Attempts</h2>
                    <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-2xl font-bold text-sm">
                        {students.length} Students
                    </span>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-6 font-bold">Student</th>
                            <th className="p-6 font-bold text-center">Attempts</th>
                            <th className="p-6 font-bold text-center">Status</th>
                            <th className="p-6 font-bold text-center">Best Score</th>
                            <th className="p-6 font-bold text-right">History</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((student) => (
                            <React.Fragment key={student._id}>
                                <StudentRow 
                                    student={student}
                                    isExpanded={expandedStudent === student._id}
                                    onToggle={() => toggleRow(student._id)}
                                />
                                {expandedStudent === student._id && (
                                    <StudentHistoryRow 
                                        student={student}
                                        formatDate={formatDate}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StudentRow = ({ student, isExpanded, onToggle }) => {
    return (
        <tr className={`hover:bg-gray-50 transition-all ${isExpanded ? "bg-indigo-50/50" : ""}`}>
            <td className="p-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img 
                            src={student.avatar || "https://via.placeholder.com/48"} 
                            alt="avatar" 
                            className="w-12 h-12 rounded-2xl border-2 border-gray-200 object-cover" 
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            student.passedCount > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-lg">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                </div>
            </td>
            <td className="p-6 text-center">
                <span className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-2xl text-sm font-bold text-gray-700">
                    {student.totalAttempts}
                </span>
            </td>
            <td className="p-6 text-center">
                {student.passedCount > 0 ? (
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm px-4 py-2 rounded-2xl">
                        Passed
                    </span>
                ) : (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm px-4 py-2 rounded-2xl">
                        Failed
                    </span>
                )}
            </td>
            <td className="p-6 text-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {student.bestScore}%
                </span>
            </td>
            <td className="p-6 text-right">
                <button 
                    onClick={onToggle}
                    className="p-3 hover:bg-gray-200 rounded-2xl text-gray-500 hover:text-gray-700 transition-all"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </td>
        </tr>
    );
};

const StudentHistoryRow = ({ student, formatDate }) => {
    return (
        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
            <td colSpan="5" className="p-6 pl-20">
                <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b border-gray-200">
                        <h4 className="font-bold text-gray-900">Attempt History</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-4 text-left font-bold">Date & Time</th>
                                    <th className="p-4 text-center font-bold">Result</th>
                                    <th className="p-4 text-center font-bold">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.attemptsHistory.map((attempt, idx) => (
                                    <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-700">
                                            {formatDate(attempt.completedAt)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {attempt.isPassed ? (
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl font-bold text-xs">
                                                    Passed
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-xl font-bold text-xs">
                                                    Failed
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center font-bold text-lg text-indigo-600">
                                            {attempt.score}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default StudentAttemptsTable;