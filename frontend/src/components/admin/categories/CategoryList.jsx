import CategoryItem from "./CategoryItem";

const CategoryList = ({ categories, onEdit, onList, onUnlist }) => {
    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 text-sm italic">
                    No categories found.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {categories.map((category) => (
                <CategoryItem
                    key={category._id}
                    category={category}
                    onEdit={onEdit}
                    onList={onList}
                    onUnlist={onUnlist}
                />
            ))}
        </div>
    );
};

export default CategoryList;
