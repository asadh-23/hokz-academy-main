const ExamStatsCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:scale-105">
        <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    </div>
);

export default ExamStatsCard;