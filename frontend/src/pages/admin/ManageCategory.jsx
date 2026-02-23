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
import CategoryList from "../../components/admin/categories/CategoryList";
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
                }),
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
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-black text-[#1E2EDE] tracking-tighter uppercase">
                            Category <span className="text-[#14C4E7]">Management</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1">
                            Manage course categories
                        </p>
                        <div className="h-1 w-20 bg-[#E6D929] mt-4 rounded-full mx-auto md:mx-0"></div>
                    </div>

                    {/* Stats Cards */}
                    <StatsCards stats={stats} label={"Categories"} />

                    {/* Controls Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-1 rounded-2xl">
                            {/* Left Section: Title & Filter */}
                            <div className="flex flex-col md:flex-row md:items-center gap-5 w-full lg:w-auto">
                                <div className="relative">
                                    <h2 className="text-xl md:text-2xl font-black text-[#1E2EDE] tracking-tight uppercase">
                                        Category <span className="text-[#14C4E7]">Management</span>
                                    </h2>
                                    <div className="h-1 w-12 bg-[#E6D929] rounded-full mt-1"></div>
                                </div>

                                <div className="relative w-full md:w-48">
                                    <select
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#14C4E7]/20 focus:border-[#14C4E7] transition-all cursor-pointer"
                                    >
                                        <option value="All Categories">All Categories</option>
                                        <option value="Listed">Listed</option>
                                        <option value="Unlisted">Unlisted</option>
                                    </select>
                                    {/* Custom Arrow Icon for Select */}
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section: Search & Actions */}
                            <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                                {/* Search Bar */}
                                <div className="relative w-full md:w-72 group">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#14C4E7] transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={filters.search}
                                        onChange={handleSearch}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#14C4E7]/20 focus:border-[#14C4E7] transition-all"
                                    />
                                </div>

                                {/* Action Buttons Group */}
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button
                                        type="button"
                                        onClick={handleRefresh}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        <span className="md:hidden lg:inline">Refresh</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleAddClick}
                                        className="flex-[2] md:flex-none flex items-center justify-center gap-2 bg-[#1E2EDE] text-[#E6D929] px-5 py-2.5 rounded-xl text-sm font-black hover:shadow-lg hover:shadow-[#1E2EDE]/20 active:scale-95 transition-all uppercase tracking-wider"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        ADD CATEGORY
                                    </button>
                                </div>
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
