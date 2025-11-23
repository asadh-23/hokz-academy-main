import { useNavigate } from "react-router-dom";

const CategoryItem = ({ category, onEdit, onList, onUnlist }) => {
    const navigate = useNavigate();

    const handleViewCategory = () => {
        navigate(`/admin/category/${category._id}`);
    };
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-cyan-600">
                            {category.name}
                        </h3>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                category.isListed
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {category.isListed ? "Listed" : "Unlisted"}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600">
                        {category.description || "No description"}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                    <button
                        onClick={() => onEdit(category)}
                        className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors"
                    >
                        Edit
                    </button>

                    {category.isListed ? (
                        <button
                            onClick={() => onUnlist(category._id, category.name)}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                            Unlist
                        </button>
                    ) : (
                        <button
                            onClick={() => onList(category._id)}
                            className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                            List
                        </button>
                    )}

                    <button 
                        onClick={handleViewCategory}
                        className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-200 transition-colors"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryItem;
