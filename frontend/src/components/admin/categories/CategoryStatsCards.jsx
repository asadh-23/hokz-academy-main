const CategoryStatsCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {stats.total || 0}
                        </h3>
                        <p className="text-gray-600 text-sm">Total Categories</p>
                    </div>
                </div>
            </div>

            {/* Listed Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {stats.listed || 0}
                        </h3>
                        <p className="text-gray-600 text-sm">Listed Categories</p>
                    </div>
                </div>
            </div>

            {/* Unlisted Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {stats.unlisted || 0}
                        </h3>
                        <p className="text-gray-600 text-sm">Unlisted Categories</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryStatsCards;
