import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { toast } from "sonner";
import {
    fetchAdminCategories,
    toggleListAdminCategory,
    selectAdminCategories,
    selectAdminCategoryStats,
    selectAdminCategoryPagination,
    selectAdminCategoryFilters,
    setAdminCategoryFilters,
    resetAdminCategoryFilters,
} from "../../store/features/admin/adminCategorySlice";
import AddCategoryModal from "../../components/admin/categories/AddCategoryModal";
import EditCategoryModal from "../../components/admin/categories/EditCategoryModal";
import CategoryList from "../../components/admin/Categories/CategoryList";
import StatsCards from "../../components/common/StatsCards";
import Pagination from "../../components/common/Pagination";

const ManageCategory = () => {
    // -------------------- REDUX --------------------
    const dispatch = useDispatch();
    const categories = useSelector(selectAdminCategories);
    const stats = useSelector(selectAdminCategoryStats);
    const pagination = useSelector(selectAdminCategoryPagination);
    const filters = useSelector(selectAdminCategoryFilters);


    const [firstLoad, setFirstLoad] = useState(true);
    // -------------------- LOCAL STATE --------------------
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // -------------------- FETCH CATEGORIES --------------------
    const fetchCategories = async () => {
        try {
            await dispatch(
                fetchAdminCategories({
                    page: filters.page,
                    limit: filters.limit,
                    search: filters.search,
                    status: filters.status,
                })
            ).unwrap();
            setFirstLoad(false);
        } catch (error) {
            toast.error(error?.message || "Failed to load categories");
        }
    };

    // -------------------- EFFECTS --------------------
    useEffect(() => {
        fetchCategories();
    }, [filters.page, filters.status]);

    // Reset page when search or filter changes
    useEffect(() => {
        dispatch(setAdminCategoryFilters({ page: 1 }));
    }, [filters.search, filters.status]);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchCategories();
        }, 500);
        return () => clearTimeout(delay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.search]);

    // -------------------- HANDLERS --------------------
    const handleSearch = (e) => {
        dispatch(setAdminCategoryFilters({ search: e.target.value }));
    };

    const handleFilterChange = (e) => {
        dispatch(setAdminCategoryFilters({ status: e.target.value }));
    };

    const handleRefresh = () => {
        dispatch(resetAdminCategoryFilters());
    };

    const handlePageChange = (page) => {
        dispatch(setAdminCategoryFilters({ page }));
    };

    // -------------------- MODAL HANDLERS --------------------
    const handleAddClick = () => setShowAddModal(true);

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleCloseAddModal = () => setShowAddModal(false);

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedCategory(null);
    };

    const handleModalSuccess = () => {
        fetchCategories();
    };

    // -------------------- TOGGLE LIST / UNLIST --------------------
    const handleToggleListCategory = async (categoryId, categoryName, isListed) => {
        const actionText = isListed ? "Unlist" : "List";

        toast.warning(`Are you sure you want to ${actionText} ${categoryName}?`, {
            action: {
                label: actionText,
                onClick: async () => {
                    try {
                        const result = await dispatch(toggleListAdminCategory(categoryId)).unwrap();
                        toast.success(result?.message || `${categoryName} has been ${actionText}ed successfully`);
                        fetchCategories();
                    } catch (error) {
                        console.error(`Failed to ${actionText} category:`, error);
                        toast.error(error?.message || `Failed to ${actionText.toLowerCase()} category`);
                    }
                },
            },
            cancel: { label: "Cancel" },
        });
    };

    // -------------------- RENDER --------------------
    if (firstLoad) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <div className="flex flex-1">
                    <div className="flex justify-center items-center flex-1">
                        <PageLoader text="Loading Categories..." />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex flex-1">
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Management</h1>
                        <p className="text-gray-600">Manage course categories</p>
                    </div>

                    {/* Stats Cards */}
                    <StatsCards stats={stats} label={"Categories"} />

                    {/* Controls Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            {/* Left */}
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-gray-800">List of Categories</h2>

                                <select
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                >
                                    <option value="All Categories">All Categories</option>
                                    <option value="Listed">Listed</option>
                                    <option value="Unlisted">Unlisted</option>
                                </select>
                            </div>

                            {/* Right */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={filters.search}
                                        onChange={handleSearch}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 w-64"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>

                                {/* Refresh button */}
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-600 transition-colors"
                                >
                                    Refresh
                                </button>

                                <button
                                    type="button"
                                    onClick={handleAddClick}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    ADD CATEGORY
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories List */}
                    <CategoryList
                        categories={categories}
                        onEdit={handleEditClick}
                        onToggleList={handleToggleListCategory}
                    />

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalFilteredCategories}
                        itemsPerPage={filters.limit}
                        onPageChange={handlePageChange}
                        label="Categories"
                    />
                </div>
            </div>

            {/* Modals */}
            <AddCategoryModal isOpen={showAddModal} onClose={handleCloseAddModal} onSuccess={handleModalSuccess} />

            <EditCategoryModal
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                onSuccess={handleModalSuccess}
                category={selectedCategory}
            />
        </div>
    );
};

export default ManageCategory;
